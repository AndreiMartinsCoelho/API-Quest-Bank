const express = require('express');
const ProvaRouter = express.Router();
const ProvaController = require('../controller/ProvaController');

//Função para obter a prova
ProvaRouter.get('/', async (req, res, next) => {
    user = await ProvaController.get(req.headers);
    res.status(200).send(user);
});

//Função para listar a prova
ProvaRouter.get('/listarProva', async(req, res, next)=>{
    user=await ProvaController.listar(req.body);
    res.status(200).send(user);
});

ProvaRouter.post('/', async(req, res, next)=>{
    user=await ProvaController.criar(req.body);
    res.status(200).send(user);
})

module.exports = ProvaRouter;