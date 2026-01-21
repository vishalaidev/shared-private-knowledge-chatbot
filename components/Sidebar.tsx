import React from 'react';
import { ChatSession, User } from '../types';
import Button from './ui/Button';

interface SidebarProps {
  sessions: ChatSession[];
  currentSessionId: string | null;
  onSelectSession: (id: string) => void;
  onNewChat: () => void;
  onDeleteSession: (id: string) => void;
  currentUser: User;
  onLogout: () => void;
  toggleSettings: () => void;
  toggleKB: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({
  sessions,
  currentSessionId,
  onSelectSession,
  onNewChat,
  onDeleteSession,
  currentUser,
  onLogout,
  toggleSettings,
  toggleKB
}) => {
  return (
    <div className="w-64 bg-gray-950 flex flex-col h-full border-r border-gray-800 flex-shrink-0">
      <div className="p-4">
        <div className="flex items-center gap-2 mb-6 px-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <i className="fas fa-shield-alt text-white"></i>
          </div>
          <span className="font-bold text-lg tracking-tight text-white">SecureDocs</span>
        </div>
        
        <Button 
          variant="primary" 
          className="w-full justify-start shadow-lg shadow-blue-900/20" 
          onClick={onNewChat}
          icon={<i className="fas fa-plus"></i>}
        >
          New Chat
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto px-2 space-y-1">
        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-3 mb-2 mt-2">History</h3>
        {sessions.map(session => (
          <div key={session.id} className="group relative">
            <button
              onClick={() => onSelectSession(session.id)}
              className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors flex items-center gap-3 ${
                currentSessionId === session.id
                  ? 'bg-gray-800 text-white'
                  : 'text-gray-400 hover:bg-gray-900 hover:text-gray-200'
              }`}
            >
              <i className="fas fa-message text-xs opacity-70"></i>
              <span className="truncate flex-1">{session.title}</span>
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDeleteSession(session.id);
              }}
              className="absolute right-2 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 text-gray-500 hover:text-red-400 transition-opacity p-1"
            >
              <i className="fas fa-times"></i>
            </button>
          </div>
        ))}
        {sessions.length === 0 && (
          <div className="text-xs text-gray-600 px-3 italic">No chat history</div>
        )}
      </div>

      <div className="p-4 border-t border-gray-800 space-y-1">
        <button 
          onClick={toggleKB}
          className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-300 hover:bg-gray-800 rounded-lg transition-colors"
        >
          <i className="fas fa-database text-blue-400"></i>
          Knowledge Base
        </button>
        
        <button 
          onClick={toggleSettings}
          className="w-full flex items-center gap-3 px-3 py-2 text-sm text-gray-300 hover:bg-gray-800 rounded-lg transition-colors"
        >
          <i className="fas fa-cog text-gray-400"></i>
          Context Controls
        </button>

        <div className="pt-4 mt-2 border-t border-gray-800 flex items-center justify-between px-2">
          <div className="flex items-center gap-2">
            <img 
              src={currentUser.avatarUrl} 
              alt="User" 
              className="w-8 h-8 rounded-full border border-gray-600"
            />
            <div className="flex flex-col">
              <span className="text-xs font-medium text-white max-w-[80px] truncate">{currentUser.name}</span>
              <span className="text-[10px] text-gray-500">{currentUser.isAdmin ? 'Admin' : 'User'}</span>
            </div>
          </div>
          <button 
            onClick={onLogout}
            className="text-gray-500 hover:text-white transition-colors"
            title="Sign Out"
          >
            <i className="fas fa-sign-out-alt"></i>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;