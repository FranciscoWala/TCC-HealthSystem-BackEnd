/*************************************************************************************
 * Objetivo: Arquivo responsável por validar os dados recebidos
 * Data: 07/10/2026
 * Autor: Kayque Brenno Ferreira Almeida
 * Versão: 1.0
**************************************************************************************/

const JOI = require('joi')

const horarioSchema = JOI.object({
    horario: JOI.date()
                .iso()
                .required(),
                
    id_receita_medica: JOI.number()
                        .integer()
                        .min(1)
                        .required()
})

module.exports = horarioSchema