CREATE TABLE users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT UNIQUE,
  passwordHash TEXT,
  publicKey TEXT,
  symmetricKey TEXT, -- Chave simétrica adicionada para criptografia
  loggedIn INTEGER DEFAULT 0
);

CREATE TABLE friends (
  user_id INTEGER,
  friend_id INTEGER,
  status TEXT CHECK(status IN ('pending', 'accepted', 'blocked')),
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (friend_id) REFERENCES users(id),
  PRIMARY KEY (user_id, friend_id)
);

CREATE TABLE groups (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  group_name TEXT UNIQUE,
  creator_id INTEGER,
  FOREIGN KEY (creator_id) REFERENCES users(id)
);

CREATE TABLE group_members (
  group_id INTEGER,
  user_id INTEGER,
  FOREIGN KEY (group_id) REFERENCES groups(id),
  FOREIGN KEY (user_id) REFERENCES users(id),
  PRIMARY KEY (group_id, user_id)
);
