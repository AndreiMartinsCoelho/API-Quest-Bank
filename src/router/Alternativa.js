const express = require('express');
const AlternativasRouter = express.Router();
const AlternativasController = require('../controller/AlternativasController');
const Middleware = require('../middleware/auth');

//----Rota para LISTAR as ALTERNATIVAS----
AlternativasRouter.get('/alternativa/listar', Middleware.verifyToken, AlternativasController.get)

//----Rota para LISTAR as ALTERNATIVAS----
AlternativasRouter.post('/alternativa/adicionar', Middleware.verifyToken, async(req, res, next)=>{
    user=await AlternativasController.criar(req.body);
    res.status(200).send(user);
})

//----Rota para ATUALIZAR as ALTERNATIVAS----
AlternativasRouter.put('/alternativa/atualizar/:id', Middleware.verifyToken, AlternativasController.editar);

//----Rota para DELETAR as ALTERNATIVAS----
AlternativasRouter.delete('/alternativa/deletar/:id', Middleware.verifyToken, AlternativasController.excluir);

//----Rota para OBTER uma ALTERNATIVA pelo ID----
AlternativasRouter.get('/alternativa/listar/:id', Middleware.verifyToken, AlternativasController.obterAlternativa);

module.exports = AlternativasRouter;