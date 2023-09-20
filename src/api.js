const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const {
    DB_HOST,
    DB_USER,
    DB_USER_PASS,
    DB_DATEBASE,
    DB_PORT
} = require('./config');

//rota principal da API
const router = require('./router/route');
app.use(router);

//eota para o usuário
const userRoute = require("./router/user");
app.use('/user', userRoute);

//rota para o usuario 2.0
const login = require('./router/user');
app.use('/login', login);

//rota para resetar senha do usuario
const reset = require('./router/user');
app.use('/reset', reset);

//Rota para listar as disciplinas
const disciplinha = require('./router/disciplina');
app.use('/listaDisciplina', disciplinha);

//Rota para listar os tópicos
const listarTopico = require('./router/Topico');
app.use('/listarTopico', listarTopico);

//Rota para criar os tópicos
const criarTopico = require('./router/Topico');
app.use('/criarTopico', criarTopico);

//Rota para listar as alternativas
const listarAlternativas = require('./router/Alternativa');
app.use('/listarAlternativas', listarAlternativas);

//Rota para criar as alternativas
const criarAlternativas = require('./router/Alternativa');
app.use('/criarAlternativas', criarAlternativas);

//Rota para listar as questões
const listarQuestao = require('./router/Questao');
app.use('/listarQuestao', listarQuestao);

//Rota para criar as questões
const criarQuestao = require('./router/Questao');
app.use('/criarQuestao', criarQuestao);

//Rota para listar as provas
const listarProva = require('./router/Prova');
app.use('/listarProva', listarProva);

//Rota para criar as provas
const criarProva = require('./router/Prova');
app.use('/criarProva', criarProva);

// const config = require('./config');
// app.use(config);

module.exports = app;