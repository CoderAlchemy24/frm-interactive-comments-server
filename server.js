const express = require("express");
const cors = require("cors");
const commentRoutes = require("./routes/comments.routes");
const userRoutes = require("./routes/users.routes");

const app = express();
const PORT = process.env.PORT || 3000;

const path = require('path');


app.use(express.json());

 app.use(
  cors({
    origin: process.env.CORS_ORIGIN || "http://localhost:5173",
    methods: ["GET", "POST", "PATCH", "PUT", "DELETE", "OPTIONS"],
  })
); 

// statikus frontend fájlok
/* app.use(express.static(path.join(__dirname, '../frontend/dist')));
 */
app.use("/comments", commentRoutes);
app.use("/users", userRoutes);

/* // minden más kérés a React appot tálal (SPA fallback)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/dist', 'index.html'));
}); */

app.get('/health', (req, res) => res.status(200).json({ok:true}));

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});