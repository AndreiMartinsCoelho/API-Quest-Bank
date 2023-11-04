const express = require('express');
const ProvaRouter = express.Router();
const ProvaController = require('../controller/ProvaController');
const Middleware = require('../middleware/auth');

//----ROTA para LISTAR as PROVAs por PROFESSOR----
ProvaRouter.get('/prova/listar', Middleware.verifyToken, ProvaController.listar);

//----ROTA para LISTAR as PROVAs sem PROFESSOR----
ProvaRouter.get('/provas/listar', Middleware.verifyToken, ProvaController.listarProvas);

//----ROTA para ADICIONAR a PROVA----
ProvaRouter.post('/prova/adicionar', Middleware.verifyToken, ProvaController.criar);

//----ROTA para ATUALIZAR a PROVA----
ProvaRouter.put('/prova/atualizar/:id', Middleware.verifyToken, ProvaController.editar);

//----ROTA para DELETAR a PROVA----
ProvaRouter.delete('/prova/deletar/:id', Middleware.verifyToken, ProvaController.excluir);

//----ROTA para OBTER uma PROVA pelo seu ID----
ProvaRouter.get('/prova/listar/:id', Middleware.verifyToken, ProvaController.obterProva);

//----ROTA para OBTER uma PROVA pelo ENUNCIADO----
ProvaRouter.get('/prova/buscar/:enunciado', Middleware.verifyToken, ProvaController.buscarProvaPorEnunciado);

//----ROTA para GERAR um PDF----
ProvaRouter.get('/prova/download/:id', /*Middleware.verifyToken,*/ ProvaController.gerarProva);

module.exports = ProvaRouter;