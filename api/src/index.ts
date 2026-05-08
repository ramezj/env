import "dotenv/config";
import express from "express";
import cors from "cors";
import authRouter from "./routes/auth.router";
import meRouter from "./routes/me.router";
import teamsRouter from "./routes/teams.router";

const app = express();

app.use(
  cors({
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    credentials: true,
  }),
);

// Better Auth must come before express.json() — it reads the raw body itself
app.use("/api/auth", authRouter);

app.use(express.json());

app.use("/api/me", meRouter);
app.use("/api/teams", teamsRouter);

app.listen(process.env.PORT, () => {
  console.log(`Server is running on http://localhost:${process.env.PORT}`);
});
