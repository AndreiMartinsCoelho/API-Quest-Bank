const criarProvaModel = require("../model/criarProvaModel");

exports.get = async (headers) => {
  try {
    const provas = await criarProvaModel.get();
    return {
      status: "success",
      msg: "Provas obtidas com sucesso!",
      provas,
    };
  } catch (error) {
    // Tratar erro caso ocorra na consulta ao banco de dados
    console.error("Erro ao criar Prova:", error);
    return {
      status: "error",
      msg: "Ocorreu um erro ao obter as Provas. Por favor, tente novamente mais tarde.",
    };
  }
};

exports.criar = async (body) => {
    const result = await criarProvaModel.criar(body);
    if (result.novaProvaId) {
        const provaCriada = result.provaDetalhes;
        return {
            status: "success",
            msg: "Prova criada com sucesso!",
            provas: [provaCriada], // Aqui estamos retornando a prova criada dentro de um array
        };
    } else {
        // Tratar caso em que a prova não foi criada
        return {
            status: "error",
            msg: "Erro ao criar a prova. Verifique os dados e tente novamente.",
        };
    }
};

  