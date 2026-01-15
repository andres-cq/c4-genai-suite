import { PromptCategory, PromptTemplate } from 'src/types/prompt-template';

export const MOCK_PROMPTS: PromptTemplate[] = [
  {
    id: 1,
    title: 'Blog Post Writer',
    description: 'Create a comprehensive blog post on any topic',
    category: PromptCategory.WRITING,
    promptText:
      'Write a detailed blog post about {{topic}}. Include an introduction, main points, and a conclusion. Make it engaging and informative.',
    variables: [
      {
        name: 'topic',
        label: 'Topic',
        description: 'The topic you want to write about',
        required: true,
      },
    ],
    isFavorite: false,
    userId: 'user1',
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15'),
  },
  {
    id: 2,
    title: 'Code Review',
    description: 'Get a thorough code review with suggestions',
    category: PromptCategory.CODING,
    promptText:
      'Review the following {{language}} code and provide:\n1. Potential bugs or issues\n2. Performance improvements\n3. Best practices suggestions\n4. Security concerns\n\n```{{language}}\n{{code}}\n```',
    variables: [
      {
        name: 'language',
        label: 'Programming Language',
        description: 'The programming language of the code',
        required: true,
      },
      {
        name: 'code',
        label: 'Code',
        description: 'The code to review',
        required: true,
      },
    ],
    isFavorite: true,
    userId: 'user1',
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date('2024-01-10'),
  },
];
