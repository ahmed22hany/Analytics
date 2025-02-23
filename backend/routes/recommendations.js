const express = require("express");
const router = express.Router();
const { getRecommendations } = require("../services/aiService");

router.get("/", async (req, res) => {
  try {
    const recommendations = await getRecommendations();
    res.json({ recommendations });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
