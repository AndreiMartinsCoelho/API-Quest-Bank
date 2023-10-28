const userModel = require("../model/userModel");
const nodemailer = require('nodemailer');

//Função para obter o usuário
exports.get = async (headers) => {
  let auth;
  auth = await userModel.verifyJWT(
    headers["x-access-token"],
    headers["perfil"]
  );
  let users;
  if (auth.idUser) {
    if (headers.iduser == auth.idUser) {
      users = await userModel.get();
      return users;
    } else {
      return { status: "null", auth };
    }
  } else {
    return { status: "null", auth };
  }
};

//Função para realizar o login do usuário
exports.login = async (body) => {
  const result = await userModel.login(body);
  if (result.auth) {
    return { auth: true, token: result.token, user: result.user };
  } else {
    return { auth: false, message: "Credenciais inválidas" };
  }
};

//Função para trocar a senha do usuário
exports.sendVerificationCode = async (req, res) => {
  const { email } = req.body;
  try {
    const codigo = await userModel.sendVerificationCode(email);
    res.status(200).json({ codigo });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Erro ao enviar código de verificação." });
  }
};

//Função para trocar a senha do usuário
exports.updatePassword = async (req, res) => {
  const { email, novaSenha, confirmSenha, codigo } = req.body;
  try {
    const result = await userModel.updatePassword({ email, novaSenha, confirmSenha, codigo });
    res.status(200).json(result);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Erro ao atualizar senha do usuário." });
  }
};
