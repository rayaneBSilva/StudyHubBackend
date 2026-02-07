import request from "supertest";
import { expect } from "chai";
import app from "../../src/app";
import { createAndLoginUser } from "../helpers/auth";

describe("Cards", () => {
  let teacherToken: string;
  let studentToken: string;

  before(async () => {
    teacherToken = await createAndLoginUser("teacher");
    studentToken = await createAndLoginUser("student");
  });

  it("professor pode criar card", async () => {
    const res = await request(app)
      .post("/api/cards")
      .set("Authorization", `Bearer ${teacherToken}`)
      .send({
        titulo: "Node.js",
        conteudo: "Express",
        disciplina: "Backend",
        autor_id: 1,
      });

    expect(res.status).to.equal(201);
  });

  it("aluno não pode criar card", async () => {
    const res = await request(app)
      .post("/api/cards")
      .set("Authorization", `Bearer ${studentToken}`)
      .send({
        titulo: "Proibido",
      });

    expect(res.status).to.equal(403);
  });
});
