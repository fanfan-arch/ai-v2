
import { GoogleGenAI, Type, GenerateContentResponse } from "@google/genai";
import { PatentDocument, FileData } from "../types";

export class PatentService {
  private ai: GoogleGenAI;

  constructor() {
    this.ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  }

  async analyzeAndGenerate(files: FileData[]): Promise<PatentDocument> {
    const combinedContent = files.map(f => `文件 [${f.name}]:\n${f.content}`).join('\n\n---\n\n');
    
    // Step 1: Generate Text Content using Gemini 3 Pro
    const textResponse = await this.ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: `你是一个顶级的中国专利代理师。请根据以下技术资料，撰写一套完整的、逻辑极其严密的符合中国国家知识产权局(CNIPA)规范的专利申请文件。
      
      资料如下：
      ${combinedContent}

      请输出 JSON 格式，包含以下字段：
      - title: 专利名称
      - abstract: 说明书摘要（300字以内）
      - claims: 权利要求书（数组）
      - specification: 说明书（field, background, summary, description, examples）
      - diagramPrompts: 必须生成4个关键附图的生成提示词（数组）。
          - 每个提示词对象包含: 
            - prompt: 极其详尽的英文提示词，描述组件结构、流程或逻辑。
            - labels: 图像中需要标注的中文关键词列表（如：["处理器", "传感器", "云端服务器"]）。
            - desc: 该图的中文简短标题。

      要求：
      1. 图像提示词必须明确要求“专利线稿图风格”。
      2. 为解决乱码问题，提示词需包含对中文字体清晰度的具体要求。`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            abstract: { type: Type.STRING },
            claims: { type: Type.ARRAY, items: { type: Type.STRING } },
            specification: {
              type: Type.OBJECT,
              properties: {
                field: { type: Type.STRING },
                background: { type: Type.STRING },
                summary: { type: Type.STRING },
                description: { type: Type.STRING },
                examples: { type: Type.STRING }
              },
              required: ["field", "background", "summary", "description", "examples"]
            },
            diagramPrompts: { 
              type: Type.ARRAY, 
              items: { 
                type: Type.OBJECT,
                properties: {
                  prompt: { type: Type.STRING },
                  labels: { type: Type.ARRAY, items: { type: Type.STRING } },
                  desc: { type: Type.STRING }
                },
                required: ["prompt", "labels", "desc"]
              } 
            }
          },
          required: ["title", "abstract", "claims", "specification", "diagramPrompts"]
        }
      }
    });

    const data = JSON.parse(textResponse.text);
    
    // Step 2: Generate Images with significantly improved prompts to fix garbled Chinese text
    const diagrams = await Promise.all(
      data.diagramPrompts.map(async (dp: { prompt: string, labels: string[], desc: string }) => {
        try {
          const labelsStr = dp.labels.join(', ');
          const imgResponse = await this.ai.models.generateContent({
            model: 'gemini-2.5-flash-image',
            contents: {
              parts: [{ 
                text: `Professional High-Resolution Patent Application Line Art.
                
                CONTENT: ${dp.prompt}.
                STYLE: Pure white background, high-contrast black ink lines only. No shading, no 3D effects.
                
                TEXT REQUIREMENTS (TO PREVENT GARBLED CHARACTERS):
                - Use clear, standard, large Simplified Chinese characters (简体中文) for labels.
                - Font style: Bold Sans-serif (SimHei/黑体 style).
                - Labels to include: ${labelsStr}.
                - Ensure each Chinese character is distinct, well-formed, and separated from lines.
                - Place labels next to components with straight leader lines.
                - DO NOT use English text in the labels.
                
                COMPLETENESS: Draw the entire technical system, including all sub-components and their connections.` 
              }]
            },
            config: {
              imageConfig: { aspectRatio: "4:3" }
            }
          });

          let imageUrl = '';
          for (const part of imgResponse.candidates?.[0]?.content.parts || []) {
            if (part.inlineData) {
              imageUrl = `data:image/png;base64,${part.inlineData.data}`;
              break;
            }
          }
          return { prompt: dp.prompt, url: imageUrl, description: dp.desc };
        } catch (e) {
          console.error("Failed to generate image", e);
          return { prompt: dp.prompt, url: '', description: dp.desc };
        }
      })
    );

    return {
      id: Math.random().toString(36).substr(2, 9),
      title: data.title,
      abstract: data.abstract,
      claims: data.claims,
      specification: data.specification,
      diagrams: diagrams,
      createdAt: Date.now()
    };
  }
}
