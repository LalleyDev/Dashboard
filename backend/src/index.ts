import { Request, Response} from 'express';
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

  //Do better verification and validation here
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
  }
  data.links.push({name, url});
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
  res.status(201).json({message: 'Link added successfully'});
  console.log("Added link:", {name, url});
});

app.delete("/api/removeLink", (req : express.Request, res : express.Response) => {
  const {name} = req.body as link;
  if (!name) {
    return res.status(400).json({error: 'Name and URL are required'});
  }
  const data = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
  if (!data.links) {
    data.links = [];
  }
  const index = data.links.findIndex((link: link) => link.name === name);
  if (index === -1) {
    return res.status(404).json({ error: 'Link not found' });
  }
  // This is removeing the specific name object from the json file
  data.links.splice(index, 1);
  // This is rewriting the json file with the new data
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
  res.status(200).json({message: 'Link removed successfully'});
  console.log("Removed link:", {name});
});

app.listen(port, () => {
  console.log(`Backend is running on http://localhost:${port}`)
})
