import { BaseService } from "./BaseService";
import { UserRepository } from "../repository/UserRepository";
import { UserAttributes, UserCreationAttributes } from "../models/User";
import { hashPassword, comparePassword, generateToken } from "../utils/auth";

export class UserService extends BaseService<
  UserRepository,
  UserAttributes,
  UserCreationAttributes
> {
  constructor() {
    super(new UserRepository());
  }

  async createUser(data: UserCreationAttributes) {
    if (!data.name?.trim()) throw new Error("Nome é obrigatório");
    if (!data.email?.trim()) throw new Error("Email é obrigatório");
    if (!data.password || data.password.length < 6)
      throw new Error("Senha deve ter pelo menos 6 caracteres");

    const exists = await this.repository.emailExists(data.email);
    if (exists) throw new Error("Email já está em uso");

    data.password = await hashPassword(data.password);

    return this.create(data);
  }

  async updateUser(id: number, data: Partial<UserAttributes>) {
    if (data.email) {
      const existingUser = await this.repository.findByEmail(data.email);
      if (existingUser && existingUser.id !== id)
        throw new Error("Email já está em uso por outro usuário");
    }

    return this.update(id, data);
  }

  async getUserByEmail(email: string) {
    const user = await this.repository.findByEmail(email);
    if (!user) throw new Error("Usuário não encontrado");
    return user;
  }

  async loginUser(email: string, password: string) {
    const user = await this.repository.findByEmail(email);
    if (!user) throw new Error("Email ou senha inválidos");

    const valid = await comparePassword(password, user.password);
    if (!valid) throw new Error("Email ou senha inválidos");

    const token = generateToken(user);

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      token,
    };
  }

  async filterUsers(filters: { name?: string; email?: string }) {
    return this.repository.findFiltered(filters);
  }
}
