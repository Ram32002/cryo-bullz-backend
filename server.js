const express = require('express');
const fs = require('fs');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const DB_FILE = './db.json';

function loadDB() {
  return JSON.parse(fs.readFileSync(DB_FILE));
}
function saveDB(data) {
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
}

app.get('/players', (req, res) => {
  const db = loadDB();
  res.json(db.players || []);
});

app.post('/players', (req, res) => {
  const db = loadDB();
  const newPlayer = { id: Date.now(), ...req.body, matches: [] };
  db.players.push(newPlayer);
  saveDB(db);
  res.status(201).json(newPlayer);
});

app.delete('/players/:id', (req, res) => {
  const db = loadDB();
  db.players = db.players.filter(p => p.id != req.params.id);
  saveDB(db);
  res.status(204).end();
});

app.post('/players/:id/matches', (req, res) => {
  const db = loadDB();
  const player = db.players.find(p => p.id == req.params.id);
  if (!player) return res.status(404).send('Player not found');
  player.matches.push({ id: Date.now(), ...req.body });
  saveDB(db);
  res.status(201).json(player);
});

app.delete('/players/:id/matches/:matchId', (req, res) => {
  const db = loadDB();
  const player = db.players.find(p => p.id == req.params.id);
  if (!player) return res.status(404).send('Player not found');
  player.matches = player.matches.filter(m => m.id != req.params.matchId);
  saveDB(db);
  res.status(204).end();
});

app.listen(PORT, () => {
  console.log(`Cryo Bullz server running on http://localhost:${PORT}`);
});