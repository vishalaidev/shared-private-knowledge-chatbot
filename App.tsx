import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import ChatInterface from './components/ChatInterface';
import KnowledgeBasePanel from './components/KnowledgeBasePanel';
import SettingsModal from './components/SettingsModal';
import { ChatSession, Message, Role, Document, User, UserSettings } from './types';
import { generateRAGResponse } from './services/geminiService';
import Button from './components/ui/Button';

// Initial Mock Data
const MOCK_PROJECT_DOCS: Document[] = [
  {
    id: 'p1',
    title: 'Company Remote Work Policy',
    content: 'Employees are allowed to work remotely up to 3 days a week. Core hours are 10 AM to 3 PM EST. All remote work must be approved by the department manager.',
    type: 'project',
    createdAt: Date.now()
  },
  {
    id: 'p2',
    title: 'Security Protocols 2024',
    content: 'All passwords must be at least 16 characters long. Multi-factor authentication (MFA) is mandatory for all internal systems. Data classification Levels: Public, Internal, Confidential, Restricted.',
    type: 'project',
    createdAt: Date.now()
  }
];

const MOCK_USER: User = {
  id: 'u1',
  email: 'alex.dev@example.com',
  name: 'Alex Developer',
  avatarUrl: 'https://picsum.photos/200',
  isAdmin: true // Set to true to demo project doc editing
};

const App: React.FC = () => {
  // --- State ---
  const [user, setUser] = useState<User | null>(null);
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [documents, setDocuments] = useState<Document[]>(MOCK_PROJECT_DOCS);
  
  // UI State
  const [isKBOpen, setIsKBOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Settings
  const [settings, setSettings] = useState<UserSettings>({
    contextHistoryLimit: 6,
    useProjectKnowledge: true,
    useUserKnowledge: true
  });

  // --- Effects ---
  
  // Load from local storage on mount (Simulation)
  useEffect(() => {
    const savedSessions = localStorage.getItem('secureDocs_sessions');
    if (savedSessions) setSessions(JSON.parse(savedSessions));
    
    const savedDocs = localStorage.getItem('secureDocs_documents');
    if (savedDocs) setDocuments(JSON.parse(savedDocs));
    else setDocuments(MOCK_PROJECT_DOCS); // Fallback to mock
  }, []);

  // Save to local storage on change
  useEffect(() => {
    if (sessions.length > 0) localStorage.setItem('secureDocs_sessions', JSON.stringify(sessions));
    localStorage.setItem('secureDocs_documents', JSON.stringify(documents));
  }, [sessions, documents]);

  // --- Handlers ---

  const handleLogin = () => {
    // Simulating Google OAuth Login
    setUser(MOCK_USER);
  };

  const handleLogout = () => {
    setUser(null);
    setCurrentSessionId(null);
  };

  const createNewChat = () => {
    const newSession: ChatSession = {
      id: Date.now().toString(),
      title: 'New Conversation',
      messages: [],
      createdAt: Date.now(),
      updatedAt: Date.now()
    };
    setSessions([newSession, ...sessions]);
    setCurrentSessionId(newSession.id);
  };

  const handleDeleteSession = (id: string) => {
    setSessions(sessions.filter(s => s.id !== id));
    if (currentSessionId === id) setCurrentSessionId(null);
  };

  const handleSendMessage = async (text: string) => {
    if (!currentSessionId) return;

    // 1. Add User Message
    const userMsg: Message = {
      id: Date.now().toString(),
      role: Role.USER,
      content: text,
      timestamp: Date.now()
    };

    const updatedSessions = sessions.map(s => {
      if (s.id === currentSessionId) {
        return { 
          ...s, 
          messages: [...s.messages, userMsg],
          title: s.messages.length === 0 ? text.slice(0, 30) + (text.length > 30 ? '...' : '') : s.title,
          updatedAt: Date.now() 
        };
      }
      return s;
    });
    setSessions(updatedSessions);
    setIsLoading(true);

    // 2. RAG Retrieval & Generation
    const currentSession = updatedSessions.find(s => s.id === currentSessionId);
    if (!currentSession) return;

    const projectDocs = documents.filter(d => d.type === 'project');
    const userDocs = documents.filter(d => d.type === 'user');

    const aiResponseText = await generateRAGResponse(
      text,
      currentSession.messages,
      projectDocs,
      userDocs,
      settings
    );

    // 3. Add AI Message
    const aiMsg: Message = {
      id: (Date.now() + 1).toString(),
      role: Role.MODEL,
      content: aiResponseText,
      timestamp: Date.now()
    };

    setSessions(prev => prev.map(s => {
      if (s.id === currentSessionId) {
        return { ...s, messages: [...s.messages, aiMsg] };
      }
      return s;
    }));
    setIsLoading(false);
  };

  const handleAddDocument = (doc: Omit<Document, 'id' | 'createdAt'>) => {
    const newDoc: Document = {
      ...doc,
      id: Date.now().toString(),
      createdAt: Date.now()
    };
    setDocuments([...documents, newDoc]);
  };

  const handleDeleteDocument = (id: string) => {
    setDocuments(documents.filter(d => d.id !== id));
  };

  // --- Render ---

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-gray-800 rounded-2xl shadow-2xl p-8 text-center border border-gray-700">
          <div className="w-16 h-16 bg-blue-600 rounded-xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-blue-500/30">
             <i className="fas fa-shield-alt text-3xl text-white"></i>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">SecureDocs Chat</h1>
          <p className="text-gray-400 mb-8">Enterprise-grade secure chatbot with strict document grounding and private knowledge bases.</p>
          
          <button 
            onClick={handleLogin}
            className="w-full bg-white hover:bg-gray-100 text-gray-900 font-semibold py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-3 shadow-md"
          >
            <img src="https://www.google.com/favicon.ico" alt="Google" className="w-5 h-5" />
            Sign in with Google
          </button>
          
          <div className="mt-6 text-xs text-gray-500">
            <p>Access restricted to authorized personnel.</p>
            <p>Project-level and User-level data isolation enforced.</p>
          </div>
        </div>
      </div>
    );
  }

  const currentSession = sessions.find(s => s.id === currentSessionId);

  return (
    <div className="flex h-screen overflow-hidden bg-gray-900">
      <Sidebar 
        sessions={sessions}
        currentSessionId={currentSessionId}
        onSelectSession={setCurrentSessionId}
        onNewChat={createNewChat}
        onDeleteSession={handleDeleteSession}
        currentUser={user}
        onLogout={handleLogout}
        toggleSettings={() => setIsSettingsOpen(true)}
        toggleKB={() => setIsKBOpen(prev => !prev)}
      />

      <div className="flex-1 flex flex-col relative h-full">
        {currentSessionId ? (
          <ChatInterface 
            messages={currentSession?.messages || []}
            isLoading={isLoading}
            onSendMessage={handleSendMessage}
          />
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-gray-400 bg-gray-900">
            <div className="w-20 h-20 bg-gray-800 rounded-full flex items-center justify-center mb-6">
              <i className="fas fa-comments text-4xl text-gray-600"></i>
            </div>
            <h2 className="text-xl font-semibold mb-2">Welcome, {user.name}</h2>
            <p className="max-w-md text-center text-gray-500 mb-6">Select a chat from the sidebar or start a new conversation to query the Knowledge Base.</p>
            <Button onClick={createNewChat} icon={<i className="fas fa-plus"></i>}>Start New Chat</Button>
          </div>
        )}

        {/* Knowledge Base Panel (Slide-over) */}
        <KnowledgeBasePanel 
          isOpen={isKBOpen}
          onClose={() => setIsKBOpen(false)}
          documents={documents}
          currentUser={user}
          onAddDocument={handleAddDocument}
          onDeleteDocument={handleDeleteDocument}
        />
      </div>

      <SettingsModal 
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        settings={settings}
        onUpdateSettings={setSettings}
      />
    </div>
  );
};

export default App;