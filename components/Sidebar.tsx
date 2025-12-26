
import React from 'react';
import { PatentDocument } from '../types';

interface SidebarProps {
  history: PatentDocument[];
  currentId?: string;
  onSelect: (doc: PatentDocument) => void;
  onNew: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ history, currentId, onSelect, onNew }) => {
  return (
    <aside className="w-64 bg-slate-900 text-slate-300 h-screen flex flex-col no-print">
      <div className="p-6 border-b border-slate-800 flex items-center gap-3">
        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center font-bold text-white">智</div>
        <h1 className="text-xl font-bold text-white tracking-tight">智专笔</h1>
      </div>
      
      <div className="p-4">
        <button 
          onClick={onNew}
          className="w-full py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-md transition-colors flex items-center justify-center gap-2 text-sm font-medium"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>
          新建专利任务
        </button>
      </div>

      <nav className="flex-1 overflow-y-auto p-4 space-y-1">
        <p className="px-2 py-1 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">历史记录</p>
        {history.length === 0 ? (
          <div className="px-2 py-4 text-sm text-slate-500 italic">暂无历史记录</div>
        ) : (
          history.map(doc => (
            <button
              key={doc.id}
              onClick={() => onSelect(doc)}
              className={`w-full text-left px-3 py-2 rounded-md text-sm transition-all truncate ${
                currentId === doc.id ? 'bg-slate-800 text-white shadow-sm' : 'hover:bg-slate-800/50'
              }`}
            >
              {doc.title}
            </button>
          ))
        )}
      </nav>

      <div className="p-4 border-t border-slate-800">
        <div className="flex items-center gap-3 text-xs text-slate-500">
          <div className="w-2 h-2 rounded-full bg-green-500"></div>
          Gemini 3 Pro 已就绪
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
