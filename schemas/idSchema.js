/*************************************************************************************
 * Objetivo: Arquivo responsável por validar os dados recebidos
 * Data: 09/10/2026
 * Autor: Kayque Brenno Ferreira Almeida
 * Versão: 1.0
**************************************************************************************/

const Joi = require('joi')

const idSchema = Joi.number()
    .integer()
    .min(1)
    .required()
    .messages({
        'number.base': '[ID] INVÁLIDO',
        'number.integer': '[ID] INVÁLIDO',
        'number.min': '[ID] INVÁLIDO',
        'any.required': '[ID] INVÁLIDO'
    })

module.exports = idSchema