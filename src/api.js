const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const {
    BASE_URL,
    DB_HOST,
    DB_USER,
    DB_USER_PASS,
    DB_DATEBASE
} = require('./config');

const router = require('./router/route');
app.use(router);

const userRoute = require("./router/user");
app.use('/user', userRoute);

const login = require('./router/user');
app.use('/login', login);

const reset = require('./router/resetSenha');
app.use('/reset', reset);

const disciplinha = require('./router/disciplina');
app.use('/listaDisciplina', disciplinha);

const listarTopico = require('./router/listarTopico');
app.use('/listarTopico', listarTopico);

const criarTopico = require('./router/criarTopico');
app.use('/criarTopico', criarTopico);

const listarAlternativas = require('./router/listarAlternativas');
app.use('/listarAlternativas', listarAlternativas);

const criarAlternativas = require('./router/criarAlternativas');
app.use('/criarAlternativas', criarAlternativas);

module.exports = app;