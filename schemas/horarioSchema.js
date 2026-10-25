/*************************************************************************************
 * Objetivo: Arquivo responsável por validar os dados recebidos
 * Data: 07/10/2026
 * Autor: Kayque Brenno Ferreira Almeida
 * Versão: 1.0
**************************************************************************************/

const JOI = require('joi')

const horarioSchema = JOI.object({
    horario: JOI.string()
            .pattern(/^([01]\d|2[0-3]):([0-5]\d):([0-5]\d)$/)
            .required(),
                
    id_receita_medica: JOI.number()
                        .integer()
                        .min(1)
                        .required()
})

module.exports = horarioSchema