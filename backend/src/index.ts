import { Request, Response, NextFunction, Router } from 'express';
import { type link, type storedlinks } from './types';
import fs from 'fs';
import path from 'path';
import cors from 'cors';
import express from 'express';

const port = 3001;
const app = express();
app.use(cors());
app.use(express.json());

const DATA_FILE = 'links.json';

app.post("/api/getUrls", (req : express.Request, res : express.Response) => {
  res.sendFile(DATA_FILE, { root: path.resolve('.') });
  console.log("Sent file:", DATA_FILE);
});

/**
 * Endpoint to get all stored links
 */
app.post("/api/putUrls", (req : express.Request, res : express.Response) => {
  const {name, url} = req.body as link;

  if (!name || !url) {
    return res.status(400).json({error: 'Name and URL are required'});
  }
  const data = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
  if (!data.links) {
    data.links = [];
  }
  const duplicate = data.links.some((link: link) => link.name === name || link.url === url);
  if (duplicate) {
    return res.status(409).json({ error: 'Link with the same name or URL already exists' });
  }else{
    data.links.push({name, url});
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
    res.status(201).json({message: 'Link added successfully'});
    console.log("Added link:", {name, url});
  }
});

app.post("/api/updateLinks", (req : express.Request, res : express.Response) => {
  const {links} = req.body as storedlinks;

  if (!links || !Array.isArray(links)) {
    return res.status(400).json({error: 'Links array is required'});
  }
  const data = { links };
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
  res.status(200).json({message: 'Links updated successfully'});
  console.log("Updated links:", links);
});

app.post("/api/sync", (req : express.Request, res : express.Response) => {
  const data = fs.readFileSync(DATA_FILE, 'utf8');
  const json = JSON.parse(data);
  const storedData = fs.readFileSync("../src/links.json", 'utf8');
  const storedJson = JSON.parse(storedData);
  fs.writeFileSync("../src/links.json", JSON.stringify(json, null, 2));
  fs.writeFileSync(DATA_FILE, JSON.stringify(storedJson, null, 2));
  console.log("Synchronized data between backend and frontend.");
  res.json("Sync successful");
});

app.listen(port, () => {
  console.log(`Backend is running on http://localhost:${port}`)
})
