const mysql = require("mysql");

const connection = mysql.createConnection({
  host: "mysql.infocimol.com.br",
  user: "infocimol",
  password: "c1i2m3o4l5",
  database: "infocimol",
});

// Função para trocar a senha do usuário
const changePassword = async (data) => {
  const { email, novaSenha, confirmSenha } = data;

  return new Promise((resolve, reject) => {
    const sql =
      "SELECT p.id_pessoa as id, p.nome, p.email " +
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

          console.log("Fez a troca de senha!");

          if (novaSenha !== confirmSenha) {
            // Se a nova senha e a confirmação de senha não coincidirem, define o resultado como autenticação falsa
            result = {
              auth: false,
              message: "A nova senha e a confirmação de senha não coincidem.",
            };
            resolve(result);
          } else {
            // Atualiza a senha do usuário no banco de dados
            const updateSql =
              "UPDATE usuario SET senha = ? WHERE pessoa_id_pessoa = ?";
            console.log(updateSql);
            connection.query(updateSql, [novaSenha, id], (error) => {
              if (error) {
                // Em caso de erro ao atualizar a senha, rejeita a Promise com o erro
                reject(error);
              } else {
                // Senha atualizada com sucesso, define o resultado como autenticação verdadeira e retorna informações do usuário
                result = { auth: true, user: results[0] };
                resolve(result);
              }
            });
          }
        } else {
          // Se nenhum usuário for encontrado com o e-mail fornecido, define o resultado como autenticação falsa
          result = { auth: false, message: "E-mail de usuário inválido!" };
          resolve(result);
        }
      }
    });
  });
};

module.exports = { changePassword };

