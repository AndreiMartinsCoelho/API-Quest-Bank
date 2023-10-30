const jwt = require("jsonwebtoken");
require("dotenv").config();
const connection = require("./mysqlConnect").query();
const nodemailer = require("nodemailer");

// Função para buscar todos os usuários
const get = async () => {
  return new Promise((resolve, reject) => {
    connection.query(
      "SELECT *, (SELECT nome FROM pessoa WHERE id=u.pessoa_id_pessoa) as nome FROM usuario u",
      (error, results) => {
        if (error) {
          reject(error);
        } else {
          resolve(results);
        }
      }
    );
  });
};

// Função para fazer login
const login = async (data) => {
  const bcrypt = require("bcrypt");
  const { email, senha } = data;

  return new Promise((resolve, reject) => {
    const sql =
      `SELECT p.id_pessoa as id, p.nome, p.email, ` +
      `(SELECT COUNT(pessoa_id_pessoa) FROM professor WHERE pessoa_id_pessoa=p.id_pessoa) as professor, ` +
      `(SELECT COUNT(pessoa_id_pessoa) FROM administrador WHERE pessoa_id_pessoa=p.id_pessoa) as admin, ` +
      `u.senha ` +
      `FROM usuario u ` +
      `JOIN pessoa p ON p.id_pessoa=u.pessoa_id_pessoa ` +
      `WHERE p.email = ?`;
    connection.query(sql, [email], async (error, results) => {
      if (error) {
        reject(error);
      } else {
        if (results && results.length > 0) {
          const id = results[0].id;
          const password = results[0].senha;
          //console.log(password);
          if (password) {
            bcrypt.compare(senha, password, async (err, res) => {
              if (err) {
                reject(err);
              } else if (res) {
                const payload = { id };
                const secret = process.env.JWT_SECRET;
                const options = { expiresIn: "28800000" };
                const token = jwt.sign(payload, secret, options);

                const perfil = [];
                if (results[0].professor > 0) {
                  perfil.push("professor");
                }
                if (results[0].admin > 0) {
                  perfil.push("admin");
                }

                const result = {
                  auth: true,
                  token,
                  user: {
                    id: results[0].id,
                    nome: results[0].nome,
                    email: results[0].email,
                    professor: results[0].professor,
                    admin: results[0].admin,
                    perfil: perfil,
                  },
                };
                resolve(result);
              } else {
                const result = {
                  auth: false,
                  message: "Credenciais inválidas",
                };
                resolve(result);
              }
            });
          } else {
            const result = { auth: false, message: "Credenciais inválidas" };
            resolve(result);
          }
        } else {
          const result = { auth: false, message: "Credenciais inválidas" };
          resolve(result);
        }
      }
    });
  });
};

// Função para verificar a validade do token JWT
const verifyJWT = async (token, perfil) => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const connection = await connect(); // Obtenha uma conexão ao banco de dados
    const sql = "SELECT perfil FROM usuario WHERE pessoa_id_pessoa = ?";
    const [results] = await connection.query(sql, [decoded.id]);
    console.log("Resultados:", decoded.id, results);
    if (results.length > 0) {
      const perfilList = results[0].perfil.split(",");
      if (perfilList.includes(perfil)) {
        return { auth: true, idUser: decoded.id };
      } else {
        return { auth: false, message: "Perfil Inválido!" };
      }
    } else {
      return { auth: false, message: "Perfil Inválido!" };
    }
  } catch (err) {
    return { auth: false, message: "Token inválido!" };
  }
};

//Função para gerar um codigo de verificação
const generateVerificationCode = async () => {
  const code = Math.floor(Math.random() * 1000000)
    .toString()
    .padStart(6, "0");
  return code;
};

globalVerificationData = { code: null }; // Variável global para armazenar o código de verificação

// Função para enviar o e-mail com o código de verificação
const sendVerificationCode = async (email) => {
  const verificarCode = await generateVerificationCode();
  try {
    await connection.query(
      `UPDATE usuario SET codigo = ? WHERE pessoa_id_pessoa = (SELECT id_pessoa FROM pessoa WHERE email = ?)`,
      [verificarCode, email]
    );

    globalVerificationData = {
      code: verificarCode,
    };

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL,
      to: email,
      subject: "Código de verificação",
      text: `Seu código de verificação é ${verificarCode}. Use-o para alterar sua senha. Ops: O código expira em 10 minutos.`,
    };

    return new Promise((resolve, reject) => {
      transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
          console.log(error);
          reject(error);
        } else {
          console.log("E-mail enviado: " + info.response);
          resolve(verificarCode);
        }
      });
    });
  } catch (error) {
    console.error(error);
    throw new Error("Erro ao enviar código de verificação.");
  }
};

// Função para atualizar a senha do usuário
const updatePassword = async (data) => {
  const bcrypt = require("bcrypt");
  const { email, novaSenha, confirmSenha, codigo } = data;
  return new Promise((resolve, reject) => {
    const sql =
      "SELECT p.id_pessoa as id, p.nome, p.email, u.codigo " +
      "FROM usuario u " +
      "JOIN pessoa p ON p.id_pessoa=u.pessoa_id_pessoa " +
      "WHERE p.email = ?";

    // Consulta o banco de dados para obter informações do usuário
    connection.query(sql, [email], (error, results) => {
      if (error) {
        reject(error);
      } else {
        let result = null;
        if (results && results.length > 0) {
          const id = results[0].id;
          const codigoDB = results[0].codigo;

          if (novaSenha !== confirmSenha) {
            // Se a nova senha e a confirmação de senha não coincidirem, define o resultado como autenticação falsa
            result = {
              auth: false,
              message: "A nova senha e a confirmação de senha não coincidem.",
            };
            resolve(result);
          } else {
            // Verifica se o código de verificação é válido
            if (codigo === codigoDB) {
              // Criptografa a nova senha com Bcrypt
              bcrypt.hash(novaSenha, 10, (err, hash) => {
                if (err) {
                  reject(err);
                } else {
                  // Atualiza a senha do usuário no banco de dados
                  const updateSql = `UPDATE usuario SET senha = ? WHERE pessoa_id_pessoa = ?`;
                  connection.query(updateSql, [hash, id], (error) => {
                    if (error) {
                      // Em caso de erro ao atualizar a senha, rejeita a Promise com o erro
                      reject(error);
                    } else {
                      // Senha atualizada com sucesso, define o resultado como autenticação verdadeira e retorna informações do usuário
                      result = {
                        auth: true,
                        message: "Senha atualizada com sucesso!",
                        user: results[0],
                      };
                      resolve(result);
                    }
                  });
                }
              });
            } else {
              console.log("Código de verificação inválido!", codigo);
              result = {
                auth: false,
                message: "Código de verificação inválido!",
              };
              resolve(result);
            }
          }
        } else {
          // Se nenhum usuário for encontrado com o e-mail fornecido, define o resultado como autenticação falsa
          result = { auth: false, message: "E-mail de usuário inválido!" };
          resolve(result);
        }
      }
    });
  }).catch((error) => {
    console.log(error);
    throw new Error("Erro ao atualizar senha do usuário.");
  });
};

module.exports = {
  get,
  login,
  verifyJWT,
  sendVerificationCode,
  updatePassword,
};
