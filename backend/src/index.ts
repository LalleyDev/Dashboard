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

export const createLink = (
  req: Request, 
  res: Response, 
  next: NextFunction
) => {
  try {
    const links = req.body as link; 
    if(!links.name || ! links.url){
      return res.status(400).json({error: 'Name and URL are required'}); 
    }
    const data = fs.readFileSync(DATA_FILE, 'utf8');
    const json = JSON.parse(data);
    if(!json.links){
      json.links = [];
    }
    json.links.push(links);
    fs.writeFileSync(DATA_FILE, JSON.stringify(json, null, 2));
    res.status(201).json({message: 'Link added successfully'});
  } catch (error) {
    next(error);
  }
};

export const updateLink = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {};

export const deleteLink = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {};

app.get("/api/urls", (req : express.Request, res : express.Response) => {
  const data = fs.readFileSync(DATA_FILE, 'utf8');
  res.json(JSON.parse(data));
});

app.post("/api/urls", (req : express.Request, res : express.Response) => {
  const {name, url} = req.body as link;

  if (!name || !url) {
    return res.status(400).json({error: 'Name and URL are required'});
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
