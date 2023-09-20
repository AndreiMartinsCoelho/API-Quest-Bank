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

//Função para criar a prova
ProvaRouter.post('/', async(req, res, next)=>{
    user=await ProvaController.criar(req.body);
    res.status(200).send(user);
})

//Função para editar a prova
ProvaRouter.put('/:id', ProvaController.editar);

//Função para excluir a prova
ProvaRouter.delete('/:id', ProvaController.excluir);

//Função para obter uma prova específica pelo seu ID
ProvaRouter.get('/:id', ProvaController.obterProva);

module.exports = ProvaRouter;