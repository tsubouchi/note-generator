'use client';

import { useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { v4 as uuidv4 } from 'uuid';
import { BlogIdea, BlogContext } from '@/types';

const blogIdeaSchema = z.object({
  title: z.string().min(1, { message: 'タイトルは必須です' }),
  description: z.string().min(1, { message: '説明は必須です' }),
  targetAudience: z.string().min(1, { message: 'ターゲットオーディエンスは必須です' }),
  keyPoints: z.string().min(1, { message: '重要なポイントは必須です' }),
  contexts: z.array(
    z.object({
      id: z.string(),
      content: z.string().min(1, { message: 'コンテキストは必須です' })
    })
  )
});

type BlogIdeaFormData = z.infer<typeof blogIdeaSchema>;

export default function BlogIdeaForm({ onSubmit }: { onSubmit: (data: BlogIdea) => void }) {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting }
  } = useForm<BlogIdeaFormData>({
    resolver: zodResolver(blogIdeaSchema),
    defaultValues: {
      title: '',
      description: '',
      targetAudience: '',
      keyPoints: '',
      contexts: [{ id: uuidv4(), content: '' }]
    }
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'contexts'
  });

  const addContext = () => {
    append({ id: uuidv4(), content: '' });
  };

  const handleFormSubmit = (data: BlogIdeaFormData) => {
    onSubmit(data);
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-6 bg-card text-card-foreground rounded-lg shadow-lg">
      <h1 className="text-2xl font-bold mb-6">ブログ企画作成</h1>
      
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
        <div>
          <label htmlFor="title" className="block text-sm font-medium mb-1">
            タイトル
          </label>
          <input
            id="title"
            type="text"
            {...register('title')}
            className="w-full px-3 py-2 bg-background border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
            placeholder="ブログのタイトル"
          />
          {errors.title && (
            <p className="mt-1 text-sm text-destructive">{errors.title.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium mb-1">
            説明
          </label>
          <textarea
            id="description"
            {...register('description')}
            rows={3}
            className="w-full px-3 py-2 bg-background border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
            placeholder="ブログの概要説明"
          />
          {errors.description && (
            <p className="mt-1 text-sm text-destructive">{errors.description.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="targetAudience" className="block text-sm font-medium mb-1">
            ターゲットオーディエンス
          </label>
          <input
            id="targetAudience"
            type="text"
            {...register('targetAudience')}
            className="w-full px-3 py-2 bg-background border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
            placeholder="対象読者層"
          />
          {errors.targetAudience && (
            <p className="mt-1 text-sm text-destructive">{errors.targetAudience.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="keyPoints" className="block text-sm font-medium mb-1">
            重要なポイント
          </label>
          <textarea
            id="keyPoints"
            {...register('keyPoints')}
            rows={3}
            className="w-full px-3 py-2 bg-background border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
            placeholder="記事で伝えたい重要なポイント"
          />
          {errors.keyPoints && (
            <p className="mt-1 text-sm text-destructive">{errors.keyPoints.message}</p>
          )}
        </div>

        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="block text-sm font-medium">
              追加コンテキスト
            </label>
            <button
              type="button"
              onClick={addContext}
              className="px-3 py-1 text-sm bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/80 focus:outline-none focus:ring-2 focus:ring-ring"
            >
              コンテキスト追加
            </button>
          </div>
          
          <div className="space-y-3">
            {fields.map((field, index) => (
              <div key={field.id} className="flex items-start gap-2">
                <textarea
                  {...register(`contexts.${index}.content`)}
                  rows={2}
                  className="flex-1 px-3 py-2 bg-background border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
                  placeholder="追加情報やコンテキスト"
                />
                {index > 0 && (
                  <button
                    type="button"
                    onClick={() => remove(index)}
                    className="px-2 py-1 text-sm bg-destructive text-destructive-foreground rounded-md hover:bg-destructive/90 focus:outline-none focus:ring-2 focus:ring-ring"
                  >
                    削除
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="pt-4">
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full px-4 py-2 bg-primary text-primary-foreground font-medium rounded-md hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-ring disabled:opacity-50"
          >
            {isSubmitting ? '処理中...' : '記事を生成'}
          </button>
        </div>
      </form>
    </div>
  );
}
