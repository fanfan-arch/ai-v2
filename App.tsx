
import React, { useState, useEffect, useCallback } from 'react';
import { PatentDocument, FileData } from './types';
import Sidebar from './components/Sidebar';
import FileUpload from './components/FileUpload';
import PatentView from './components/PatentView';
import { PatentService } from './services/geminiService';

const App: React.FC = () => {
  const [history, setHistory] = useState<PatentDocument[]>([]);
  const [currentDoc, setCurrentDoc] = useState<PatentDocument | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showUpload, setShowUpload] = useState(true);

  // Persistence
  useEffect(() => {
    const saved = localStorage.getItem('patent_history');
    if (saved) {
      try {
        setHistory(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to load history", e);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('patent_history', JSON.stringify(history));
  }, [history]);

  const handleFilesSelected = async (files: FileData[]) => {
    setIsLoading(true);
    try {
      const service = new PatentService();
      const newDoc = await service.analyzeAndGenerate(files);
      setHistory(prev => [newDoc, ...prev]);
      setCurrentDoc(newDoc);
      setShowUpload(false);
    } catch (error) {
      console.error("Patent generation failed", error);
      alert("撰写失败，请检查 API Key 或文件内容。");
    } finally {
      setIsLoading(false);
    }
  };

  const selectDocument = (doc: PatentDocument) => {
    setCurrentDoc(doc);
    setShowUpload(false);
  };

  const startNewTask = () => {
    setCurrentDoc(null);
    setShowUpload(true);
  };

  return (
    <div className="flex min-h-screen">
      <Sidebar 
        history={history} 
        currentId={currentDoc?.id} 
        onSelect={selectDocument} 
        onNew={startNewTask}
      />
      
      <main className="flex-1 bg-slate-50 overflow-y-auto">
        <div className="container mx-auto px-6 py-12">
          {showUpload ? (
            <FileUpload onFilesSelected={handleFilesSelected} isLoading={isLoading} />
          ) : (
            currentDoc && <PatentView document={currentDoc} />
          )}
        </div>
      </main>

      {/* Global Loading Overlay */}
      {isLoading && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-6">
          <div className="bg-white rounded-3xl p-10 max-w-lg w-full shadow-2xl text-center">
            <div className="relative w-24 h-24 mx-auto mb-8">
              <div className="absolute inset-0 border-4 border-blue-100 rounded-full"></div>
              <div className="absolute inset-0 border-4 border-blue-600 rounded-full border-t-transparent animate-spin"></div>
              <div className="absolute inset-0 flex items-center justify-center text-blue-600 font-bold">AI</div>
            </div>
            <h3 className="text-2xl font-bold text-slate-800 mb-4">智专笔正在深度思考...</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3 justify-center text-slate-500 text-sm animate-pulse">
                <span>正在分析技术创新点</span>
                <span className="w-1.5 h-1.5 bg-blue-400 rounded-full"></span>
                <span>拟定权利要求逻辑</span>
                <span className="w-1.5 h-1.5 bg-blue-400 rounded-full"></span>
                <span>绘制专利示意图</span>
              </div>
              <p className="text-slate-400 text-xs mt-6">这是一项复杂的创造性劳动，通常需要 20-40 秒</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
