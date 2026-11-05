/*************************************************************************************
 * Objetivo: Arquivo responsável por validar os dados recebidos
 * Data: 25/10/2026
 * Autor: Kayque Brenno Ferreira Almeida
 * Versão: 1.0
**************************************************************************************/

const JOI = require('joi')

const programacaoMedicamentoSchema = JOI.object({
    
    frequencia: JOI.number()
                .integer()
                .min(1)
                .required(),

    
    data_hora_inicio: JOI.string()
                        .pattern(/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/)
                        .required(),

    data_hora_fim: JOI.string()
                    .pattern(/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/)
                    .allow(null),
    
    id_tipo_intervalo: JOI.number()
                        .integer()
                        .min(1)
                        .required(),

    id_receita_medica: JOI.number()
                        .integer()
                        .min(1)
                        .required()
})

module.exports = programacaoMedicamentoSchema