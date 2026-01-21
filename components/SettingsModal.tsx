import React from 'react';
import { UserSettings } from '../types';
import Button from './ui/Button';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: UserSettings;
  onUpdateSettings: (settings: UserSettings) => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose, settings, onUpdateSettings }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-70 backdrop-blur-sm">
      <div className="bg-gray-800 rounded-xl shadow-2xl border border-gray-700 w-full max-w-md p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <i className="fas fa-sliders-h text-blue-500"></i> Context Controls
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <i className="fas fa-times text-lg"></i>
          </button>
        </div>

        <div className="space-y-6">
          {/* History Limit */}
          <div>
            <div className="flex justify-between mb-2">
              <label className="text-sm font-medium text-gray-300">History Context Window</label>
              <span className="text-sm text-blue-400 font-mono">{settings.contextHistoryLimit} msgs</span>
            </div>
            <input
              type="range"
              min="0"
              max="20"
              step="1"
              value={settings.contextHistoryLimit}
              onChange={(e) => onUpdateSettings({ ...settings, contextHistoryLimit: parseInt(e.target.value) })}
              className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
            />
            <p className="text-xs text-gray-500 mt-1">Number of past messages sent to the AI for context.</p>
          </div>

          {/* Retrieval Sources */}
          <div>
            <label className="text-sm font-medium text-gray-300 block mb-3">Knowledge Retrieval Sources</label>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-gray-900 rounded-lg border border-gray-700">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded bg-blue-900/30 flex items-center justify-center text-blue-400">
                    <i className="fas fa-building"></i>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-white">Project Knowledge</div>
                    <div className="text-xs text-gray-500">Global shared documents</div>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    className="sr-only peer"
                    checked={settings.useProjectKnowledge}
                    onChange={(e) => onUpdateSettings({ ...settings, useProjectKnowledge: e.target.checked })}
                  />
                  <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>

              <div className="flex items-center justify-between p-3 bg-gray-900 rounded-lg border border-gray-700">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded bg-green-900/30 flex items-center justify-center text-green-400">
                    <i className="fas fa-user-lock"></i>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-white">User Knowledge</div>
                    <div className="text-xs text-gray-500">Your private documents</div>
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    className="sr-only peer"
                    checked={settings.useUserKnowledge}
                    onChange={(e) => onUpdateSettings({ ...settings, useUserKnowledge: e.target.checked })}
                  />
                  <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                </label>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 pt-4 border-t border-gray-700 flex justify-end">
          <Button onClick={onClose}>Done</Button>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;