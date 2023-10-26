const express = require('express');
const QuestaoRouter = express.Router();
const QuestaoController = require('../controller/QuestaoController');
const Middleware = require('../middleware/auth');

//Função para obter as questões
QuestaoRouter.get('/questao/listar', Middleware.verifyToken, QuestaoController.get);

//Função para obter as questões
QuestaoRouter.get('/questoes/listar', Middleware.verifyToken, QuestaoController.getQuestoes);

//Função para criar a questão
QuestaoRouter.post('/questao/adicionar', Middleware.verifyToken, async(req, res, next)=>{
    user=await QuestaoController.criar(req.body);
    res.status(200).send(user);
});

//Função para editar a questão
QuestaoRouter.put('/questao/atualizar/:id', Middleware.verifyToken, QuestaoController.editar);

//Função para excluir a questão
QuestaoRouter.delete('/questao/deletar/:id', Middleware.verifyToken, QuestaoController.excluir);

//Função para obter uma questão específica pelo seu ID
QuestaoRouter.get('/questao/listar/:id', Middleware.verifyToken, QuestaoController.obterQuestao);

//Função para obter uma questão específica pelo enunciado
QuestaoRouter.get('/questao/buscar/:enunciado', Middleware.verifyToken, QuestaoController.buscarQuestoesPorEnunciado);

module.exports = QuestaoRouter;