export interface Prompt {
  readonly id: number;
  readonly title: string;
  readonly description?: string;
  readonly promptText: string;
  readonly isFavorite: boolean;
  readonly userId: string;
  readonly createdAt: Date;
  readonly updatedAt: Date;
}
