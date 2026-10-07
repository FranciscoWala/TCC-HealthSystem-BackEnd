/*************************************************************************************
 * Objetivo: Arquivo responsável por validar os dados recebidos
 * Data: 07/10/2026
 * Autor: Kayque Brenno Ferreira Almeida
 * Versão: 1.0
**************************************************************************************/

const Joi = require('joi')

const usuarioSchema = Joi.object({
    nome: Joi.string()
            .max(80)
            .required(),

    email: Joi.string()
            .max(255)
            .required(),

    senha: Joi.string()
            .max(70)
            .required(),

    data_nascimento: Joi.date()
                    .iso()
                    .required()
})

module.exports = usuarioSchema