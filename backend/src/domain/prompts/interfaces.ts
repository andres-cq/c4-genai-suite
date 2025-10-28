export interface PromptCategoryModel {
  id: number;
  name: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface PromptModel {
  id: number;
  title: string;
  content: string;
  description?: string;
  isGlobal: boolean;
  categoryId?: number;
  category?: PromptCategoryModel;
  createdById: string;
  usageCount: number;
  createdAt: Date;
  updatedAt: Date;
}
