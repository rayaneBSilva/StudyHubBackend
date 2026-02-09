import request from "supertest";
import { expect } from "chai";
import app from "../../src/app";

let teacherToken: string;
let studentToken: string;

describe("Users API", () => {
  before(async () => {
    // cria professor
    await request(app).post("/api/users").send({
      name: "Admin",
      email: "admin@email.com",
      password: "123456",
      role: "teacher",
    });

    const teacherLogin = await request(app).post("/api/users/login").send({
      email: "admin@email.com",
      password: "123456",
    });

    teacherToken = teacherLogin.body.data.token;

    // cria aluno
    await request(app).post("/api/users").send({
      name: "Aluno",
      email: "aluno@email.com",
      password: "123456",
      role: "student",
    });

    const studentLogin = await request(app).post("/api/users/login").send({
      email: "aluno@email.com",
      password: "123456",
    });

    studentToken = studentLogin.body.data.token;
  });

  // =========================
  // CREATE USER
  // =========================

  it("deve criar usuário com sucesso", async () => {
    const res = await request(app)
      .post("/api/users")
      .send({
        name: "Teste",
        email: `teste_${Date.now()}@email.com`,
        password: "123456",
        role: "teacher",
      });

    expect(res.status).to.equal(201);
    expect(res.body.success).to.be.true;
  });

  it("não deve criar usuário sem nome", async () => {
    const res = await request(app).post("/api/users").send({
      email: "semnome@email.com",
      password: "123456",
      role: "teacher",
    });

    expect(res.status).to.equal(400);
  });

  it("não deve criar usuário sem email", async () => {
    const res = await request(app).post("/api/users").send({
      name: "Sem Email",
      password: "123456",
      role: "teacher",
    });

    expect(res.status).to.equal(400);
  });

  it("não deve criar usuário com senha curta", async () => {
    const res = await request(app).post("/api/users").send({
      name: "Senha Curta",
      email: "curta@email.com",
      password: "123",
      role: "teacher",
    });

    expect(res.status).to.equal(400);
  });

  it("não deve criar usuário com email duplicado", async () => {
    const res = await request(app).post("/api/users").send({
      name: "Duplicado",
      email: "admin@email.com",
      password: "123456",
      role: "teacher",
    });

    expect(res.status).to.equal(400);
  });

  // =========================
  // LOGIN
  // =========================

  it("deve fazer login com sucesso", async () => {
    const res = await request(app).post("/api/users/login").send({
      email: "admin@email.com",
      password: "123456",
    });

    expect(res.status).to.equal(200);
    expect(res.body.data).to.have.property("token");
  });

  it("não deve logar com email inexistente", async () => {
    const res = await request(app).post("/api/users/login").send({
      email: "naoexiste@email.com",
      password: "123456",
    });

    expect(res.status).to.equal(401);
  });

  it("não deve logar com senha incorreta", async () => {
    const res = await request(app).post("/api/users/login").send({
      email: "admin@email.com",
      password: "senhaerrada",
    });

    expect(res.status).to.equal(401);
  });

  // =========================
  // LIST USERS
  // =========================

  it("deve listar usuários autenticado como teacher", async () => {
    const res = await request(app)
      .get("/api/users")
      .set("Authorization", `Bearer ${teacherToken}`);

    expect(res.status).to.equal(200);
    expect(res.body.data).to.be.an("array");
  });

  it("não deve listar usuários sem token", async () => {
    const res = await request(app).get("/api/users");
    expect(res.status).to.equal(401);
  });

  it("não deve listar usuários se não for teacher", async () => {
    const res = await request(app)
      .get("/api/users")
      .set("Authorization", `Bearer ${studentToken}`);

    expect(res.status).to.equal(403);
  });

  it("deve listar usuários filtrando por nome", async () => {
    const res = await request(app)
      .get("/api/users?name=Admin")
      .set("Authorization", `Bearer ${teacherToken}`);

    expect(res.status).to.equal(200);
    expect(res.body.data.length).to.be.greaterThan(0);
  });

  it("deve listar usuários filtrando por email", async () => {
    const res = await request(app)
      .get("/api/users?email=admin")
      .set("Authorization", `Bearer ${teacherToken}`);

    expect(res.status).to.equal(200);
  });

  // =========================
  // UPDATE USERS
  // =========================
  it("deve atualizar usuário com novo email", async () => {
    const res = await request(app)
      .put("/api/users/1")
      .set("Authorization", `Bearer ${teacherToken}`)
      .send({
        email: "admin_novo@email.com",
      });

    expect(res.status).to.equal(200);
  });

  it("não deve atualizar usuário com email já usado por outro", async () => {
    const res = await request(app)
      .put("/api/users/1")
      .set("Authorization", `Bearer ${teacherToken}`)
      .send({
        email: "aluno@email.com", // já pertence a outro id
      });

    expect(res.status).to.be.oneOf([400, 409]);
  });

  it("deve atualizar usuário sem passar email", async () => {
    const res = await request(app)
      .put("/api/users/1")
      .set("Authorization", `Bearer ${teacherToken}`)
      .send({
        name: "Admin Atualizado",
      });

    expect(res.status).to.equal(200);
  });

  it("deve atualizar usuário com email vazio (ignorado pelo if)", async () => {
    const res = await request(app)
      .put("/api/users/1")
      .set("Authorization", `Bearer ${teacherToken}`)
      .send({
        email: "",
      });

    expect(res.status).to.equal(200);
  });

  // =========================
  // GET USERS
  // =========================
  // it("deve buscar usuário pelo email", async () => {
  //   const res = await request(app)
  //     .get("/api/users/email/admin@email.com")
  //     .set("Authorization", `Bearer ${teacherToken}`);

  //   expect(res.status).to.equal(200);
  //   expect(res.body.data).to.have.property("email", "admin@email.com");
  // });

  it("não deve buscar usuário com email inexistente", async () => {
    const res = await request(app)
      .get("/api/users/email/inexistente@email.com")
      .set("Authorization", `Bearer ${teacherToken}`);

    expect(res.status).to.equal(404);
  });
});
