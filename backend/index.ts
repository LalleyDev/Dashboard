import express from "express";
import fs from "fs";
import path from "path";
import cors from "cors";

const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());

const DATA_FILE = 'links.json';

app.get("/api/urls", (req, res) => {
  const data = fs.readFileSync(DATA_FILE, 'utf8');
  res.json(JSON.parse(data));
});

app.post("/api/urls", (req, res) => {
  const {name, url} = req.body;
  if (!name || !url) {
    return res.status(400).json({error: 'Name and URL are required'});
  }
  if (!url.startsWith('http')) {
    return res.status(400).json({error: 'Invalid URL'});
  }
  const data = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
  if (!data.links) {
    data.links = [];
  }
  data.links.push({name, url});
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
  res.status(201).json({message: 'Link added successfully'});
});

app.listen(port, () => {
  console.log(`Backend is running on http://localhost:${port}`)
})
