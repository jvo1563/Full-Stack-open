import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom/extend-expect";
import userEvent from "@testing-library/user-event";
import BlogForm from "./BlogForm";

test("<BlogForm /> calls event handler with right details when new blog is created", async () => {
  const addBlog = jest.fn();
  const user = userEvent.setup();

  render(<BlogForm addBlog={addBlog} />);
  const titleInput = screen.getByPlaceholderText("Title:");
  const authorInput = screen.getByPlaceholderText("Author:");
  const urlInput = screen.getByPlaceholderText("url:");

  const sendButton = screen.getByText("Create");

  await user.type(titleInput, "How to code 101");
  await user.type(authorInput, "Bob Smith");
  await user.type(urlInput, "www.youtube.com");
  await user.click(sendButton);

  expect(addBlog.mock.calls).toHaveLength(1);
  expect(addBlog.mock.calls[0][0]).toEqual({
    title: "How to code 101",
    author: "Bob Smith",
    url: "www.youtube.com",
  });
});
