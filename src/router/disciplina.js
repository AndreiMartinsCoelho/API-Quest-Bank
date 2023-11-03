const express = require('express');
const disciplinaRouter = express.Router();
const disciplinaController = require('../controller/disciplinaController');
const Middleware = require('../middleware/auth');

//----ROTA para LISTAR as DISICIPLINAS----
disciplinaRouter.get('/disciplina/listar', Middleware.verifyToken, disciplinaController.listar);

//---ROTA para OBTER uma DISCIPLINA----
disciplinaRouter.get('/disciplina/listar/:id', Middleware.verifyToken, disciplinaController.getById);

module.exports = disciplinaRouter;
