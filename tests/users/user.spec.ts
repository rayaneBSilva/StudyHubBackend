import request from "supertest";
import { expect } from "chai";
import app from "../../src/app";

let token: string;

describe("Users", () => {
  before(async () => {
    await request(app).post("/api/users").send({
      name: "Admin",
      email: "admin@email.com",
      password: "123456",
      role: "teacher",
    });

    const login = await request(app).post("/api/users/login").send({
      email: "admin@email.com",
      password: "123456",
    });

    token = login.body.data.token;
  });

  it("deve listar usuários autenticado", async () => {
    const res = await request(app)
      .get("/api/users")
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).to.equal(200);
    expect(res.body.data).to.be.an("array");
  });

  it("não deve acessar sem token", async () => {
    const res = await request(app).get("/api/users");
    expect(res.status).to.equal(401);
  });
});
