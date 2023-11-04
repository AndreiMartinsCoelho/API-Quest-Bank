const express = require('express');
const cors = require('cors');
const app = express();

//--------------CONFIG do CORS e do EXPRESS---//

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

//--------------ROTAS de USERs----------------//

const userRouter = require('./router/user');
app.use(userRouter);

//--------------ROTA ROUTE da API-------------//

const router = require('./router/route');
app.use(router);

//--------------ROTAS de DISCIPLINAS----------//

const routerDisciplina = require('./router/disciplina');
app.use(routerDisciplina);

//--------------ROTAS de TOPICOS--------------//

const routerTopico = require('./router/Topico');
app.use(routerTopico);

//--------------ROTAS de ALTERNATIVAS---------//

const routerAlternativa = require('./router/Alternativa');
app.use(routerAlternativa);

//--------------ROTAS de QUESTÕES-------------//

const routerQuestao = require('./router/Questao');
app.use(routerQuestao);

//--------------ROTAS de PROVAS---------------//

const routerProva = require('./router/Prova');
app.use(routerProva);

//--------------------------------------------//

// const config = require('./config');
// app.use(config);

module.exports = app;