const userModel = require("../model/userModel");

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
exports.changePassword = async (data) => {
  const result = await userModel.changePassword(data);
  if (result.auth) {
    return {
      success: true,
      message: "Senha alterada com sucesso!",
      user: {
        id: result.user.id,
        nome: result.user.nome,
        email: result.user.email,
      },
    };
  } else {
    return {
      success: false,
      message:
        "Não foi possível alterar a senha. Verifique as credenciais fornecidas.",
      error: result.message,
    };
  }
};
