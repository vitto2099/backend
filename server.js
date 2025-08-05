const express = require('express');
const fs = require('fs');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3000;
const HOST = '0.0.0.0';

app.use(cors());
app.use(express.json());

const DATA_FILE = 'tarefas.json';

function carregarTarefas() {
  if (fs.existsSync(DATA_FILE)) {
    const data = fs.readFileSync(DATA_FILE);
    return JSON.parse(data);
  }
  return [];
}

function salvarTarefas(tarefas) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(tarefas, null, 2));
}

app.get('/', (req, res) => {
  res.send('Backend rodando');
});

app.get('/tarefas', (req, res) => {
  res.json(carregarTarefas());
});

app.post('/tarefas', (req, res) => {
  const tarefas = carregarTarefas();
  const nova = req.body;
  tarefas.push(nova);
  salvarTarefas(tarefas);
  res.status(201).json(nova);
});

app.put('/tarefas/:index', (req, res) => {
  const index = req.params.index;
  const tarefas = carregarTarefas();
  if (index < 0 || index >= tarefas.length) return res.status(404).send("Tarefa não encontrada.");
  tarefas[index] = req.body;
  salvarTarefas(tarefas);
  res.json(tarefas[index]);
});

app.delete('/tarefas/:index', (req, res) => {
  const index = req.params.index;
  const tarefas = carregarTarefas();
  if (index < 0 || index >= tarefas.length) return res.status(404).send("Tarefa não encontrada.");
  tarefas.splice(index, 1);
  salvarTarefas(tarefas);
  res.status(204).send();
});

app.listen(PORT, HOST, () => {
  console.log(`Servidor rodando em http://${HOST}:${PORT}`);
});
