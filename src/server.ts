import dotenv from 'dotenv';
import app from "./app";

dotenv.config();

const PORT: number = Number(process.env.PORT) || 5009;

app.listen(PORT, () => console.log(`Server listening on port: ${PORT}`));