const JOI = require('joi')

const historicoMedicamentoSchema = JOI.object({
    hora_ingestao: JOI.date()
                    .iso()
                    .required(),

    id_paciente: JOI.number()
                    .integer()
                    .min(1)
                    .required(),
                    
    id_receita_medica: JOI.number()
                        .integer()
                        .min(1)
                        .allow(null),

    dosagem_ingerida: JOI.number()
                        .min(0)
                        .max(999.99)
                        .precision(2)
                        .required(),


    horario_programado: JOI.date()
                        .iso()
                        .required(),

    nome_medicamento: JOI.string()
                        .max(45)
                        .required(),

    concentracao: JOI.number()
                    .min(0)
                    .max(999.99)
                    .precision(2)
                    .required(),

    unidade_concentracao: JOI.string()
                            .max(6)
                            .required(),

    tipo_dosagem: JOI.string()
                    .max(12)
                    .required()
})

module.exports = historicoMedicamentoSchema