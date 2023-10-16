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

exports.headers(async () =>{
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'Access-Control-Allow-Origin', value: '*' },
          { key: 'Access-Control-Allow-Methods', value: 'GET, POST, OPTIONS, PUT, PATCH, DELETE' },
          { key: 'Access-Control-Allow-Headers', value: 'X-Requested-With,content-type' },
          { key: 'Access-Control-Allow-Credentials', value: true },
          { key: 'x-access-token', value: 'true'},
          { key: 'perfil', value: 'admin', value: 'professor'}
        ],
      },
    ];
})

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

//Rota para as disciplinas
const routerDisciplina = require('./router/disciplina');
app.use(routerDisciplina);

//-----------------------Rotas de topico-----------------------//

const routerTopico = require('./router/Topico');
app.use(routerTopico);

//-----------------------Rotas de alternativa-----------------------//

//Rota para listar as alternativas
const listarAlternativas = require('./router/Alternativa');
app.use('/alternativa/listar', listarAlternativas);

//Rota para as alternativas
const routerAlternativa = require('./router/Alternativa');
app.use(routerAlternativa);

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
app.use('/prova/listar', listarProva);

//Rota para as provas
const routerProva = require('./router/Prova');
app.use(routerProva);

// const config = require('./config');
// app.use(config);

module.exports = app;