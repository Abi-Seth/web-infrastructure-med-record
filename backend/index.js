const express = require("express");
const axios = require("axios");
const cors = require("cors");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 8080;

app.use(express.static(path.join(__dirname, "../frontend")));

app.get("/api/drug", async (req, res) => {
  const query = req.query.q;
  if (!query) return res.status(400).json({ error: "Missing query param ?q=" });

  try {
    const response = await axios.get(
      `https://api.fda.gov/drug/label.json?search=${query}`
    );
    const results = response.data.results.map((item) => ({
      brand_name: item.openfda.brand_name?.[0] || "N/A",
      generic_name: item.openfda.generic_name?.[0] || "N/A",
      purpose: item.purpose?.[0] || "N/A",
      warnings: item.warnings?.[0] || "N/A",
      dosage: item.dosage_and_administration?.[0] || "N/A",
      side_effects: item.adverse_reactions?.[0] || "N/A",
    }));
    res.json(results);
  } catch (err) {
    res.status(500).json({ error: "Drug not found or API error" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
