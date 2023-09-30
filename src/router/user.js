const express = require('express');
const userRouter = express.Router();
const userController = require('../controller/userController');

//Função para obter o usuário e fazer o login
userRouter.post('/', async (req, res, next) => {
    user = await userController.get(req.headers);
    res.status(200).send(user);
});
userRouter.post('/login', async(req, res, next)=>{
    user=await userController.login(req.body);
    res.status(200).send(user);
})

//Funçãp para trocar a senha do usuário
userRouter.put("/user/esqueceuSenha", async (req, res, next) => {
    const result = await userController.changePassword(req.body);
    res.status(200).send(result);
});

module.exports = userRouter;

