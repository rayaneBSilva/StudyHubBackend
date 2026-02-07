import request from "supertest";
import app from "../../src/app";

export const createAndLoginUser = async (
  role: "teacher" | "student" = "student",
  email?: string,
) => {
  const userEmail = email || `${role}${Date.now()}@email.com`;

  await request(app)
    .post("/api/users")
    .send({
      name: role === "teacher" ? "Professor" : "Aluno",
      email: userEmail,
      password: "123456",
      role,
    });

  const login = await request(app).post("/api/users/login").send({
    email: userEmail,
    password: "123456",
  });

  return login.body.data.token;
};
