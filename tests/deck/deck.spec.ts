import request from "supertest";
import { expect } from "chai";
import app from "../../src/app";

let teacherToken: string;
let studentToken: string;
let createdDeckId: number;

describe("Deck API", () => {
  before(async () => {
    await request(app).post("/api/users").send({
      name: "DeckTeacher",
      email: "deckteacher@email.com",
      password: "123456",
      role: "teacher",
    });

    const teacherLogin = await request(app).post("/api/users/login").send({
      email: "deckteacher@email.com",
      password: "123456",
    });

    teacherToken = teacherLogin.body.data.token;

    await request(app).post("/api/users").send({
      name: "DeckStudent",
      email: "deckstudent@email.com",
      password: "123456",
      role: "student",
    });

    const studentLogin = await request(app).post("/api/users/login").send({
      email: "deckstudent@email.com",
      password: "123456",
    });

    studentToken = studentLogin.body.data.token;
  });

  it("deve criar deck com sucesso", async () => {
    const res = await request(app)
      .post("/api/decks")
      .set("Authorization", `Bearer ${teacherToken}`)
      .send({
        nome: "Deck Teste",
        descricao: "Descrição teste",
      });

    expect(res.status).to.equal(201);
    expect(res.body.success).to.be.true;

    createdDeckId = res.body.data.id;
  });

  it("não deve criar deck sem nome", async () => {
    const res = await request(app)
      .post("/api/decks")
      .set("Authorization", `Bearer ${teacherToken}`)
      .send({
        descricao: "Sem nome",
      });

    expect(res.status).to.equal(400);
  });

  it("não deve criar deck sem token", async () => {
    const res = await request(app).post("/api/decks").send({
      nome: "Sem Token",
    });

    expect(res.status).to.equal(401);
  });

  it("deve listar decks autenticado", async () => {
    const res = await request(app)
      .get("/api/decks")
      .set("Authorization", `Bearer ${teacherToken}`);

    expect(res.status).to.equal(200);
    expect(res.body.data).to.be.an("array");
  });

  it("não deve listar decks sem token", async () => {
    const res = await request(app).get("/api/decks");
    expect(res.status).to.equal(401);
  });

  it("deve buscar deck por id", async () => {
    const res = await request(app)
      .get(`/api/decks/${createdDeckId}`)
      .set("Authorization", `Bearer ${teacherToken}`);

    expect(res.status).to.equal(200);
    expect(res.body.data.id).to.equal(createdDeckId);
  });

  it("não deve buscar deck inexistente", async () => {
    const res = await request(app)
      .get("/api/decks/999999")
      .set("Authorization", `Bearer ${teacherToken}`);

    expect(res.status).to.equal(404);
  });

  it("deve atualizar nome do deck", async () => {
    const res = await request(app)
      .put(`/api/decks/${createdDeckId}`)
      .set("Authorization", `Bearer ${teacherToken}`)
      .send({
        nome: "Deck Atualizado",
      });

    expect(res.status).to.equal(200);
  });

  it("deve atualizar descrição do deck", async () => {
    const res = await request(app)
      .put(`/api/decks/${createdDeckId}`)
      .set("Authorization", `Bearer ${teacherToken}`)
      .send({
        descricao: "Nova descrição",
      });

    expect(res.status).to.equal(200);
  });

  it("não deve atualizar deck inexistente", async () => {
    const res = await request(app)
      .put("/api/decks/999999")
      .set("Authorization", `Bearer ${teacherToken}`)
      .send({
        nome: "Inexistente",
      });

    expect(res.status).to.equal(404);
  });

  it("deve deletar deck", async () => {
    const res = await request(app)
      .delete(`/api/decks/${createdDeckId}`)
      .set("Authorization", `Bearer ${teacherToken}`);

    expect(res.status).to.equal(200);
  });

  it("não deve deletar deck inexistente", async () => {
    const res = await request(app)
      .delete("/api/decks/999999")
      .set("Authorization", `Bearer ${teacherToken}`);

    expect(res.status).to.equal(404);
  });
});
