const express = require("express");
const fs = require("fs");
const cors = require("cors");
const { exec } = require("child_process");

const app = express();
app.use(cors());
app.use(express.json());

// Read spending summary
app.get("/spending-summary", (req, res) => {
    try {
        const data = fs.readFileSync("./spending_summary.csv", "utf8");
        const lines = data.trim().split("\n").map(line => line.split(","));
        
        if (lines.length <= 1) {
            return res.json([]);
        }
        
        const summary = lines.slice(1).map(([category, total]) => ({
            category,
            total: parseFloat(total)
        }));
        
        res.json(summary);
    } catch (error) {
        res.status(500).json({ error: "Error reading spending summary", details: error.message });
    }
});

// API for AI-powered financial insights
app.post("/ask-ai", (req, res) => {
    const { question } = req.body;
    
    if (!question) {
        return res.status(400).json({ error: "Question is required" });
    }

    exec(`python3 csv_handler.py "${question}"`, (error, stdout, stderr) => {
        if (error) {
            return res.status(500).json({ error: "AI Processing Error", details: stderr.trim() });
        }
        res.json({ answer: stdout.trim() });
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`✅ Backend running on port ${PORT}`));
