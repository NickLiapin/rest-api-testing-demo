const express = require('express');

/**
 * A small in-memory mock REST service that stands in for the system under test.
 * Bundling it keeps the test suite hermetic - it runs identically on any machine
 * and in CI without depending on an external environment.
 */
const app = express();
app.use(express.json());

const TOKEN = 'demo-token-123';
let users = [
  { id: 1, name: 'Ada Lovelace', email: 'ada@example.com' },
  { id: 2, name: 'Alan Turing', email: 'alan@example.com' },
];
let nextId = 3;

const isEmail = (s) =>
  typeof s === 'string' && /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(s);

function auth(req, res, next) {
  if (req.headers.authorization !== `Bearer ${TOKEN}`) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  return next();
}

app.get('/health', (req, res) => res.json({ status: 'ok' }));

app.post('/api/login', (req, res) => {
  const { username, password } = req.body || {};
  if (username === 'admin' && password === 'secret') {
    return res.json({ token: TOKEN });
  }
  return res.status(401).json({ error: 'Invalid credentials' });
});

app.get('/api/users', (req, res) => res.json(users));

app.get('/api/users/:id', (req, res) => {
  const user = users.find((u) => u.id === Number(req.params.id));
  if (!user) return res.status(404).json({ error: 'Not found' });
  return res.json(user);
});

app.post('/api/users', auth, (req, res) => {
  const { name, email } = req.body || {};
  if (!name || !isEmail(email)) {
    return res.status(400).json({ error: 'Invalid payload' });
  }
  const user = { id: nextId, name, email };
  nextId += 1;
  users.push(user);
  return res.status(201).json(user);
});

app.put('/api/users/:id', auth, (req, res) => {
  const user = users.find((u) => u.id === Number(req.params.id));
  if (!user) return res.status(404).json({ error: 'Not found' });
  const { name, email } = req.body || {};
  if (email !== undefined && !isEmail(email)) {
    return res.status(400).json({ error: 'Invalid payload' });
  }
  if (name !== undefined) user.name = name;
  if (email !== undefined) user.email = email;
  return res.json(user);
});

app.delete('/api/users/:id', auth, (req, res) => {
  const idx = users.findIndex((u) => u.id === Number(req.params.id));
  if (idx === -1) return res.status(404).json({ error: 'Not found' });
  users.splice(idx, 1);
  return res.status(204).send();
});

const PORT = process.env.PORT || 4000;
if (require.main === module) {
  app.listen(PORT, () => {
    // eslint-disable-next-line no-console
    console.log(`Mock API listening on http://localhost:${PORT}`);
  });
}

module.exports = app;
