import { useState } from "react";
import PropTypes from "prop-types";

const Blog = ({ blog, updateBlog, deleteBlog, user }) => {
  const [showDetails, setShowDetails] = useState(false);

  const handleLike = () => {
    const newBlog = { ...blog, likes: blog.likes + 1 };
    console.log(newBlog);
    updateBlog(newBlog);
  };

  const handleDelete = () => {
    if (window.confirm(`Remove blog ${blog.title} by ${blog.author}`)) {
      deleteBlog(blog.id);
    }
  };

  const deleteButton = () => {
    if (user.username === blog.user.username) {
      return (
        <div>
          <button onClick={handleDelete}>Remove</button>
        </div>
      );
    }
  };

  const blogDetails = () => (
    <div>
      <div>{blog.url}</div>
      <div>
        Likes: {blog.likes} <button onClick={handleLike}>Like</button>
      </div>
      <div>Posted by: {blog.user.name}</div>
      {deleteButton()}
    </div>
  );

  return (
    <div style={blogStyle} className="blog">
      <div>
        {blog.title} {blog.author}{" "}
        <button onClick={() => setShowDetails(!showDetails)}>
          {showDetails ? "Hide" : "View"}
        </button>
      </div>
      {showDetails && blogDetails()}
    </div>
  );
};

Blog.propTypes = {
  blog: PropTypes.object.isRequired,
  updateBlog: PropTypes.func.isRequired,
  deleteBlog: PropTypes.func.isRequired,
  user: PropTypes.object.isRequired,
};

export default Blog;

const blogStyle = {
  paddingTop: 10,
  paddingLeft: 2,
  border: "solid",
  borderWidth: 1,
  marginBottom: 5,
};
