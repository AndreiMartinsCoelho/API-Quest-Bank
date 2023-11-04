const express = require('express');
const TopicoRouter = express.Router();
const TopicoController = require('../controller/TopicosController');
const Middleware = require('../middleware/auth');

//----Rota para LISTAR o TOPICO com PROF----
TopicoRouter.get('/topico/listar', Middleware.verifyToken, TopicoController.get);

//----Rota para LISTAR todos os TOPICOS sem PROF----
TopicoRouter.get('/topicos/listar', Middleware.verifyToken, TopicoController.getTodosTopicos);

//----Rota para ADICIONAR um TOPICO----
TopicoRouter.post('/topico/adicionar', /*Middleware.verifyToken,*/ TopicoController.criar);

//----Rota para DELETAR um TOPICO----
TopicoRouter.delete('/topico/deletar/:id', Middleware.verifyToken, TopicoController.excluir);

//----Rota para ATUALIZAR um TOPICO----
TopicoRouter.put('/topico/atualizar/:id', /*Middleware.verifyToken,*/ TopicoController.editar);

//----Rota para LISTAR um TOPICO específico pelo seu ID----
TopicoRouter.get('/topico/listar/:id', Middleware.verifyToken, TopicoController.listaId);

//----Rota para BUSCAR um TOPICO pelo ENUNCIADO----
TopicoRouter.get('/topico/buscar/:enunciado', Middleware.verifyToken,  TopicoController.buscar);

module.exports = TopicoRouter;