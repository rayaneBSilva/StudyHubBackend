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
}
