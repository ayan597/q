const express = require("express");
const fetch = require("node-fetch");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(express.json());
app.use(cors());

app.post("/generate-logo", async (req, res) => {
  const { logoType } = req.body;

  try {
    const response = await fetch(
      "https://api.openai.com/v1/images/generations",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: "dall-e-2",
          prompt: `A professional ${logoType} logo with a modern and sleek design, high resolution`,
          n: 1,
          size: "1024x1024",
        }),
      }
    );

    const data = await response.json();
    res.json({ logoUrl: data.data[0].url });
  } catch (error) {
    res.status(500).json({ error: "Failed to generate logo" });
  }
});

app.listen(3000, () => console.log("Server running on port 3000"));
document
  .getElementById("submitLogoRequest")
  .addEventListener("click", function () {
    let logoType = document.getElementById("logoType").value;
    let logoPreview = document.getElementById("logoPreview");
    let logoImg = document.getElementById("generatedLogo");

    if (logoType) {
      fetch("http://localhost:3000/generate-logo", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ logoType }),
      })
        .then((response) => response.json())
        .then((data) => {
          logoImg.src = data.logoUrl;
          logoPreview.style.display = "block";
        })
        .catch((error) => {
          console.error("Error generating logo:", error);
          alert("Failed to generate logo. Try again.");
        });
    } else {
      alert("Please enter a logo type.");
    }
  });
