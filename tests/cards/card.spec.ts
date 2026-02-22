import request from "supertest";
import { expect } from "chai";
import app from "../../src/app";

let teacherToken: string;
let studentToken: string;
let deckId: number;
let pendingCardId: number;
let approvedCardId: number;

describe("Card API", () => {
  before(async () => {
    // teacher
    await request(app).post("/api/users").send({
      name: "CardTeacher",
      email: "cardteacher@email.com",
      password: "123456",
      role: "teacher",
    });

    const teacherLogin = await request(app).post("/api/users/login").send({
      email: "cardteacher@email.com",
      password: "123456",
    });

    teacherToken = teacherLogin.body.data.token;

    // student
    await request(app).post("/api/users").send({
      name: "CardStudent",
      email: "cardstudent@email.com",
      password: "123456",
      role: "student",
    });

    const studentLogin = await request(app).post("/api/users/login").send({
      email: "cardstudent@email.com",
      password: "123456",
    });

    studentToken = studentLogin.body.data.token;

    // criar deck
    const deck = await request(app)
      .post("/api/decks")
      .set("Authorization", `Bearer ${teacherToken}`)
      .send({
        nome: "Deck Card Test",
      });

    deckId = deck.body.data.id;
  });

  it("aluno deve criar card como PENDING", async () => {
    const res = await request(app)
      .post("/api/cards")
      .set("Authorization", `Bearer ${studentToken}`)
      .send({
        frente: "Pergunta",
        verso: "Resposta",
        deck_id: deckId,
      });

    expect(res.status).to.equal(201);
    expect(res.body.data.status).to.equal("PENDING");

    pendingCardId = res.body.data.id;
  });

  it("professor deve criar card como APPROVED", async () => {
    const res = await request(app)
      .post("/api/cards")
      .set("Authorization", `Bearer ${teacherToken}`)
      .send({
        frente: "Pergunta 2",
        verso: "Resposta 2",
        deck_id: deckId,
      });

    expect(res.status).to.equal(201);
    expect(res.body.data.status).to.equal("APPROVED");

    approvedCardId = res.body.data.id;
  });

  it("não deve criar sem frente", async () => {
    const res = await request(app)
      .post("/api/cards")
      .set("Authorization", `Bearer ${teacherToken}`)
      .send({
        verso: "Resposta",
        deck_id: deckId,
      });

    expect(res.status).to.equal(400);
  });

  it("não deve criar sem verso", async () => {
    const res = await request(app)
      .post("/api/cards")
      .set("Authorization", `Bearer ${teacherToken}`)
      .send({
        frente: "Pergunta",
        deck_id: deckId,
      });

    expect(res.status).to.equal(400);
  });

  it("não deve criar com deck inexistente", async () => {
    const res = await request(app)
      .post("/api/cards")
      .set("Authorization", `Bearer ${teacherToken}`)
      .send({
        frente: "Pergunta",
        verso: "Resposta",
        deck_id: 999999,
      });

    expect(res.status).to.equal(400);
  });

  it("professor deve aprovar card", async () => {
    const res = await request(app)
      .patch(`/api/cards/${pendingCardId}/approve`)
      .set("Authorization", `Bearer ${teacherToken}`);

    expect(res.status).to.equal(200);
    expect(res.body.data.status).to.equal("APPROVED");
  });

  it("não deve aprovar card inexistente", async () => {
    const res = await request(app)
      .patch("/api/cards/999999/approve")
      .set("Authorization", `Bearer ${teacherToken}`);

    expect(res.status).to.equal(400);
  });

  it("professor deve rejeitar card", async () => {
    const card = await request(app)
      .post("/api/cards")
      .set("Authorization", `Bearer ${studentToken}`)
      .send({
        frente: "Pergunta reject",
        verso: "Resposta reject",
        deck_id: deckId,
      });

    const res = await request(app)
      .patch(`/api/cards/${card.body.data.id}/reject`)
      .set("Authorization", `Bearer ${teacherToken}`)
      .send({
        reason: "Erro",
      });

    expect(res.status).to.equal(200);
    expect(res.body.data.status).to.equal("REJECTED");
  });

  it("não deve rejeitar sem motivo", async () => {
    const res = await request(app)
      .patch(`/api/cards/${approvedCardId}/reject`)
      .set("Authorization", `Bearer ${teacherToken}`)
      .send({});

    expect(res.status).to.equal(400);
  });

  it("deve listar cards para estudar", async () => {
    const res = await request(app)
      .get(`/api/cards/study/${deckId}`)
      .set("Authorization", `Bearer ${teacherToken}`);

    expect(res.status).to.equal(200);
    expect(res.body.data).to.be.an("array");
  });

  it("deve revisar card com quality válida", async () => {
    const res = await request(app)
      .patch(`/api/cards/review/${approvedCardId}`)
      .set("Authorization", `Bearer ${teacherToken}`)
      .send({
        quality: 5,
      });

    expect(res.status).to.equal(200);
    expect(res.body.data.repetitions).to.be.greaterThan(0);
  });

  it("não deve revisar sem quality", async () => {
    const res = await request(app)
      .patch(`/api/cards/review/${approvedCardId}`)
      .set("Authorization", `Bearer ${teacherToken}`)
      .send({});

    expect(res.status).to.equal(400);
  });

  it("não deve revisar com quality inválida", async () => {
    const res = await request(app)
      .patch(`/api/cards/review/${approvedCardId}`)
      .set("Authorization", `Bearer ${teacherToken}`)
      .send({
        quality: 10,
      });

    expect(res.status).to.equal(400);
  });

  it("não deve revisar card inexistente", async () => {
    const res = await request(app)
      .patch(`/api/cards/review/999999`)
      .set("Authorization", `Bearer ${teacherToken}`)
      .send({
        quality: 5,
      });

    expect(res.status).to.equal(400);
  });

  it("catch de erro do reject deve retornar 400", async () => {
    const res = await request(app)
      .patch(`/api/cards/abc/reject`)
      .set("Authorization", `Bearer ${teacherToken}`)
      .send({ reason: "Teste catch" });

    expect(res.status).to.equal(400);
    expect(res.body.success).to.be.false;
  });

  it("catch de erro do getCardsToStudy deve retornar 400", async () => {
    const res = await request(app)
      .get(`/api/cards/study/abc`)
      .set("Authorization", `Bearer ${teacherToken}`);

    expect(res.status).to.equal(400);
    expect(res.body.success).to.be.false;
  });
});
