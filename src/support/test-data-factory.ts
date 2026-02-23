export type TestUserSeed = {
  username: string;
  email: string;
  password: string;
};

export const createUniqueUserSeed = (prefix = "folkqa"): TestUserSeed => {
  const token = `${Date.now()}${Math.floor(Math.random() * 1000)}`;
  return {
    username: `${prefix}_${token}`,
    email: `${prefix}_${token}@example.test`,
    password: "UserPass123"
  };
};
