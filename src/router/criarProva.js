const express = require('express');
const criarProvaRouter = express.Router();
const criarProvaController = require('../controller/criarProvaController');

criarProvaRouter.get('/', async (req, res, next) => {
    user = await criarProvaController.get(req.headers);
    res.status(200).send(user);
});

criarProvaRouter.post('/', async(req, res, next)=>{
    user=await criarProvaController.criar(req.body);
    res.status(200).send(user);
})

module.exports = criarProvaRouter;