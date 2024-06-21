// src/index.ts

import 'reflect-metadata';
import express from 'express';
import { AppDataSource } from './database';
import { Item } from './entity/item.entity';

const app = express();
const port = 3000;

app.use(express.json());

// GET 모든 아이템 조회
app.get('/items', async (req, res) => {
  const items = await AppDataSource.getRepository(Item).find();
  res.json(items);
});

// GET 특정 아이템 조회
app.get('/items/:id', async (req, res) => {
  const id = parseInt(req.params.id);
  const item = await AppDataSource.getRepository(Item).findOneBy({ id });
  if (!item) {
    return res.status(404).send('Item not found');
  }
  res.json(item);
});

// POST 새로운 아이템 추가
app.post('/items', async (req, res) => {
  const { name, description } = req.body;
  if (!name || !description) {
    return res.status(400).send('Name and description are required');
  }
  const item = new Item();
  item.name = name;
  item.description = description;
  await AppDataSource.getRepository(Item).save(item);
  res.status(201).json(item);
});

// PUT 아이템 업데이트
app.put('/items/:id', async (req, res) => {
  const id = parseInt(req.params.id);
  const { name, description } = req.body;
  const item = await AppDataSource.getRepository(Item).findOneBy({ id });
  if (!item) {
    return res.status(404).send('Item not found');
  }
  item.name = name;
  item.description = description;
  await AppDataSource.getRepository(Item).save(item);
  res.json(item);
});

// DELETE 아이템 삭제
app.delete('/items/:id', async (req, res) => {
  const id = parseInt(req.params.id);
  const result = await AppDataSource.getRepository(Item).delete(id);
  if (result.affected === 0) {
    return res.status(404).send('Item not found');
  }
  res.status(204).send();
});

// 서버 실행
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
