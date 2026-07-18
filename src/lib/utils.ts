import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import type { Editor } from '@tiptap/react';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const NODE_HANDLES_SELECTED_STYLE_CLASSNAME = 'node-handles-selected-style';

export function isValidUrl(url: string) {
  return /^https?:\/\/\S+$/.test(url);
}

export function duplicateContent(editor: Editor) {
  const { state } = editor;
  const { selection } = state;

  editor
    .chain()
    .insertContentAt(selection.to, selection.content().content)
    .focus(selection.to)
    .run();
}

export function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-') // Replace spaces with -
    .replace(/[^\w\-]+/g, '') // Remove all non-word chars
    .replace(/\-\-+/g, '-'); // Replace multiple - with single -
}
