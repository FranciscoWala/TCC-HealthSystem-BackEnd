/*************************************************************************************
 * Objetivo: Arquivo responsável por validar os dados recebidos
 * Data: 07/10/2026
 * Autor: Kayque Brenno Ferreira Almeida
 * Versão: 1.0
**************************************************************************************/

const Joi = require('joi')

const permissoesSchema = Joi.object({
    permissoes: Joi.string()
                .max(45)
                .required()
})

module.exports = permissoesSchema