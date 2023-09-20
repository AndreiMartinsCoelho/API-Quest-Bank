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

module.exports = AlternativasRouter;