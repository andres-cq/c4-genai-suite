import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';
import { schema } from '../typeorm.helper';
import { PromptCategoryEntity } from './prompt-category';
import { UserEntity } from './user';

@Entity({ name: 'prompts', schema })
export class PromptEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ length: 255 })
  title!: string;

  @Column({ type: 'text' })
  content!: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column({ default: false })
  isGlobal!: boolean;

  @Column({ nullable: true })
  categoryId?: number;

  @ManyToOne(() => PromptCategoryEntity, (category) => category.prompts, { onDelete: 'SET NULL' })
  category?: PromptCategoryEntity;

  @Column()
  createdById!: string;

  @ManyToOne(() => UserEntity, { onDelete: 'CASCADE' })
  createdBy!: UserEntity;

  @Column({ default: 0 })
  usageCount!: number;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt!: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt!: Date;
}
