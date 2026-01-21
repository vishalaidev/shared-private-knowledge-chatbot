import React, { useRef, useEffect } from 'react';
import { Message, Role } from '../types';

interface ChatInterfaceProps {
  messages: Message[];
  isLoading: boolean;
  onSendMessage: (text: string) => void;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ messages, isLoading, onSendMessage }) => {
  const [input, setInput] = React.useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    onSendMessage(input);
    setInput('');
  };

  return (
    <div className="flex flex-col h-full bg-gray-900 relative">
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-500 opacity-50">
            <i className="fas fa-robot text-6xl mb-4"></i>
            <p className="text-lg">SecureDocs AI initialized.</p>
            <p className="text-sm">Ask a question about the Knowledge Base.</p>
          </div>
        ) : (
          messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${msg.role === Role.USER ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] rounded-2xl px-5 py-3 shadow-md ${
                  msg.role === Role.USER
                    ? 'bg-blue-600 text-white rounded-br-none'
                    : 'bg-gray-800 text-gray-100 rounded-bl-none border border-gray-700'
                }`}
              >
                <div className="flex items-center gap-2 mb-1 opacity-75 text-xs font-bold uppercase tracking-wider">
                  {msg.role === Role.USER ? (
                    <>You <i className="fas fa-user"></i></>
                  ) : (
                    <><i className="fas fa-shield-alt text-green-400"></i> AI Assistant</>
                  )}
                </div>
                <div className="whitespace-pre-wrap leading-relaxed">{msg.content}</div>
              </div>
            </div>
          ))
        )}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-gray-800 rounded-2xl rounded-bl-none px-5 py-4 border border-gray-700 flex items-center gap-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-green-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
              <div className="w-2 h-2 bg-green-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 border-t border-gray-800 bg-gray-900/95 backdrop-blur">
        <form onSubmit={handleSubmit} className="max-w-4xl mx-auto relative">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask a question based on your documents..."
            className="w-full bg-gray-800 text-white rounded-xl pl-4 pr-12 py-4 shadow-lg border border-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="absolute right-2 top-2 bottom-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg px-4 disabled:opacity-50 disabled:bg-gray-700 transition-colors"
          >
            <i className="fas fa-paper-plane"></i>
          </button>
        </form>
        <div className="text-center mt-2">
          <p className="text-xs text-gray-500">
            <i className="fas fa-lock mr-1"></i>
            Responses are strictly grounded in retrieved documents. Hallucinations are prevented.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;