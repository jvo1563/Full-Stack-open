const lodash = require("lodash");
const dummy = (blogs) => {
  console.log(blogs);
  return 1;
};

const totalLikes = (blogs) => {
  return blogs.reduce((sum, blog) => sum + blog.likes, 0);
};

const favoriteBlog = (blogs) => {
  return blogs.reduce((max, blog) => (max.likes > blog.likes ? max : blog), 0);
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

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
};
