const express = require('express');
const TopicoRouter = express.Router();
const TopicoController = require('../controller/TopicosController');
const Middleware = require('../middleware/auth');

//Rota para listar o tópico
TopicoRouter.get('/topico/listar', Middleware.verifyToken, async(req, res, next)=>{
    const { idProfessor } = req.query;
    const user = await TopicoController.get(req.body, { idProfessor });
    res.status(200).send(user);
});

//Rota para criar o tópico
TopicoRouter.post('/topico/adicionar', Middleware.verifyToken, async(req, res, next) => {
    const data = req.body;
    const result = await TopicoController.criar(data);
    res.status(200).send(result);
});

//Rota para excluir o tópico
TopicoRouter.delete('/topico/deletar/:id', TopicoController.excluir,Middleware.verifyToken);

//Rota para atualizar o tópico
TopicoRouter.put('/topico/atualizar/:id', TopicoController.editar,Middleware.verifyToken);

//Rota para obter um tópico específico pelo seu ID
TopicoRouter.get('/topico/listar/:id', TopicoController.listaId,Middleware.verifyToken);

//Rota para buscar um tópico pelo enunciado
TopicoRouter.get('/topico/buscar/:enunciado', TopicoController.buscar,Middleware.verifyToken);

module.exports = TopicoRouter;