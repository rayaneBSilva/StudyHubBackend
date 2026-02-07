import { Op } from "sequelize";
import { BaseRepository } from "./BaseRepository";
import { User } from "../models/User";

export class UserRepository extends BaseRepository<User, any, any> {
  protected model = User;

  async findFiltered(filters: { name?: string; email?: string }) {
    return User.findAll({
      where: {
        ...(filters.name && {
          name: { [Op.like]: `%${filters.name}%` },
        }),
        ...(filters.email && {
          email: { [Op.like]: `%${filters.email}%` },
        }),
      },
    });
  }

  async findByEmail(email: string) {
    return User.findOne({ where: { email } });
  }

  async emailExists(email: string): Promise<boolean> {
    return (await this.findByEmail(email)) !== null;
  }
}
