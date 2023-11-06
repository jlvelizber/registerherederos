import dontenv from "dotenv";
import app from "./app";

dontenv.config();

const PORT = process.env.PORT || 3000;


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
