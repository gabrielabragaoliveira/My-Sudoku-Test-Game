// Servidor Node.js/Express

const express = require('express');
const path = require('path');
const app = express();
const PORT = 3000;

// Serve todos os arquivos estáticos (HTML, CSS, JS, etc.) da pasta raiz do projeto
app.use(express.static(path.join(__dirname)));

// Rota principal para servir o novo menu (PrincipalMenu.html)
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'PrincipalMenu.html'));
});

// Endpoint de teste (Opcional)
app.get('/api/status', (req, res) => {
    res.json({ status: "ok", message: "Servidor de Jogos Online Ativo" });
});

app.listen(PORT, () => {
    console.log(`Servidor de Jogos rodando em http://localhost:${PORT}`);
    console.log(`Pressione CTRL+C para parar.`);
});