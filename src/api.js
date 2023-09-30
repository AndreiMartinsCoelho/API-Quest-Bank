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


//--------------Rotas principais----------------//
const userRouter = require('./router/user');
app.use(userRouter);

//rota principal da API
const router = require('./router/route');
app.use(router);

//--------------Rotas de usuário----------------//

//Rota para o usuário
const userRoute = require("./router/user");
app.use('/user', userRoute);

//Rota para o login do usuário
const login = require('./router/user');
app.use('/login', login);

//-----------------------Rotas de disciplina-----------------------//

//Rota para listar as disciplinas
const disciplinha = require('./router/disciplina');
app.use('/disciplina/listar', disciplinha);

//-----------------------Rotas de topico-----------------------//

const routerTopico = require('./router/Topico');
app.use(routerTopico);

//-----------------------Rotas de alternativa-----------------------//

//Rota para listar as alternativas
const listarAlternativas = require('./router/Alternativa');
app.use('/listarAlternativas', listarAlternativas);

//Rota para criar as alternativas
const criarAlternativas = require('./router/Alternativa');
app.use('/criarAlternativas', criarAlternativas);

//Rota para editar as alternativas
const editarAlternativas = require('./router/Alternativa');
app.use('/editarAlternativas', editarAlternativas);

//Rota para excluir as alternativas
const excluirAlternativas = require('./router/Alternativa');
app.use('/excluirAlternativas', excluirAlternativas);

//Rota para obter uma alternativa específica pelo seu ID
const obterAlternativa = require('./router/Alternativa');
app.use('/verAlternativa', obterAlternativa);

//-----------------------Rotas de questão-----------------------//

//Rota para listar as questões
const listarQuestao = require('./router/Questao');
app.use('/questao/listar', listarQuestao);

//Rota para as questões
const routerQuestao = require('./router/Questao');
app.use(routerQuestao);

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