import request from "supertest";
import { expect } from "chai";
import app from "../../src/app";
import { createAndLoginUser } from "../helpers/auth";

describe("Summaries", () => {
  let token: string;

  before(async () => {
    token = await createAndLoginUser("teacher");
  });

  it("deve criar resumo", async () => {
    const res = await request(app)
      .post("/api/summaries")
      .set("Authorization", `Bearer ${token}`)
      .send({
        titulo: "Resumo API",
        conteudo: "REST",
        disciplina: "Backend",
        autor_id: 1,
      });

    expect(res.status).to.equal(201);
  });

  it("deve listar resumos", async () => {
    const res = await request(app)
      .get("/api/summaries")
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).to.equal(200);
    expect(res.body.data).to.be.an("array");
  });
});
