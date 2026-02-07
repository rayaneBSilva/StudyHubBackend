import chai from "chai";
import sequelize from "../src/config/database";

chai.config.includeStack = true;

before(async () => {
  process.env.JWT_SECRET = "test-secret";

  await sequelize.sync({ force: true });
});

after(async () => {
  await sequelize.close();
});
