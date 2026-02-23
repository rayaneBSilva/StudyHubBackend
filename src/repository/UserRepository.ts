import { Op } from "sequelize";
import { BaseRepository } from "./BaseRepository";
import { User } from "../models/User";

export class UserRepository extends BaseRepository<User, any, any> {
  protected model = User;

  async findByEmail(email: string) {
    return User.findOne({ where: { email } });
  }

  async emailExists(email: string): Promise<boolean> {
    return (await this.findByEmail(email)) !== null;
  }

  async findFiltered(
    filters: { name?: string; email?: string },
    page: number = 1,
    limit: number = 10,
  ) {
    const offset = (page - 1) * limit;

    const { rows, count } = await User.findAndCountAll({
      attributes: { exclude: ["password"] }, // 🔥🔥🔥 AQUI
      where: {
        ...(filters.name && {
          name: { [Op.like]: `%${filters.name}%` },
        }),
        ...(filters.email && {
          email: { [Op.like]: `%${filters.email}%` },
        }),
      },
      limit,
      offset,
    });

    return {
      total: count,
      page,
      totalPages: Math.ceil(count / limit),
      data: rows,
    };
  }
}
