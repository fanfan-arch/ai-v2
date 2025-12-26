
export enum PatentSectionType {
  CLAIMS = 'claims',
  SPECIFICATION = 'specification',
  ABSTRACT = 'abstract',
  DIAGRAMS = 'diagrams'
}

export interface PatentDocument {
  id: string;
  title: string;
  abstract: string;
  claims: string[];
  specification: {
    field: string;
    background: string;
    summary: string;
    description: string;
    examples: string;
  };
  diagrams: {
    prompt: string;
    url: string;
    description: string;
  }[];
  createdAt: number;
}

export interface FileData {
  name: string;
  content: string;
  type: string;
}
