const express = require('express');
const AlternativasRouter = express.Router();
const AlternativasController = require('../controller/AlternativasController');

//Função para obter alternativas
AlternativasRouter.get('/', async (req, res, next) => {
    user = await AlternativasController.get(req.headers);
    res.status(200).send(user);
});

//Função para listar alternativas
AlternativasRouter.get('/alternativa/listar', async(req, res, next)=>{
    user=await AlternativasController.listar(req.body);
    res.status(200).send(user);
})

//Função para criar alternativas
AlternativasRouter.post('/alternativa/adicionar', async(req, res, next)=>{
    user=await AlternativasController.criar(req.body);
    res.status(200).send(user);
})

//Função para editar alternativas
AlternativasRouter.put('/alternativa/atualizar/:id', AlternativasController.editar);

//Função para excluir alternativas
AlternativasRouter.delete('/alternativa/deletar/:id', AlternativasController.excluir);

//Função para obter uma alternativa específica pelo seu ID
AlternativasRouter.get('/alternativa/listar/:id', AlternativasController.obterAlternativa);

module.exports = AlternativasRouter;