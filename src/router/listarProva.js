const express = require('express');
const listarProvaRouter = express.Router();
const listarProvaController = require('../controller/listarProvaController');

listarProvaRouter.get('/', async (req, res, next) => {
    user = await listarProvaController.get(req.headers);
    res.status(200).send(user);
});

listarProvaRouter.get('/listarProva', async(req, res, next)=>{
    user=await listarProvaController.listar(req.body);
    res.status(200).send(user);
})

module.exports = listarProvaRouter;