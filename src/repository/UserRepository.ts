import { User } from "../models/User";

export class UserRepository {
  async create(data: any) {
    return await User.create(data);
  }

  async findAll() {
    return await User.findAll();
  }

  async findById(id: number) {
    return await User.findByPk(id);
  }

  async findByEmail(email: string) {
    return await User.findOne({ where: { email } });
  }

  async emailExists(email: string): Promise<boolean> {
    const user = await User.findOne({ where: { email } });
    return user !== null;
  }

  async update(id: number, data: any) {
    const user = await User.findByPk(id);
    if (!user) return null;

    await user.update(data);
    return user;
  }

  async delete(id: number) {
    const user = await User.findByPk(id);
    if (!user) return false;

    await user.destroy();
    return true;
  }
}
