/*************************************************************************************
 * Objetivo: Arquivo responsável por validar os dados recebidos
 * Data: 07/10/2026
 * Autor: Kayque Brenno Ferreira Almeida
 * Versão: 1.0
**************************************************************************************/

const JOI = require('joi')

const receitaMedicaSchema = JOI.object({
    id_usuario: JOI.number()
                .integer()
                .min(1)
                .required(),

    id_medicamento: JOI.number()
                    .integer()
                    .min(1)
                    .required(),
    
    frequencia: JOI.string()
                .pattern(/^([01]\d|2[0-3]):([0-5]\d):([0-5]\d)$/)
                .required(),

    dosagem: JOI.number()
                .min(0)
                .max(999.99)
                .precision(2)
                .required(),

    data_hora_inicio: JOI.string()
                        .pattern(/^([01]\d|2[0-3]):([0-5]\d):([0-5]\d)$/)
                        .required(),

    data_inicio: JOI.date()
                .iso()
                .required(),

    id_unidade_medida: JOI.number()
                        .integer()
                        .min(1)
                        .required(),
    
    id_tipo_intervalo: JOI.number()
                        .integer()
                        .min(1)
                        .required(),

    descricao: JOI.string()
})

module.exports = receitaMedicaSchema