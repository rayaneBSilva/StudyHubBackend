import request from "supertest";
import { expect } from "chai";
import fs from "fs";
import path from "path";
import app from "../../src/app";

let teacherToken: string;
let studentToken: string;
let createdSummaryId: number;

describe("Summary API", () => {
  before(async () => {
    await request(app).post("/api/users").send({
      name: "SummaryTeacher",
      email: "summaryteacher@email.com",
      password: "123456",
      role: "teacher",
    });

    const teacherLogin = await request(app).post("/api/users/login").send({
      email: "summaryteacher@email.com",
      password: "123456",
    });

    teacherToken = teacherLogin.body.data.token;

    // Cria student
    await request(app).post("/api/users").send({
      name: "SummaryStudent",
      email: "summarystudent@email.com",
      password: "123456",
      role: "student",
    });

    const studentLogin = await request(app).post("/api/users/login").send({
      email: "summarystudent@email.com",
      password: "123456",
    });

    studentToken = studentLogin.body.data.token;
  });

  it("deve criar resumo com PDF", async () => {
    const res = await request(app)
      .post("/api/summaries")
      .set("Authorization", `Bearer ${teacherToken}`)
      .field("titulo", "Resumo Teste")
      .field("disciplina", "Matemática")
      .attach("pdf", path.join(__dirname, "../files/dummy.pdf"));

    expect(res.status).to.equal(201);
    expect(res.body.success).to.be.true;
    createdSummaryId = res.body.data.id;
  });

  it("não deve criar resumo sem PDF", async () => {
    const res = await request(app)
      .post("/api/summaries")
      .set("Authorization", `Bearer ${teacherToken}`)
      .field("titulo", "Resumo sem PDF")
      .field("disciplina", "Física");

    expect(res.status).to.equal(400);
    expect(res.body.message).to.equal("PDF obrigatório");
  });

  it("não deve criar resumo sem título", async () => {
    const res = await request(app)
      .post("/api/summaries")
      .set("Authorization", `Bearer ${teacherToken}`)
      .attach("pdf", path.join(__dirname, "../files/dummy.pdf"))
      .field("disciplina", "Química");

    expect(res.status).to.equal(400);
  });

  it("não deve criar resumo sem token", async () => {
    const res = await request(app)
      .post("/api/summaries")
      .attach("pdf", path.join(__dirname, "../files/dummy.pdf"))
      .field("titulo", "Resumo Teste")
      .field("disciplina", "Biologia");

    expect(res.status).to.equal(401);
  });

  it("deve listar resumos paginados", async () => {
    const res = await request(app)
      .get("/api/summaries?page=1&limit=5")
      .set("Authorization", `Bearer ${teacherToken}`);

    expect(res.status).to.equal(200);
    expect(res.body.data).to.be.an("array");
    expect(res.body).to.have.property("total");
    expect(res.body).to.have.property("totalPages");
  });

  it("deve filtrar resumos por título", async () => {
    const res = await request(app)
      .get("/api/summaries?titulo=Resumo")
      .set("Authorization", `Bearer ${teacherToken}`);

    expect(res.status).to.equal(200);
    expect(res.body.data.length).to.be.greaterThan(0);
  });

  it("deve filtrar resumos por disciplina", async () => {
    const res = await request(app)
      .get("/api/summaries?disciplina=Matemática")
      .set("Authorization", `Bearer ${teacherToken}`);

    expect(res.status).to.equal(200);
  });

  it("não deve listar resumos sem token", async () => {
    const res = await request(app).get("/api/summaries");
    expect(res.status).to.equal(401);
  });

  it("deve buscar resumo por id", async () => {
    const res = await request(app)
      .get(`/api/summaries/${createdSummaryId}`)
      .set("Authorization", `Bearer ${teacherToken}`);

    expect(res.status).to.equal(200);
    expect(res.body.data.id).to.equal(createdSummaryId);
  });

  it("deve atualizar título do resumo", async () => {
    const res = await request(app)
      .put(`/api/summaries/${createdSummaryId}`)
      .set("Authorization", `Bearer ${teacherToken}`)
      .send({ titulo: "Resumo Atualizado" });

    expect(res.status).to.equal(200);
    expect(res.body.data.titulo).to.equal("Resumo Atualizado");
  });

  it("deve deletar resumo", async () => {
    const res = await request(app)
      .delete(`/api/summaries/${createdSummaryId}`)
      .set("Authorization", `Bearer ${teacherToken}`);

    expect(res.status).to.equal(200);
  });
});
