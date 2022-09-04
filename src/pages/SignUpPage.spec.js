import SignUpPage from "./SignUpPage";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import axios from "axios";
import { setupServer } from "msw/node";
import { rest } from "msw";

describe("Sign Up Page", () => {
  describe("Layout", () => {
    it("has header", () => {
      render(<SignUpPage />);
      const header = screen.queryByRole("heading", { name: "Sign Up" });
      expect(header).toBeInTheDocument();
    });

    it("has username input", () => {
      render(<SignUpPage />);
      const input = screen.getByLabelText("username");
      expect(input).toBeInTheDocument();
    });
    it("has email input", () => {
      render(<SignUpPage />);
      const input = screen.getByLabelText("e-mail");
      expect(input).toBeInTheDocument();
    });
    it("has password input", () => {
      render(<SignUpPage />);
      const input = screen.getByLabelText("password");
      expect(input).toBeInTheDocument();
    });
    it("has password type for password input", () => {
      render(<SignUpPage />);
      const input = screen.getByLabelText("password");
      expect(input.type).toBe("password");
    });
    it("has password repeat input", () => {
      render(<SignUpPage />);
      const input = screen.getByLabelText("password repeat");
      expect(input).toBeInTheDocument();
    });
    it("has password type for password repeat input", () => {
      render(<SignUpPage />);
      const input = screen.getByLabelText("password repeat");
      expect(input.type).toBe("password");
    });
    it("has signup button", () => {
      render(<SignUpPage />);
      const button = screen.queryByRole("button", { name: "Sign Up" });
      expect(button).toBeInTheDocument();
    });
    it("disables the button initially", () => {
      render(<SignUpPage />);
      const button = screen.queryByRole("button", { name: "Sign Up" });
      expect(button).toBeDisabled();
    });
  });
  describe("Interactions", () => {
    let button;
    
    const setup = () => {
      render(<SignUpPage />);
      const usernameInput = screen.getByLabelText("username");
      const emailInput = screen.getByLabelText("e-mail");
      const passwordInput = screen.getByLabelText("password");
      const passwordRepeatInput = screen.getByLabelText("password repeat");
      userEvent.type(usernameInput, "user1");
      userEvent.type(emailInput, "robert@test.com");
      userEvent.type(passwordInput, "passw0rd");
      userEvent.type(passwordRepeatInput, "passw0rd");
      button = screen.queryByRole("button", { name: "Sign Up" });      
    };
    
    it("enables the button when the password and password repeat fields have same value", () => {
      setup();
      expect(button).toBeEnabled();
    });
    it("sends the username, email and password to backend after clicking the button", async () => {
      let requestBody;
      const server = setupServer(
        rest.post("/api/1.0/users", (req, res, ctx) => {
          requestBody = req.body;
          return res(ctx.status(200));
        })
      );
      server.listen();
      setup();
      userEvent.click(button);

      await new Promise(resolve => setTimeout(resolve, 500));

      expect(requestBody).toEqual({
        username: "user1",
        email: "robert@test.com",
        password: "passw0rd"
      });
    });
    it("disables button when there is an ongoing API call", async () => {
      let counter = 0;
      const server = setupServer(
        rest.post("/api/1.0/users", (req, res, ctx) => {
          counter += 1;
          return res(ctx.status(200));
        })
      );
      server.listen();
      setup();
      userEvent.click(button);
      userEvent.click(button);
      
      await new Promise(resolve => setTimeout(resolve, 500));
      
      expect(counter).toBe(1);
    });
    it("displays sippner while API request is in progress", async () => {
      const server = setupServer(
        rest.post("/api/1.0/users", (req, res, ctx) => {
          return res(ctx.status(200));
        })
      );
      server.listen();
      setup();

      expect(screen.queryByRole('status', { hidden: true })).not.toBeInTheDocument();
      userEvent.click(button);
      const spinner = screen.getByRole('status', { hidden: true });
      expect(spinner).toBeInTheDocument();
    });
  });
});
