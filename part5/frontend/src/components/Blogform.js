const Blogform = ({ addBlog, newBlog, handleNewBlogChange }) => (
  <div>
    <h2>Create a new blog</h2>
    <form onSubmit={addBlog}>
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
        <input name="url" value={newBlog.url} onChange={handleNewBlogChange} />
      </div>
      <div>
        <button type="submit">Create</button>
      </div>
    </form>
  </div>
);

export default Blogform;
