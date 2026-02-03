import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import pkg from "pg";

dotenv.config();
const { Pool } = pkg;

const app = express();
const PORT = process.env.PORT || 8080;

app.use(cors());
app.use(express.json());

// const pool = new Pool({
//   connectionString: process.env.DATABASE_URL,
//   ssl: { rejectUnauthorized: false }, //For Supabase

//   family: 4, //Take a lot of time IPV4 not IPV6
// });
const pool = new Pool({
  host: "db.nfnqpzwhoqarwclrpvdt.supabase.co",
  user: "postgres",
  password: process.env.DB_PASSWORD,
  database: "postgres",
  port: 5432,
  ssl: { rejectUnauthorized: false },
  family: 4,
});
export default pool;
pool
  .query("SELECT 1")
  .then(() => console.log("DB connected ✅"))
  .catch((err) => console.error("DB FAIL ❌", err));

// GET /messages
app.get("/messages", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM messages ORDER BY id DESC");
    res.json(result.rows);
  } catch (err) {
    console.error("GET /messages error:", err);
    res.status(500).json({ error: "Failed to fetch messages" });
  }
});

// POST /messages
app.post("/messages", async (req, res) => {
  try {
    const { username, content } = req.body;

    if (!username || !content) {
      return res.status(400).json({ error: "username и content обязательны" });
    }

    const result = await pool.query(
      "INSERT INTO messages (username, content) VALUES ($1, $2) RETURNING *",
      [username, content],
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("POST /messages error:", err);
    res.status(500).json({ error: "Failed to create message" });
  }
});
//Delete message
app.delete("/messages/:id", async (req, res) => {
  const { id } = req.params;

  await pool.query("DELETE FROM messages WHERE id = $1", [id]);

  res.json({ success: true });
});
//Likes
app.post("/messages/:id/like", async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      "UPDATE messages SET likes = likes + 1 WHERE id = $1 RETURNING *",
      [id],
    );

    res.json(result.rows[0]);
  } catch (err) {
    console.error("LIKE error:", err);
    res.status(500).json({ error: "Failed to like message" });
  }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
