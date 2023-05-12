const lodash = require("lodash");
const dummy = (blogs) => {
  if (blogs.length === 0) return 1;
  return 1;
};

const totalLikes = (blogs) => {
  return blogs.reduce((sum, blog) => sum + blog.likes, 0);
};

const favoriteBlog = (blogs) => {
  if (blogs.length === 0) return null;
  return blogs.reduce((max, blog) => (max.likes > blog.likes ? max : blog));
};

const mostBlogs = (blogs) => {
  if (blogs.length === 0) return null;
  const authorCount = lodash.countBy(blogs, "author");
  const topAuthor = Object.keys(authorCount).reduce((top, author) =>
    authorCount[top] > authorCount[author] ? top : author
  );
  return {
    author: topAuthor,
    blogs: authorCount[topAuthor],
  };
};

const mostLikes = (blogs) => {
  if (blogs.length === 0) return null;
  const authorSort = lodash.groupBy(blogs, "author");
  const authorLikes = lodash.map(authorSort, (value, key) => ({
    author: key,
    likes: lodash.sumBy(value, "likes"),
  }));
  return authorLikes.reduce((most, author) =>
    most.likes > author.likes ? most : author
  );
};

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes,
};
