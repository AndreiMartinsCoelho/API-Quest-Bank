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

//--------------Rotas de usuário----------------//

//eota para o usuário
const userRoute = require("./router/user");
app.use('/user', userRoute);

//rota para o usuario 2.0
const login = require('./router/user');
app.use('/login', login);

//rota para resetar senha do usuario
const reset = require('./router/user');
app.use('/reset', reset);

//-----------------------Rotas de disciplina-----------------------//

//Rota para listar as disciplinas
const disciplinha = require('./router/disciplina');
app.use('/listaDisciplina', disciplinha);

//-----------------------Rotas de topico-----------------------//

//Rota para listar os tópicos
const listarTopico = require('./router/Topico');
app.use('/listarTopico', listarTopico);

//Rota para criar os tópicos
const criarTopico = require('./router/Topico');
app.use('/criarTopico', criarTopico);

//Rota para exluir os tópicos
const excluirTopico = require('./router/Topico');
app.use('/excluirTopico', excluirTopico);

//Rota para editar os tópicos
const editarTopico = require('./router/Topico');
app.use('/editarTopico', editarTopico);

//Rota para obter um tópico específico pelo seu ID
const listaId = require('./router/Topico');
app.use('/listaId', listaId);

//-----------------------Rotas de alternativa-----------------------//

//Rota para listar as alternativas
const listarAlternativas = require('./router/Alternativa');
app.use('/listarAlternativas', listarAlternativas);

//Rota para criar as alternativas
const criarAlternativas = require('./router/Alternativa');
app.use('/criarAlternativas', criarAlternativas);

//-----------------------Rotas de questão-----------------------//

//Rota para listar as questões
const listarQuestao = require('./router/Questao');
app.use('/listarQuestao', listarQuestao);

//Rota para criar as questões
const criarQuestao = require('./router/Questao');
app.use('/criarQuestao', criarQuestao);

//Rota para editar as questões
const editarQuestao = require('./router/Questao');
app.use('/editarQuestao', editarQuestao);

//Rota para excluir as questões
const excluirQuestao = require('./router/Questao');
app.use('/excluirQuestao', excluirQuestao);

//Rota para obter uma questão específica pelo seu ID
const obterQuestao = require('./router/Questao');
app.use('/obterQuestao', obterQuestao);

//-------------Rotas de prova----------------//

//Rota para listar as provas
const listarProva = require('./router/Prova');
app.use('/listarProva', listarProva);

//Rota para criar as provas
const criarProva = require('./router/Prova');
app.use('/criarProva', criarProva);

//Rota para editar as provas
const editarProva = require('./router/Prova');
app.use('/editarProva', editarProva);

//Rota para excluir as provas
const excluirProva = require('./router/Prova');
app.use('/excluirProva', excluirProva);

//Rota para obter uma prova específica pelo seu ID
const obterProva = require('./router/Prova');
app.use('/obterProva', obterProva);

// const config = require('./config');
// app.use(config);

module.exports = app;