const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const jwt = require("jsonwebtoken");
const { OAuth2Client } = require("google-auth-library");
const multer = require("multer");
const http = require("http");
const { Server } = require("socket.io");
const User = require("./models/User");
const Recipe = require("./models/Recipe");
require("dotenv").config();

const app = express();
const server = http.createServer(app); // HTTP 서버 생성
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000", // 프론트엔드 URL
    methods: ["GET", "POST"],
    credentials: true,
  },
});
const PORT = 5000;

// MongoDB 연결
mongoose
  .connect(process.env.DB_CONNECT, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => {
    console.error("MongoDB connection error:", err);
    process.exit(1);
  });

// Middleware
app.use(cors({ origin: "http://localhost:3000", credentials: true }));
app.use(express.json());

// Google OAuth2 Client
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// Multer 설정
const upload = multer({
  dest: "uploads/",
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB 제한
});

// 기본 경로
app.get("/", (req, res) => {
  res.send("Server is running!");
});

// Google OAuth 엔드포인트
app.post("/auth/google", async (req, res) => {
  const { token } = req.body;

  try {
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const user = {
      googleId: payload.sub,
      email: payload.email,
      name: payload.name,
      picture: payload.picture,
    };

    let existingUser = await User.findOne({ googleId: payload.sub });
    if (!existingUser) {
      existingUser = new User(user);
      await existingUser.save();
    }

    const jwtToken = jwt.sign(user, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    res.status(200).json({ success: true, accessToken: jwtToken });
  } catch (error) {
    console.error("Error during Google Auth:", error.message);
    res.status(400).json({ success: false, message: "Invalid token" });
  }
});

// 레시피 저장 API
app.post("/recipes", upload.single("image"), async (req, res) => {
  try {
    const {
      recipeName,
      recipeIntroduction,
      categories,
      info,
      ingredients,
      steps,
    } = req.body;
    const parsedInfo = JSON.parse(info);
    const parsedCategories = JSON.parse(categories);
    const parsedIngredients = JSON.parse(ingredients);

    const recipe = new Recipe({
      recipeName,
      recipeIntroduction,
      categories: parsedCategories,
      info: parsedInfo,
      ingredients: parsedIngredients,
      steps,
      image: req.file ? req.file.path : null,
    });

    await recipe.save();
    res
      .status(201)
      .json({ success: true, message: "Recipe created successfully" });
  } catch (error) {
    console.error("Error saving recipe:", error.message);
    res.status(500).json({ success: false, message: "Failed to save recipe" });
  }
});

// 레시피 검색 API
app.post("/search", async (req, res) => {
  try {
    const { categories, situation, ingredient, count, time, difficulty } =
      req.body;
    const query = {};

    if (categories) query["categories.type"] = categories;
    if (situation) query["categories.situation"] = situation;
    if (ingredient) query["categories.ingredient"] = ingredient;
    if (count) query["info.count"] = count;
    if (time) query["info.time"] = time;
    if (difficulty) query["info.difficulty"] = difficulty;

    const results = await Recipe.find(query);
    res.status(200).json(results);
  } catch (error) {
    console.error("Error during search:", error.message);
    res
      .status(500)
      .json({ success: false, message: "Failed to fetch recipes" });
  }
});

// 레시피 상세 API
app.get("/recipes/:id", async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);
    if (!recipe) {
      return res.status(404).json({ message: "Recipe not found" });
    }
    res.json(recipe);
  } catch (error) {
    console.error("Error fetching recipe:", error.message);
    res.status(500).json({ message: "Failed to fetch recipe" });
  }
});

// Socket.IO 이벤트 처리

io.on("connection", (socket) => {
  console.log("사용자가 연결되었습니다.");

  socket.on("message", (msg) => {
    console.log("메시지 수신: ", msg);
    io.emit("message", msg); // 모든 클라이언트에 메시지 전달
  });

  socket.on("disconnect", () => {
    console.log("사용자가 연결을 종료했습니다.");
  });
});

// 서버 시작
server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
