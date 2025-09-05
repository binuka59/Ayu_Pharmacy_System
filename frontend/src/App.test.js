<<<<<<< HEAD
=======
import { MemoryRouter } from 'react-router-dom';
>>>>>>> 792cc480 (second commit)
import { render, screen } from '@testing-library/react';
import App from './App';

test('renders learn react link', () => {
<<<<<<< HEAD
  render(<App />);
  const linkElement = screen.getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});
=======
  render(
    <MemoryRouter>
      <App />
    </MemoryRouter>
  );
  const linkElement = screen.getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});
const request = require("supertest");
const app = require("../server"); // your Express app

describe("Ayu Pharmacy API Tests", () => {
  it("should login with valid credentials", async () => {
    const res = await request(app)
      .post("/login")
      .send({ username: "admin", password: "12345" });
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("token");
  });

  it("should fail login with wrong password", async () => {
    const res = await request(app)
      .post("/login")
      .send({ username: "admin", password: "wrong" });
    expect(res.statusCode).toBe(401);
  });
});
>>>>>>> 792cc480 (second commit)
