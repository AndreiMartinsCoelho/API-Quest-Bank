const express = require('express');
const disciplinaRouter = express.Router();
const disciplinaController = require('../controller/disciplinaController');
const Middleware = require('../middleware/auth');

//Função para obter disciplinas
disciplinaRouter.get('/', Middleware.verifyToken, async (req, res, next) => {
    user = await disciplinaController.get(req.headers);
    res.status(200).send(user);
});

//Função para listar disciplinas
disciplinaRouter.get('/disciplina/listar',Middleware.verifyToken, async(req, res, next)=>{
    user = await disciplinaController.listar(req.body);
    res.status(200).send(user);
})

//Função para obter disciplina por id
disciplinaRouter.get('/disciplina/listar/:id', Middleware.verifyToken, async(req, res, next)=>{
    user = await disciplinaController.getById(req.params);
    res.status(200).send(user);
})

module.exports = disciplinaRouter;
