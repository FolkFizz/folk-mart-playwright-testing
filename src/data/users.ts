import { ENV } from "../config/env";

export const USERS = {
  standard: {
    username: ENV.testUserUsername,
    password: ENV.testUserPassword,
    email: ENV.testUserEmail
  },
  invalid: {
    username: "invalid-user",
    password: "wrong-password"
  }
} as const;
