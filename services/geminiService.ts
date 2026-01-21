import { GoogleGenAI } from "@google/genai";
import { Message, Role, Document, UserSettings } from "../types";

// Helper to sanitize and format documents for the prompt
const formatKnowledgeBase = (projectDocs: Document[], userDocs: Document[], settings: UserSettings): string => {
  let kbString = "";

  if (settings.useProjectKnowledge && projectDocs.length > 0) {
    kbString += "\n\n--- PROJECT (GLOBAL) KNOWLEDGE BASE ---\n";
    projectDocs.forEach(doc => {
      kbString += `Document: ${doc.title}\nContent:\n${doc.content}\n---\n`;
    });
  }

  if (settings.useUserKnowledge && userDocs.length > 0) {
    kbString += "\n\n--- USER (PRIVATE) KNOWLEDGE BASE ---\n";
    userDocs.forEach(doc => {
      kbString += `Document: ${doc.title}\nContent:\n${doc.content}\n---\n`;
    });
  }

  return kbString;
};

export const generateRAGResponse = async (
  currentMessage: string,
  history: Message[],
  projectDocs: Document[],
  userDocs: Document[],
  settings: UserSettings
): Promise<string> => {
  if (!process.env.API_KEY) {
    throw new Error("API Key is missing.");
  }

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  // 1. Construct the Knowledge Base Context
  const knowledgeContext = formatKnowledgeBase(projectDocs, userDocs, settings);

  // 2. Strict System Instruction
  const systemInstruction = `
You are a secure, document-grounded AI assistant for the SecureDocs platform.
Your primary directive is to answer user questions STRICTLY based on the provided "PROJECT KNOWLEDGE BASE" and "USER KNOWLEDGE BASE".

RULES:
1. Answer ONLY from the retrieved documents provided in the context.
2. NEVER use general or prior knowledge to answer queries about facts not present in the documents.
3. NEVER hallucinate or invent information.
4. If the answer is not found in the provided documents, you MUST respond with exactly: "The provided documents do not contain this information."
5. If the user asks a greeting or general conversational question (e.g., "Hi", "Help"), you may be polite but remind them you are restricted to the document context.

CONTEXT:
${knowledgeContext}
`;

  // 3. Filter History based on Context Window Settings
  // We take the last N messages based on settings.contextHistoryLimit
  const recentHistory = history
    .slice(-settings.contextHistoryLimit)
    .map(msg => ({
      role: msg.role === Role.USER ? 'user' : 'model',
      parts: [{ text: msg.content }]
    }));

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: [
        ...recentHistory,
        { role: 'user', parts: [{ text: currentMessage }] }
      ],
      config: {
        systemInstruction: systemInstruction,
        temperature: 0.3, // Low temperature for factual grounding
      }
    });

    return response.text || "No response generated.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Error connecting to AI service. Please check your API key or connection.";
  }
};