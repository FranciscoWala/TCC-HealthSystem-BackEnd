/*************************************************************************************
 * Objetivo: Arquivo responsável por validar os dados recebidos
 * Data: 07/10/2026
 * Autor: Kayque Brenno Ferreira Almeida
 * Versão: 1.0
**************************************************************************************/

const Joi = require('joi')

const tipoIntervaloSchema = Joi.object({
    tipo_intervalo: Joi.string()
                    .max(5)
                    .required()
})

module.exports = tipoIntervaloSchema