import app from "./app.js";
import http from "node:http";
import { connectDb } from "./config/db.js";
import { connectCloudinary } from "./config/cloudinary.js";

const PORT = process.env.PORT || 4000;

const server = http.createServer(app);

connectDb();
connectCloudinary();

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
