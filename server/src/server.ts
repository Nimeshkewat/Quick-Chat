import app from "./app.js";
import { connectDb } from "./config/db.js";
import { connectCloudinary } from "./config/cloudinary.js";

const PORT = process.env.PORT || 4000;

connectDb();
connectCloudinary();

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
