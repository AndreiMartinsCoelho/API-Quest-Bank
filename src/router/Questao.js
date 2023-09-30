const express = require('express');
const QuestaoRouter = express.Router();
const QuestaoController = require('../controller/QuestaoController');

//Função para obter a questão
QuestaoRouter.get('/', async (req, res, next) => {
    user = await QuestaoController.get(req.headers);
    res.status(200).send(user);
});

//Função para listar a questão
QuestaoRouter.get('/questao/listar', async(req, res, next)=>{
    user = await QuestaoController.listar(req.body);
    res.status(200).send(user);
});

//Função para criar a questão
QuestaoRouter.post('/questao/adicionar', async(req, res, next)=>{
    user=await QuestaoController.criar(req.body);
    res.status(200).send(user);
});

//Função para editar a questão
QuestaoRouter.put('/questao/atualizar/:id', QuestaoController.editar);

//Função para excluir a questão
QuestaoRouter.delete('/questao/deletar/:id', QuestaoController.excluir);

//Função para obter uma questão específica pelo seu ID
QuestaoRouter.get('/questao/listar/:id', QuestaoController.obterQuestao);

module.exports = QuestaoRouter;