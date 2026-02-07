import request from "supertest";
import { expect } from "chai";
import app from "../../src/app";
import { createAndLoginUser } from "../helpers/auth";

describe("Folders", () => {
  let token: string;

  before(async () => {
    token = await createAndLoginUser("teacher");
  });

  it("deve criar uma pasta", async () => {
    const res = await request(app)
      .post("/api/folders")
      .set("Authorization", `Bearer ${token}`)
      .send({
        nome: "Backend",
        descricao: "Pastas de backend",
        autor_id: 1,
      });

    expect(res.status).to.equal(201);
  });

  it("deve listar pastas", async () => {
    const res = await request(app)
      .get("/api/folders")
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).to.equal(200);
    expect(res.body.data).to.be.an("array");
  });
});
