/*
  Warnings:

  - You are about to drop the `_ArticleToArticleCategory` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `article_categories` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `articles` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_ArticleToArticleCategory" DROP CONSTRAINT "_ArticleToArticleCategory_A_fkey";

-- DropForeignKey
ALTER TABLE "_ArticleToArticleCategory" DROP CONSTRAINT "_ArticleToArticleCategory_B_fkey";

-- DropForeignKey
ALTER TABLE "articles" DROP CONSTRAINT "articles_created_by_id_fkey";

-- DropTable
DROP TABLE "_ArticleToArticleCategory";

-- DropTable
DROP TABLE "article_categories";

-- DropTable
DROP TABLE "articles";
