import React, { useState } from 'react';
import { Document, User } from '../types';
import Button from './ui/Button';

interface KnowledgeBasePanelProps {
  documents: Document[];
  onAddDocument: (doc: Omit<Document, 'id' | 'createdAt'>) => void;
  onDeleteDocument: (id: string) => void;
  currentUser: User;
  isOpen: boolean;
  onClose: () => void;
}

const KnowledgeBasePanel: React.FC<KnowledgeBasePanelProps> = ({
  documents,
  onAddDocument,
  onDeleteDocument,
  currentUser,
  isOpen,
  onClose
}) => {
  const [activeTab, setActiveTab] = useState<'project' | 'user'>('project');
  const [newDocTitle, setNewDocTitle] = useState('');
  const [newDocContent, setNewDocContent] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  if (!isOpen) return null;

  const filteredDocs = documents.filter(doc => doc.type === activeTab);

  const handleSave = () => {
    if (!newDocTitle.trim() || !newDocContent.trim()) return;
    onAddDocument({
      title: newDocTitle,
      content: newDocContent,
      type: activeTab
    });
    setNewDocTitle('');
    setNewDocContent('');
    setIsAdding(false);
  };

  const canEdit = activeTab === 'user' || (activeTab === 'project' && currentUser.isAdmin);

  return (
    <div className="absolute inset-y-0 right-0 w-96 bg-gray-900 border-l border-gray-700 shadow-xl z-20 flex flex-col transform transition-transform duration-300">
      <div className="p-4 border-b border-gray-700 flex justify-between items-center bg-gray-800">
        <h2 className="text-lg font-semibold text-white">Knowledge Base</h2>
        <button onClick={onClose} className="text-gray-400 hover:text-white">
          <i className="fas fa-times"></i>
        </button>
      </div>

      <div className="flex border-b border-gray-700">
        <button
          className={`flex-1 py-3 text-sm font-medium ${activeTab === 'project' ? 'text-blue-400 border-b-2 border-blue-400 bg-gray-800' : 'text-gray-400 hover:text-gray-200'}`}
          onClick={() => setActiveTab('project')}
        >
          <i className="fas fa-building mr-2"></i> Project (Global)
        </button>
        <button
          className={`flex-1 py-3 text-sm font-medium ${activeTab === 'user' ? 'text-green-400 border-b-2 border-green-400 bg-gray-800' : 'text-gray-400 hover:text-gray-200'}`}
          onClick={() => setActiveTab('user')}
        >
          <i className="fas fa-user-lock mr-2"></i> User (Private)
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {filteredDocs.length === 0 && !isAdding && (
          <div className="text-center text-gray-500 mt-10">
            <i className="fas fa-folder-open text-4xl mb-3"></i>
            <p>No documents found.</p>
          </div>
        )}

        {filteredDocs.map(doc => (
          <div key={doc.id} className="bg-gray-800 rounded-lg p-3 border border-gray-700 hover:border-gray-600 transition-colors">
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-medium text-gray-200 truncate pr-2">{doc.title}</h3>
              {canEdit && (
                <button 
                  onClick={() => onDeleteDocument(doc.id)}
                  className="text-gray-500 hover:text-red-400 transition-colors"
                >
                  <i className="fas fa-trash-alt"></i>
                </button>
              )}
            </div>
            <p className="text-xs text-gray-500 line-clamp-3 font-mono bg-gray-900 p-2 rounded">
              {doc.content}
            </p>
          </div>
        ))}
      </div>

      {isAdding ? (
        <div className="p-4 border-t border-gray-700 bg-gray-800">
          <input
            type="text"
            placeholder="Document Title"
            className="w-full bg-gray-900 border border-gray-700 rounded p-2 mb-2 text-white focus:ring-2 focus:ring-blue-500 outline-none"
            value={newDocTitle}
            onChange={(e) => setNewDocTitle(e.target.value)}
          />
          <textarea
            placeholder="Paste document content here..."
            className="w-full bg-gray-900 border border-gray-700 rounded p-2 mb-2 text-white h-32 focus:ring-2 focus:ring-blue-500 outline-none text-sm font-mono"
            value={newDocContent}
            onChange={(e) => setNewDocContent(e.target.value)}
          />
          <div className="flex gap-2">
            <Button variant="primary" size="sm" onClick={handleSave} className="flex-1">Save</Button>
            <Button variant="secondary" size="sm" onClick={() => setIsAdding(false)} className="flex-1">Cancel</Button>
          </div>
        </div>
      ) : (
        canEdit && (
          <div className="p-4 border-t border-gray-700 bg-gray-800">
            <Button 
              variant="primary" 
              className="w-full" 
              icon={<i className="fas fa-plus"></i>}
              onClick={() => setIsAdding(true)}
            >
              Add Document
            </Button>
          </div>
        )
      )}
    </div>
  );
};

export default KnowledgeBasePanel;