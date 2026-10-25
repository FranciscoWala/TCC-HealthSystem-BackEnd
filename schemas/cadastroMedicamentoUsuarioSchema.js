const JOI = require('joi')

// Schema do cadastro completo de medicamento do usuário
const cadastroMedicamentoUsuarioSchema = JOI.object({

    // Medicamento existente no catálogo
    id_medicamento: JOI.number()
                    .integer()
                    .min(1),

    // Dados para cadastrar um medicamento particular
    medicamento: JOI.object({
        nome: JOI.string()
                .max(45)
                .required(),

        imagem: JOI.string()
                .max(255)
                .required(),

        concentracao: JOI.number()
                        .min(0)
                        .max(999.99)
                        .precision(2)
                        .required(),

        id_unidade_medida_embalagem: JOI.number()
                                        .integer()
                                        .min(1)
                                        .required(),

        id_tipo_dosagem: JOI.number()
                            .integer()
                            .min(1)
                            .required()
    }),

    // Dados da receita médica
    receita_medica: JOI.object({
        id_usuario: JOI.number()
                    .integer()
                    .min(1)
                    .required(),

        dosagem: JOI.number()
                    .positive()
                    .precision(2)
                    .required(),

        id_unidade_medida: JOI.number()
                            .integer()
                            .min(1)
                            .required(),

        descricao: JOI.string()
                    .allow('', null)
    }).required(),

    // Dados da programação do medicamento
    programacao_medicamento: JOI.object({
        frequencia: JOI.number()
                    .integer()
                    .min(1)
                    .required(),

        data_hora_inicio: JOI.date()
                            .iso()
                            .required(),

        id_tipo_intervalo: JOI.number()
                            .integer()
                            .min(1)
                            .required()
    }).required(),

    // Estoque inicial
    estoque: JOI.object({
        quantidade_em_estoque: JOI.number()
                                .min(0)
                                .precision(2)
                                .required()
    }).required()

}).xor('id_medicamento', 'medicamento')

module.exports = cadastroMedicamentoUsuarioSchema