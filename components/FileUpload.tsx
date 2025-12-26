
import React, { useRef, useState } from 'react';
import { FileData } from '../types';

interface FileUploadProps {
  onFilesSelected: (files: FileData[]) => void;
  isLoading: boolean;
}

const FileUpload: React.FC<FileUploadProps> = ({ onFilesSelected, isLoading }) => {
  const [files, setFiles] = useState<File[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setFiles(prev => [...prev, ...newFiles]);
    }
  };

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleProcess = async () => {
    if (files.length === 0) return;

    const fileDatas: FileData[] = await Promise.all(
      files.map(async (file) => {
        return new Promise<FileData>((resolve) => {
          const reader = new FileReader();
          reader.onload = (e) => {
            resolve({
              name: file.name,
              content: e.target?.result as string,
              type: file.type
            });
          };
          reader.readAsText(file);
        });
      })
    );

    onFilesSelected(fileDatas);
  };

  return (
    <div className="max-w-3xl mx-auto p-8 bg-white rounded-2xl shadow-xl border border-slate-100">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-slate-800 mb-3">撰写新专利</h2>
        <p className="text-slate-500">上传您的技术文档（Markdown、TXT），AI 将为您生成全套申请文件</p>
      </div>

      <div 
        onClick={() => inputRef.current?.click()}
        className="border-2 border-dashed border-slate-200 rounded-xl p-12 text-center hover:border-blue-400 hover:bg-blue-50/50 cursor-pointer transition-all group"
      >
        <input 
          type="file" 
          ref={inputRef} 
          onChange={handleFileChange} 
          className="hidden" 
          multiple 
          accept=".md,.txt,.json" 
        />
        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
          <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" /></svg>
        </div>
        <p className="text-slate-700 font-medium">点击或拖拽文件到此处</p>
        <p className="text-slate-400 text-sm mt-1">支持 .md, .txt 文件格式</p>
      </div>

      {files.length > 0 && (
        <div className="mt-8">
          <h4 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-3">待处理文件 ({files.length})</h4>
          <div className="space-y-2">
            {files.map((f, i) => (
              <div key={i} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-100">
                <div className="flex items-center gap-3">
                  <svg className="w-5 h-5 text-slate-400" fill="currentColor" viewBox="0 0 20 20"><path d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" /></svg>
                  <span className="text-sm text-slate-700 font-medium">{f.name}</span>
                </div>
                <button onClick={() => removeFile(i)} className="text-slate-400 hover:text-red-500 p-1">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              </div>
            ))}
          </div>

          <button
            onClick={handleProcess}
            disabled={isLoading}
            className={`mt-8 w-full py-4 rounded-xl text-white font-bold text-lg shadow-lg transition-all ${
              isLoading 
                ? 'bg-slate-400 cursor-not-allowed' 
                : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 hover:-translate-y-1'
            }`}
          >
            {isLoading ? (
              <div className="flex items-center justify-center gap-3">
                <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                正在撰写专利中，请稍候...
              </div>
            ) : '开始智能撰写'}
          </button>
        </div>
      )}
    </div>
  );
};

export default FileUpload;
