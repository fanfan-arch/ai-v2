
import React, { useState } from 'react';
import { PatentDocument, PatentSectionType } from '../types';

interface PatentViewProps {
  document: PatentDocument;
}

const PatentView: React.FC<PatentViewProps> = ({ document }) => {
  const [activeTab, setActiveTab] = useState<PatentSectionType>(PatentSectionType.CLAIMS);

  const renderContent = () => {
    switch (activeTab) {
      case PatentSectionType.CLAIMS:
        return (
          <div className="prose-patent text-slate-800">
            <h2 className="text-2xl font-bold mb-6 text-center">权利要求书</h2>
            <div className="space-y-6">
              {document.claims.map((claim, idx) => (
                <div key={idx} className="flex gap-4">
                  <span className="font-bold flex-shrink-0 text-blue-600">{idx + 1}.</span>
                  <p className="flex-1">{claim}</p>
                </div>
              ))}
            </div>
          </div>
        );
      case PatentSectionType.SPECIFICATION:
        return (
          <div className="prose-patent text-slate-800 space-y-12">
            <h2 className="text-2xl font-bold text-center">说明书</h2>
            
            <section>
              <h3 className="text-lg font-bold mb-4 border-l-4 border-blue-600 pl-3">一、技术领域</h3>
              <p className="leading-relaxed">{document.specification.field}</p>
            </section>

            <section>
              <h3 className="text-lg font-bold mb-4 border-l-4 border-blue-600 pl-3">二、背景技术</h3>
              <p className="leading-relaxed">{document.specification.background}</p>
            </section>

            <section>
              <h3 className="text-lg font-bold mb-4 border-l-4 border-blue-600 pl-3">三、发明内容</h3>
              <p className="leading-relaxed whitespace-pre-line">{document.specification.summary}</p>
            </section>

            <section>
              <h3 className="text-lg font-bold mb-4 border-l-4 border-blue-600 pl-3">四、附图说明</h3>
              <p className="whitespace-pre-line leading-relaxed">{document.specification.description}</p>
            </section>

            <section>
              <h3 className="text-lg font-bold mb-4 border-l-4 border-blue-600 pl-3">五、具体实施方式</h3>
              <p className="whitespace-pre-line leading-relaxed">{document.specification.examples}</p>
            </section>
          </div>
        );
      case PatentSectionType.ABSTRACT:
        return (
          <div className="prose-patent text-slate-800">
            <h2 className="text-2xl font-bold mb-8 text-center">说明书摘要</h2>
            <div className="p-8 bg-slate-50 rounded-2xl border border-slate-100 shadow-inner">
              <p className="leading-loose italic text-slate-700">{document.abstract}</p>
            </div>
          </div>
        );
      case PatentSectionType.DIAGRAMS:
        return (
          <div className="space-y-12">
            <h2 className="text-2xl font-bold mb-8 text-center">说明书附图</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              {document.diagrams.map((diag, idx) => (
                <div key={idx} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow group">
                  {diag.url ? (
                    <div className="aspect-[4/3] w-full flex items-center justify-center bg-white border border-slate-100 rounded-lg overflow-hidden mb-6 relative">
                      <img src={diag.url} alt={`图 ${idx + 1}`} className="max-w-full max-h-full object-contain p-2" />
                      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                         <span className="bg-blue-600 text-white text-[10px] px-2 py-1 rounded">专利高清线稿</span>
                      </div>
                    </div>
                  ) : (
                    <div className="aspect-[4/3] w-full flex flex-col items-center justify-center bg-slate-50 border border-dashed border-slate-300 rounded-lg mb-6 text-slate-400">
                      <svg className="w-12 h-12 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                      <span className="text-xs font-bold">图像生成失败</span>
                    </div>
                  )}
                  <div className="text-center">
                    <p className="font-black text-slate-900 text-xl mb-1">图 {idx + 1}</p>
                    <p className="text-sm text-blue-600 font-bold uppercase tracking-widest">{diag.description}</p>
                  </div>
                  <div className="mt-6 pt-4 border-t border-slate-50 text-[11px] text-slate-400 italic">
                    注：图中包含简体中文标注及引出线，请参照说明书“附图说明”部分阅读。
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-12 p-6 bg-blue-50 rounded-2xl border border-blue-100 text-blue-800 text-sm flex items-start gap-4">
              <svg className="w-6 h-6 text-blue-500 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              <div>
                <p className="font-bold mb-1">关于附图汉字显示：</p>
                <p>我们已优化提示词强制要求 AI 使用标准黑体渲染简体中文。如仍有微小偏差，请结合下方的中文标题与说明书正文中的“附图说明”进行理解。专利局正式申报时建议根据此草图进行矢量化精修。</p>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 no-print">
        <div className="flex-1">
          <h1 className="text-3xl font-black text-slate-900 leading-tight">{document.title}</h1>
          <p className="text-slate-400 text-sm mt-1 flex items-center gap-2">
             <span className="w-2 h-2 rounded-full bg-green-500"></span>
             AI 已完成全文撰写及附图绘制
          </p>
        </div>
        <button 
          onClick={() => window.print()}
          className="flex items-center justify-center gap-2 px-6 py-3 bg-slate-900 hover:bg-black text-white rounded-xl shadow-xl transition-all font-bold hover:-translate-y-0.5"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" /></svg>
          导出申报文件
        </button>
      </div>

      <div className="flex bg-slate-200/50 p-1.5 rounded-2xl mb-10 no-print backdrop-blur-md sticky top-4 z-10 border border-white/50 shadow-sm">
        {Object.values(PatentSectionType).map((type) => (
          <button
            key={type}
            onClick={() => setActiveTab(type)}
            className={`flex-1 py-3 px-6 rounded-xl text-sm font-bold transition-all ${
              activeTab === type 
                ? 'bg-white text-blue-600 shadow-md ring-1 ring-slate-100' 
                : 'text-slate-500 hover:text-slate-900'
            }`}
          >
            {type === PatentSectionType.CLAIMS && '权利要求'}
            {type === PatentSectionType.SPECIFICATION && '说明书'}
            {type === PatentSectionType.ABSTRACT && '摘要'}
            {type === PatentSectionType.DIAGRAMS && '附图'}
          </button>
        ))}
      </div>

      <div className="bg-white p-10 md:p-20 rounded-[3rem] shadow-2xl shadow-slate-200/50 border border-slate-100 min-h-[800px] mb-12">
        {renderContent()}
      </div>
    </div>
  );
};

export default PatentView;
