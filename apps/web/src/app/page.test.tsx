import { render, screen } from "@testing-library/react";
import Home from "./page";

describe("Home page", () => {
  it("renders the page title", () => {
    render(<Home />);
    const title = screen.getByRole("heading", { name: /Trends Platform/i });
    expect(title).toBeInTheDocument();
  });

  it("renders the description", () => {
    render(<Home />);
    const description = screen.getByText(/Ultra-minimalista platform/i);
    expect(description).toBeInTheDocument();
  });
});
