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

//Função para trocar a senha do usuário
userRouter.post("/user/reset/senha/request", userController.sendVerificationCode);
//Função para trocar a senha do usuário
userRouter.put("/user/reset/senha", userController.updatePassword);

module.exports = userRouter;

