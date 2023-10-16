const express = require('express');
const ProvaRouter = express.Router();
const ProvaController = require('../controller/ProvaController');
const Middleware = require('../middleware/auth');

//Função para obter a prova
ProvaRouter.get('/', Middleware.verifyToken, async (req, res, next) => {
    user = await ProvaController.get(req.headers);
    res.status(200).send(user);
});

//Função para listar a prova
ProvaRouter.get('/prova/listar', Middleware.verifyToken, async(req, res, next)=>{
    user=await ProvaController.listar(req.body);
    res.status(200).send(user);
});

//Função para criar a prova
ProvaRouter.post('/prova/adicionar', Middleware.verifyToken, async(req, res, next)=>{
    user=await ProvaController.criar(req.body);
    res.status(200).send(user);
})

//Função para editar a prova
ProvaRouter.put('/prova/atualizar/:id', Middleware.verifyToken, ProvaController.editar);

//Função para excluir a prova
ProvaRouter.delete('/prova/deletar/:id', Middleware.verifyToken, ProvaController.excluir);

//Função para obter uma prova específica pelo seu ID
ProvaRouter.get('/prova/listar/:id', Middleware.verifyToken, ProvaController.obterProva);

//Função para obter uma prova específica pelo enunciado
ProvaRouter.get('/prova/buscar/:enunciado', Middleware.verifyToken, ProvaController.buscarProvaPorEnunciado);

//Função para gerar a prova em PDF
ProvaRouter.get('/prova/download/:id', ProvaController.gerarProva);

module.exports = ProvaRouter;