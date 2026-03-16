const express = require("express");
const cors = require("cors");
const commentRoutes = require("./routes/comments.routes");
const userRoutes = require("./routes/users.routes");

const app = express();
const PORT = process.env.PORT || 3000;

const path = require('path');

const normalizeOrigin = (value) => String(value).replace(/\/+$/, "");
const allowedOrigins = (process.env.CORS_ORIGIN || "http://localhost:5173")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean)
  .map(normalizeOrigin);


app.use(express.json());

 app.use(
  cors({
    origin: (requestOrigin, callback) => {
      // Allow requests without Origin header (curl, health checks, server-to-server calls).
      if (!requestOrigin) {
        callback(null, true);
        return;
      }

      const isAllowed = allowedOrigins.includes(normalizeOrigin(requestOrigin));
      callback(null, isAllowed);
    },
    methods: ["GET", "POST", "PATCH", "PUT", "DELETE", "OPTIONS"],
  })
); 

// statikus frontend fájlok
/* app.use(express.static(path.join(__dirname, '../frontend/dist')));
 */
app.use("/comments", commentRoutes);
app.use("/users", userRoutes);

app.get('/', (req, res) => {
  res.status(200).json({
    ok: true,
    message: 'Interactive comments API is running',
    endpoints: ['/health', '/users', '/comments']
  });
});

/* // minden más kérés a React appot tálal (SPA fallback)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/dist', 'index.html'));
}); */

app.get('/health', (req, res) => res.status(200).json({ok:true}));

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});