/*************************************************************************************
 * Objetivo: Arquivo responsável por validar os dados recebidos
 * Data: 07/10/2026
 * Autor: Kayque Brenno Ferreira Almeida
 * Versão: 1.0
**************************************************************************************/

const Joi = require('joi')

const doencaCronicaSchema = Joi.object({
    nome_doenca: Joi.string()
                .max(45)
                .required()
})

module.exports = doencaCronicaSchema