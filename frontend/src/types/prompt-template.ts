export enum PromptCategory {
  WRITING = 'writing',
  CODING = 'coding',
  ANALYSIS = 'analysis',
  DATA = 'data',
  GENERAL = 'general',
}

export interface PromptVariable {
  name: string;
  label: string;
  description?: string;
  defaultValue?: string;
  required: boolean;
}

export interface PromptTemplate {
  id: number;
  title: string;
  description?: string;
  category?: PromptCategory;
  promptText: string;
  variables?: PromptVariable[];
  isFavorite: boolean;
  usageCount: number;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

export const PROMPT_CATEGORIES = [
  { value: PromptCategory.WRITING, label: 'Writing' },
  { value: PromptCategory.CODING, label: 'Coding' },
  { value: PromptCategory.ANALYSIS, label: 'Analysis' },
  { value: PromptCategory.DATA, label: 'Data' },
  { value: PromptCategory.GENERAL, label: 'General' },
];
