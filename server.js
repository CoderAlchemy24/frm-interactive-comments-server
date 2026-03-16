const express = require("express");
const cors = require("cors");
const commentRoutes = require("./routes/comments.routes");
const userRoutes = require("./routes/users.routes");

const app = express();
const PORT = process.env.PORT || 3000;

const normalizeOrigin = (value) => String(value).replace(/\/+$/, "");
const configuredOrigins = (process.env.CORS_ORIGIN || "")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean)
  .map(normalizeOrigin);

const defaultOrigins = [
  "http://localhost:5173",
  "http://127.0.0.1:5173",
  "https://interactive-comments-frontend.onrender.com",
  "https://wonderful-hotteok-048126.netlify.app",
];

const allowedOrigins = new Set([
  ...defaultOrigins,
  ...configuredOrigins,
]);

const isTrustedPlatformOrigin = (origin) => {
  try {
    const { hostname } = new URL(origin);
    return hostname.endsWith(".onrender.com") || hostname.endsWith(".netlify.app");
  } catch {
    return false;
  }
};


app.use(express.json());

app.use(
  cors({
    origin: (requestOrigin, callback) => {
      // Allow requests without Origin header (curl/health checks/server-to-server calls).
      if (!requestOrigin) {
        callback(null, true);
        return;
      }

      const normalizedOrigin = normalizeOrigin(requestOrigin);
      const isAllowed =
        allowedOrigins.has(normalizedOrigin) || isTrustedPlatformOrigin(normalizedOrigin);

      callback(null, isAllowed);
    },
    methods: ["GET", "POST", "PATCH", "PUT", "DELETE", "OPTIONS"],
  })
);
app.use("/comments", commentRoutes);
app.use("/users", userRoutes);

app.get('/', (req, res) => {
  res.status(200).json({
    ok: true,
    message: 'Interactive comments API is running',
    endpoints: ['/health', '/users', '/comments']
  });
});

app.get('/health', (req, res) => res.status(200).json({ok:true}));

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});