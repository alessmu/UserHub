// backend/server.js
import dotenv from "dotenv";
dotenv.config();

import app from "./app.js";
import routeurMotDePasse from "./routes/routeMotDePasse.js";

app.use("/motdepasse", routeurMotDePasse);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Serveur Express a démarré sur http://localhost:${PORT}`);
});
