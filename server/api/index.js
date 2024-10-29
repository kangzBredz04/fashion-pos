import express from "express";
import "dotenv/config";
import cookieParser from "cookie-parser";
import cors from "cors";

import AuthRoute from "./routes/auth-routes.js";
import ProductRoute from "./routes/product-route.js";

const app = express();

app.use(
  cors({
    origin: ["http://localhost:5173", "https://sahaba-fashion.vercel.app"],
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());

app.get("/", (req, res) => {
  res.send("Server is running!");
});

app.use("/api/auth", AuthRoute);
app.use("/api/product", ProductRoute);

const PORT = process.env.API_PORT || 3001;
app.listen(PORT, () => console.log(`Server berjalan pada port ${PORT}`));
