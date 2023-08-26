const express = require('express');
const criarQuestaoRouter = express.Router();
const criarQuestaoController = require('../controller/criarQuestaoController');

criarQuestaoRouter.get('/', async (req, res, next) => {
    user = await criarQuestaoController.get(req.headers);
    res.status(200).send(user);
});

criarQuestaoRouter.post('/', async(req, res, next)=>{
    user=await criarQuestaoController.criar(req.body);
    res.status(200).send(user);
})

module.exports = criarQuestaoRouter;