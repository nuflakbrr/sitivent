export interface Article {
  id: string;
  title: string;
  slug: string;
  content: string;
  cover: string | null;
  createdAt: Date;
  updatedAt: Date;
  createdById: string | null;
  articleCategories: ArticleCategory[];
}

export interface ArticleCategory {
  id: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ArticleResponse {
  success: boolean;
  data?: Article;
  message?: string;
  error?: string;
}

export interface ArticlePaginationResponse {
  success: boolean;
  data: Article[];
  meta: {
    total: number;
    page: number;
    lastPage: number;
  };
  error?: string;
}

export interface ArticleCategoryResponse {
  success: boolean;
  data?: ArticleCategory;
  message?: string;
  error?: string;
}

export interface ArticleCategoryPaginationResponse {
  success: boolean;
  data: ArticleCategory[];
  meta: {
    total: number;
    page: number;
    lastPage: number;
  };
  error?: string;
}

export interface ArticleItem {
  id: string;
  category: string;
  title: string;
  description: string;
  readTime: string;
  date: string;
  author: string;
  cover?: string | null;
}

export interface ArticleDetailStep {
  title: string;
  location: string;
  body: string;
}

export interface ArticleDetailTab {
  label: string;
  code: string;
}

export interface ArticleDetailFaq {
  q: string;
  a: string;
}

export interface ArticleDetailFlowchartItem {
  label: string;
  type: 'step' | 'decision';
  detail: string;
}

export interface ArticleDetail {
  id: string;
  category: string;
  title: string;
  description?: string;
  readTime?: string;
  date: string;
  author: string;
  tldr?: string;
  content?: string;
  cover?: string | null;
  steps?: ArticleDetailStep[];
  tabs?: ArticleDetailTab[];
  faqs?: ArticleDetailFaq[];
  jargon?: Record<string, string>;
  flowchart?: ArticleDetailFlowchartItem[];
  isDb?: boolean;
}
