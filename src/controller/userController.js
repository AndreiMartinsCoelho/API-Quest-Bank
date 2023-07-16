const userModel = require("../model/userModel");

exports.get = async (headers) => {
  let auth;
  auth = await userModel.verifyJWT(headers['x-access-token'], headers['perfil']);
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

exports.login = async (body) => {
  const result = await userModel.login(body);
  if (result.auth) {
    return { auth: true, token: result.token, user: result.user };
  } else {
    return { auth: false, message: 'Credenciais inválidas' };
  }
};

