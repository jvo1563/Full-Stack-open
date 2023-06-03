import { useState } from "react";
import PropTypes from "prop-types";

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
            id="title-input"
            name="title"
            value={newBlog.title}
            onChange={handleNewBlogChange}
            placeholder="Title:"
          />
        </div>
        <div>
          author:{" "}
          <input
            id="author-input"
            name="author"
            value={newBlog.author}
            onChange={handleNewBlogChange}
            placeholder="Author:"
          />
        </div>
        <div>
          url:{" "}
          <input
            id="url-input"
            name="url"
            value={newBlog.url}
            onChange={handleNewBlogChange}
            placeholder="url:"
          />
        </div>
        <div>
          <button id="add-blog-button" type="submit">
            Create
          </button>
        </div>
      </form>
    </div>
  );
};

BlogForm.propTypes = {
  addBlog: PropTypes.func.isRequired,
};

export default BlogForm;
