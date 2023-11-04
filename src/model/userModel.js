const jwt = require("jsonwebtoken");
require("dotenv").config();
const connection = require("./mysqlConnect").query();
const nodemailer = require("nodemailer");
const { error } = require("pdf-lib");

//----Função para REALIZAR o LOGIN----
const login = async (data) => {
  try {
    const bcrypt = require("bcrypt");
    const { email, senha } = data;

    //----Função TRIM para não permitir campo vazios nas COLUNAS----
    if (email.trim() === "" || senha.trim() === "") {
      throw new Error("E-mail e senha não podem ser vazios.");
    }

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
  } catch (error) {
    return {
      auth: false,
      message: error.message,
    };
  }
};

//----Função para VERIFICAR a VALIDADE do TOKEN JWT----
const verifyJWT = async (token, perfil) => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const connection = await connect();
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

//----Função para GERAR um CODIGO e TIMESTAMP de 20 MIN de VERIFIÇÃO----
const generateVerificationCode = async () => {
  const code = Math.floor(Math.random() * 1000000)
    .toString()
    .padStart(6, "0");
  const timestamp = new Date();
  timestamp.setMinutes(timestamp.getMinutes() + 20); //----Adiciona 20 minutos ao timestamp atual----

  return { code, timestamp };
};

globalVerificationData = { code: null };

//----Função para ENVIAR o EMAIL para USER----
const sendVerificationCode = async (email) => {
  const util = require('util');
  const query = util.promisify(connection.query).bind(connection);

  try {
    const { code, timestamp } = await generateVerificationCode();

    //----Verificar se o EMAIL existe no BANCO----
    const emailExistsQuery = "SELECT id_pessoa FROM pessoa WHERE email = ?";
    const emailExists = await query(emailExistsQuery, [email]);

    if (!emailExists || emailExists.length === 0) {
      throw new Error("Email não encontrado.");
    }

    //----Verificar se o CÓDIGO já foi ENVIADO----
    const [codeSent] = await query("SELECT codigo FROM codigo_usuario WHERE codigo = ?", [code]);

    if (codeSent && codeSent.length > 0) {
      throw new Error("Código já enviado.");
    }

    //----INSERIR o CODIGO no BANCO----
    const insertResult = await query(
      "INSERT INTO codigo_usuario (codigo, codigo_prazo, codigo_usado, usuario_pessoa_id_pessoa) VALUES (?, ?, ?, ?)",
      [code, timestamp, false, emailExists[0].id_pessoa]
    );

    if (insertResult.affectedRows === 0) {
      throw new Error("Erro ao inserir código de verificação.");
    }

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
      text: `Seu código de verificação é ${code}. Use-o para alterar sua senha. Ops: O código expira em 20 minutos.`,
    };

    const info = await transporter.sendMail(mailOptions);

    console.log("E-mail enviado: " + info.response);
    return code;
  } catch (error) {
    console.error("Erro ao enviar código de verificação.", error);
    throw new Error("Erro ao enviar código de verificação.");
  }
};

//----Função para atualizar a SENHA do usuário----
const updatePassword = async (data) => {
  const bcrypt = require("bcrypt");
  const { email, novaSenha, confirmSenha, codigo } = data;
  return new Promise((resolve, reject) => {
    const sql =
      "SELECT p.id_pessoa as id, p.nome, p.email, cu.codigo, cu.codigo_prazo, cu.codigo_usado " +
      "FROM usuario u " +
      "JOIN pessoa p ON p.id_pessoa=u.pessoa_id_pessoa " +
      "JOIN codigo_usuario cu ON cu.usuario_pessoa_id_pessoa = p.id_pessoa " +
      "WHERE p.email = ? AND cu.codigo_prazo >= NOW() AND cu.codigo_usado = false";

    connection.query(sql, [email], (error, results) => {
      if (error) {
        reject(error);
      } else {
        let result = null;
        if (results && results.length > 0) {
          const id = results[0].id;
          const codigoDB = results[0].codigo;

          if (novaSenha !== confirmSenha) {
            result = {
              auth: false,
              message: "A nova senha e a confirmação de senha não coincidem.",
            };
            resolve(result);
          } else {
            if (codigo === codigoDB) {
              const codigoPrazo = results[0].codigo_prazo;
              const agora = new Date();
              if (agora > codigoPrazo) {
                result = {
                  auth: false,
                  message: "O prazo do código de verificação expirou!",
                };
                resolve(result);
              } else {
                bcrypt.hash(novaSenha, 10, (err, hash) => {
                  if (err) {
                    reject(err);
                  } else {
                    const updateSql = `UPDATE usuario SET senha = ? WHERE pessoa_id_pessoa = ?`;
                    connection.query(updateSql, [hash, id], (error) => {
                      if (error) {
                        reject(error);
                      } else {
                        const updateCodeUsedSql = `UPDATE codigo_usuario SET codigo_usado = true WHERE usuario_pessoa_id_pessoa = ? AND codigo = ?`;
                        connection.query(
                          updateCodeUsedSql,
                          [id, codigo],
                          (error) => {
                            if (error) {
                              reject(error);
                            } else {
                              result = {
                                auth: true,
                                message: "Senha atualizada com sucesso!",
                                user: results[0],
                              };
                              resolve(result);
                            }
                          }
                        );
                      }
                    });
                  }
                });
              }
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

module.exports = { login, verifyJWT, sendVerificationCode, updatePassword };
