import { useState } from "react";

const BlogForm = ({ addBlog }) => {
  const [newBlog, setNewBlog] = useState({ author: "", title: "", url: "" });

  const handleNewBlogChange = (event) => {
    const { name, value } = event.target;
    setNewBlog({ ...newBlog, [name]: value });
  };

  const handleAddBlog = (event) => {
    event.preventDefault();
    addBlog(newBlog);
    setNewBlog({ author: "", title: "", url: "" });
  };

  return (
    <div>
      <h2>Create a new blog</h2>
      <form onSubmit={handleAddBlog}>
        <div>
          title:{" "}
          <input
            name="title"
            value={newBlog.title}
            onChange={handleNewBlogChange}
          />
        </div>
        <div>
          author:{" "}
          <input
            name="author"
            value={newBlog.author}
            onChange={handleNewBlogChange}
          />
        </div>
        <div>
          url:{" "}
          <input
            name="url"
            value={newBlog.url}
            onChange={handleNewBlogChange}
          />
        </div>
        <div>
          <button type="submit">Create</button>
        </div>
      </form>
    </div>
  );
};

export default BlogForm;
