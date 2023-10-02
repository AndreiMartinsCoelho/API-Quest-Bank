const express = require('express');
const AlternativasRouter = express.Router();
const AlternativasController = require('../controller/AlternativasController');
const Middleware = require('../middleware/auth');

//Função para obter alternativas
AlternativasRouter.get('/', Middleware.verifyToken, async (req, res, next) => {
    user = await AlternativasController.get(req.headers);
    res.status(200).send(user);
});

//Função para listar alternativas
AlternativasRouter.get('/alternativa/listar', Middleware.verifyToken, async(req, res, next)=>{
    user=await AlternativasController.listar(req.body);
    res.status(200).send(user);
})

//Função para criar alternativas
AlternativasRouter.post('/alternativa/adicionar', Middleware.verifyToken, async(req, res, next)=>{
    user=await AlternativasController.criar(req.body);
    res.status(200).send(user);
})

//Função para editar alternativas
AlternativasRouter.put('/alternativa/atualizar/:id', Middleware.verifyToken, AlternativasController.editar);

//Função para excluir alternativas
AlternativasRouter.delete('/alternativa/deletar/:id', Middleware.verifyToken, AlternativasController.excluir);

//Função para obter uma alternativa específica pelo seu ID
AlternativasRouter.get('/alternativa/listar/:id', Middleware.verifyToken, AlternativasController.obterAlternativa);

module.exports = AlternativasRouter;