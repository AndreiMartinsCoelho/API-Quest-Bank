const express = require('express');
const QuestaoRouter = express.Router();
const QuestaoController = require('../controller/QuestaoController');
const Middleware = require('../middleware/auth');

//----ROTA para LISTAR as QUESTÕES pelo PROFESSOR----
QuestaoRouter.get('/questao/listar', Middleware.verifyToken, QuestaoController.get);

//----ROTA para LISTAR as QUESTÕES sem PROFESSOR----
QuestaoRouter.get('/questoes/listar', Middleware.verifyToken, QuestaoController.getQuestoes);

//----ROTA para ADICIONAR a QUESTÃO----
QuestaoRouter.post('/questao/adicionar', Middleware.verifyToken, QuestaoController.criar);

//----ROTA para ATUALIZAR a QUESTÃO----
QuestaoRouter.put('/questao/atualizar/:id', Middleware.verifyToken, QuestaoController.editar);

//----ROTA para DELETAR a QUESTÃO----
QuestaoRouter.delete('/questao/deletar/:id', Middleware.verifyToken, QuestaoController.excluir);

//----ROTA para LISTAR uma QUESTÃO específica pelo seu ID----
QuestaoRouter.get('/questao/listar/:id', Middleware.verifyToken, QuestaoController.obterQuestao);

//----ROTA para OBTER QUESTÕES específicaS pelo ENUNCIADO----
QuestaoRouter.get('/questao/buscar/:enunciado', Middleware.verifyToken, QuestaoController.buscarQuestoesPorEnunciado);

module.exports = QuestaoRouter;