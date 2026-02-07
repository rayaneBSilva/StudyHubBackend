import request from "supertest";
import { expect } from "chai";
import app from "../../src/app";

describe("Auth", () => {
  before(async () => {
    await request(app).post("/api/users").send({
      name: "Professor",
      email: "prof@email.com",
      password: "123456",
      role: "teacher",
    });
  });

  it("deve logar com credenciais válidas", async () => {
    const res = await request(app).post("/api/users/login").send({
      email: "prof@email.com",
      password: "123456",
    });

    expect(res.status).to.equal(200);
    expect(res.body.data).to.have.property("token");
  });

  it("não deve logar com senha inválida", async () => {
    const res = await request(app).post("/api/users/login").send({
      email: "prof@email.com",
      password: "errada",
    });

    expect(res.status).to.equal(401);
  });
});
