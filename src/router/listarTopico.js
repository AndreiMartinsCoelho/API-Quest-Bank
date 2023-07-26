const express = require('express');
const listarTopicoRouter = express.Router();
const listarTopicoController = require('../controller/listarTopicoController');

listarTopicoRouter.get('/', async (req, res, next) => {
    user = await listarTopicoController.get(req.headers);
    res.status(200).send(user);
});

listarTopicoRouter.get('/listarTopico', async(req, res, next)=>{
    user=await listarTopicoController.listar(req.body);
    res.status(200).send(user);
})

module.exports = listarTopicoRouter;