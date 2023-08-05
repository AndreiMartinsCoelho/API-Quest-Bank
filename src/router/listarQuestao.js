const express = require('express');
const listarQuestaoRouter = express.Router();
const listarQuestaoController = require('../controller/listarQuestaoController');

listarQuestaoRouter.get('/', async (req, res, next) => {
    user = await listarQuestaoController.get(req.headers);
    res.status(200).send(user);
});

listarQuestaoRouter.get('/listarQuestao', async(req, res, next)=>{
    user=await listarQuestaoController.listar(req.body);
    res.status(200).send(user);
})

module.exports = listarQuestaoRouter;