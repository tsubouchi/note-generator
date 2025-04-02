export interface BlogContext {
  id: string;
  content: string;
}

export interface BlogIdea {
  title: string;
  description: string;
  targetAudience: string;
  keyPoints: string;
  contexts: BlogContext[];
}

export interface GeneratedArticle {
  title: string;
  content: string;
  tags: string[];
}
