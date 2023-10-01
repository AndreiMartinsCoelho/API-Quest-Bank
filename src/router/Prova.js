const express = require('express');
const ProvaRouter = express.Router();
const ProvaController = require('../controller/ProvaController');

//Função para obter a prova
ProvaRouter.get('/', async (req, res, next) => {
    user = await ProvaController.get(req.headers);
    res.status(200).send(user);
});

//Função para listar a prova
ProvaRouter.get('/prova/listar', async(req, res, next)=>{
    user=await ProvaController.listar(req.body);
    res.status(200).send(user);
});

//Função para criar a prova
ProvaRouter.post('/prova/adicionar', async(req, res, next)=>{
    user=await ProvaController.criar(req.body);
    res.status(200).send(user);
})

//Função para editar a prova
ProvaRouter.put('/prova/atualizar/:id', ProvaController.editar);

//Função para excluir a prova
ProvaRouter.delete('/prova/deletar/:id', ProvaController.excluir);

//Função para obter uma prova específica pelo seu ID
ProvaRouter.get('/prova/listar/:id', ProvaController.obterProva);

//Função para obter uma prova específica pelo enunciado
ProvaRouter.get('/prova/buscar/:enunciado', ProvaController.buscarProvaPorEnunciado);

module.exports = ProvaRouter;