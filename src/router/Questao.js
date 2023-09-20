const express = require('express');
const QuestaoRouter = express.Router();
const QuestaoController = require('../controller/QuestaoController');

//Função para obter a questão
QuestaoRouter.get('/', async (req, res, next) => {
    user = await QuestaoController.get(req.headers);
    res.status(200).send(user);
});

//Função para listar a questão
QuestaoRouter.get('/listarQuestao', async(req, res, next)=>{
    user=await QuestaoController.listar(req.body);
    res.status(200).send(user);
});

//Função para criar a questão
QuestaoRouter.post('/', async(req, res, next)=>{
    user=await QuestaoController.criar(req.body);
    res.status(200).send(user);
})

module.exports = QuestaoRouter;