const Blog = require("../models/blog");
const User = require("../models/user");

const initialBlogs = [
  {
    title: "title1",
    author: "author1",
    url: "url1",
    likes: 5,
  },
  {
    title: "title2",
    author: "author2",
    url: "url2",
    likes: 7,
  },
];

const nonExistingId = async () => {
  const blog = new Blog({
    title: "removesoon",
    author: "removesoon",
    url: "removesoon",
    likes: 0,
  });
  await blog.save();
  await blog.deleteOne();
  return blog._id.toString();
};

const blogsInDb = async () => {
  const blogs = await Blog.find({});
  return blogs.map((blog) => blog.toJSON());
};

const initialUsers = [
  {
    username: "fakeuser1",
    name: "fake1",
    passwordHash: "fakehash1",
  },
  {
    username: "fakeuser2",
    name: "fake2",
    passwordHash: "fakehash2",
  },
];

const usersInDb = async () => {
  const users = await User.find({});
  return users.map((users) => users.toJSON());
};
module.exports = {
  initialBlogs,
  nonExistingId,
  blogsInDb,
  initialUsers,
  usersInDb,
};
