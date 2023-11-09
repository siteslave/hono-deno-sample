import sql from "../db/database.ts";

export class UserModel {
  getAll() {
    return sql`SELECT user_id, username, first_name, last_name FROM users`;
  }

  remove(userId) {
    return sql`DELETE FROM users WHERE user_id=${userId}`
  }

  createUser(username, password, firstName, lastName) {
    return sql`INSERT INTO users (username, password, first_name, last_name)
    VALUES (${username},${password},${firstName},${lastName})`
  }

  updateUser(userId, password, firstName, lastName) {
    return sql`
    UPDATE users
    SET password=${password}, first_name=${firstName}, last_name=${lastName}
    WHERE user_id=${userId}`
  }
}