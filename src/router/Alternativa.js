const express = require('express');
const AlternativasRouter = express.Router();
const AlternativasController = require('../controller/AlternativasController');

//Função para obter alternativas
AlternativasRouter.get('/', async (req, res, next) => {
    user = await AlternativasController.get(req.headers);
    res.status(200).send(user);
});

//Função para listar alternativas
AlternativasRouter.get('/listarAlternativas', async(req, res, next)=>{
    user=await AlternativasController.listar(req.body);
    res.status(200).send(user);
})

//Função para criar alternativas
AlternativasRouter.post('/', async(req, res, next)=>{
    user=await AlternativasController.criar(req.body);
    res.status(200).send(user);
})

//Função para editar alternativas
AlternativasRouter.put('/:id', AlternativasController.editar);

//Função para excluir alternativas
AlternativasRouter.delete('/:id', AlternativasController.excluir);

//Função para obter uma alternativa específica pelo seu ID
AlternativasRouter.get('/:id', AlternativasController.obterAlternativa);

module.exports = AlternativasRouter;