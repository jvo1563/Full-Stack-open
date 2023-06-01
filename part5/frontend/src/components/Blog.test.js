import React from "react";
import "@testing-library/jest-dom/extend-expect";
import { render, screen } from "@testing-library/react";
import Blog from "./Blog";

test("renders blog's title and author", () => {
  const blog = {
    title: "how to code",
    author: "Bob",
    url: "www.youtube.com",
  };

  render(<Blog blog={blog} />);

  const title = screen.getByText("how to code", { exact: false });
  const author = screen.getByText("bob", { exact: false });
  const url = screen.queryByText("www.youtube.com");

  expect(title).toBeDefined();
  expect(author).toBeDefined();
  expect(url).toBeNull();
});
