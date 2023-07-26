const express = require('express');
const criarTopicoRouter = express.Router();
const criarTopicoController = require('../controller/criarTopicoController');

criarTopicoRouter.get('/', async (req, res, next) => {
    const result = await criarTopicoController.get();
    res.status(200).send(result);
});

criarTopicoRouter.post('/', async(req, res, next) => {
    const data = req.body;
    const result = await criarTopicoController.criar(data);
    res.status(200).send(result);
});

module.exports = criarTopicoRouter;
