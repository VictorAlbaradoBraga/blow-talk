const { createServer } = require("http");
const express = require("express");
const { Server } = require("socket.io");
const bcrypt = require("bcrypt");
const sqlite3 = require("sqlite3").verbose();
const cors = require("cors");
const crypto = require("crypto");

const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3001",
    methods: ["GET", "POST"],
  },
});

// Middleware
app.use(cors());
app.use(express.json());

// Conexão com o banco de dados SQLite
const db = new sqlite3.Database("../database.db", (err) => {
  if (err) {
    console.error("Erro ao conectar ao banco de dados:", err);
  } else {
    console.log("Conectado ao banco de dados SQLite.");
  }
});

// Função para gerar uma chave simétrica aleatória
function generateSymmetricKey() {
  return crypto.randomBytes(16).toString("base64"); // Chave de 128 bits
}

// ==================== Rotas de Autenticação e Registro ==================== //

// Registro de usuário
app.post("/register", async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Todos os campos são obrigatórios" });
  }

  try {
    const passwordHash = await bcrypt.hash(password, 10);
    const symmetricKey = generateSymmetricKey();

    db.run(
      `INSERT INTO users (username, passwordHash, symmetricKey) VALUES (?, ?, ?)`,
      [username, passwordHash, symmetricKey],
      function (err) {
        if (err) {
          return res.status(400).json({ message: "Erro ao cadastrar usuário" });
        }
        // Envia a `symmetricKey` para o cliente, onde ela será criptografada
        res.status(201).json({
          message: "Cadastro realizado com sucesso!",
          symmetricKey,
        });
      }
    );
  } catch (error) {
    console.error("Erro ao processar o registro:", error);
    res.status(500).json({ message: "Erro no servidor ao processar o registro" });
  }
});

// Login de usuário
app.post("/login", (req, res) => {
  const { username, password } = req.body;
  db.get(`SELECT * FROM users WHERE username = ?`, [username], async (err, user) => {
    if (err || !user || !(await bcrypt.compare(password, user.passwordHash))) {
      return res.status(401).json({ message: "Credenciais inválidas" });
    }
    db.run(`UPDATE users SET loggedIn = 1 WHERE id = ?`, [user.id]);
    res.status(200).json({ message: "Login realizado com sucesso!", userId: user.id, isAuthenticated: true });
  });
});


// ==================== Rotas de Gerenciamento de Amigos ==================== //

// Aceitar pedido de amizade
app.post("/accept-friend", (req, res) => {
  const { userId, friendId } = req.body;
  db.run(
    `UPDATE friends SET status = 'accepted' WHERE user_id = ? AND friend_id = ?`,
    [friendId, userId],
    function (err) {
      if (err) return res.status(400).json({ message: "Erro ao aceitar amigo" });
      res.status(200).json({ message: "Amizade aceita!" });
    }
  );
});

// Listar amigos
app.get("/friends/:userId", (req, res) => {
  const { userId } = req.params;
  db.all(
    `SELECT users.id, users.username FROM users
     JOIN friends ON users.id = friends.friend_id
     WHERE friends.user_id = ? AND friends.status = 'accepted'`,
    [userId],
    (err, rows) => {
      if (err) return res.status(400).json({ message: "Erro ao listar amigos" });
      res.json(rows);
    }
  );
});

// Listar pedidos de amizade pendentes
app.get("/friend-requests/:userId", (req, res) => {
  const { userId } = req.params;
  db.all(
    `SELECT users.id, users.username FROM users
     JOIN friends ON users.id = friends.user_id
     WHERE friends.friend_id = ? AND friends.status = 'pending'`,
    [userId],
    (err, rows) => {
      if (err) return res.status(400).json({ message: "Erro ao listar pedidos de amizade" });
      res.json(rows);
    }
  );
});

// Recusar pedido de amizade
app.post("/decline-friend", (req, res) => {
  const { requestId } = req.body;
  db.run(
    `DELETE FROM friends WHERE id = ? AND status = 'pending'`,
    [requestId],
    function (err) {
      if (err) return res.status(400).json({ message: "Erro ao recusar amigo" });
      res.status(200).json({ message: "Pedido de amizade recusado." });
    }
  );
});

// ==================== Rotas de Gerenciamento de Grupos ==================== //

// Listar grupos do usuário
app.get("/user-groups/:userId", (req, res) => {
  const { userId } = req.params;
  db.all(
    `SELECT groups.group_id, groups.group_name FROM groups
     JOIN group_members ON groups.group_id = group_members.group_id
     WHERE group_members.user_id = ?`,
    [userId],
    (err, rows) => {
      if (err) return res.status(400).json({ message: "Erro ao listar grupos" });
      res.json(rows);
    }
  );
});

// ==================== Configuração de Socket.IO para Mensagens ==================== //

io.on("connection", (socket) => {
  console.log("Novo cliente conectado:", socket.id);

  socket.on("send message", (data) => {
    io.to(data.id).emit("receive message", { msg: data.msg });
  });

  socket.on("send group message", (data) => {
    io.emit("group message", { msg: data.msg, groupId: data.groupId });
  });

  socket.on("disconnect", () => {
    console.log("Cliente desconectado:", socket.id);
  });
});

// ==================== Inicialização do Servidor ==================== //

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
