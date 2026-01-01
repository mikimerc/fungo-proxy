import express from "express";
import multer from "multer";
import fetch from "node-fetch";
import cors from "cors";

const app = express();
const upload = multer();
const PORT = process.env.PORT || 3000;

const API_URL = "https://api.kindwise.com/v1/identify/mushroom";
const API_KEY = "LA_TUA_API_KEY"; // <-- metti qui la tua API key Kindwise

app.use(cors());

app.post("/proxy", upload.single("foto"), async (req, res) => {
    try {
        if (!req.file) {
            return res.json({ error: "Nessuna immagine ricevuta" });
        }

        const imgBase64 = req.file.buffer.toString("base64");

        const payload = {
            images: [imgBase64],
            include_details: true
        };

        const response = await fetch(API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Api-Key": API_KEY
            },
            body: JSON.stringify(payload)
        });

        const data = await response.json();
        res.json(data);

    } catch (err) {
        res.json({ error: err.message });
    }
});

app.get("/", (req, res) => {
    res.send("Proxy Node.js attivo");
});

app.listen(PORT, () => {
    console.log("Server avviato su porta " + PORT);
});
