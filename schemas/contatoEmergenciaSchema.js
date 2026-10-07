/*************************************************************************************
 * Objetivo: Arquivo responsável por validar os dados recebidos
 * Data: 07/10/2026
 * Autor: Kayque Brenno Ferreira Almeida
 * Versão: 1.0
**************************************************************************************/

const Joi = require('joi')

const contatoEmergenciaSchema = Joi.object({
    nome: Joi.string()
        .max(80)
        .required(),

    telefone: Joi.string()
            .max(20)
            .required()
})

module.exports = contatoEmergenciaSchema