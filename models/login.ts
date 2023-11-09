import sql from "../db/database.ts";

export class LoginModel {
  loginInfo(username) {
    return sql`SELECT * FROM users WHERE username=${username} limit 1`
  }
}