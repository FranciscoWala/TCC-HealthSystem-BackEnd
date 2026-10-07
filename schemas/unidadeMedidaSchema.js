/*************************************************************************************
 * Objetivo: Arquivo responsável por validar os dados recebidos
 * Data: 07/10/2026
 * Autor: Kayque Brenno Ferreira Almeida
 * Versão: 1.0
**************************************************************************************/

const Joi = require('joi')

const unidadeMedidaSchema = Joi.object({
    unidade_medida: Joi.string()
                    .max(30)
                    .required(),

    sigla: Joi.string()
            .max(6)
            .required()
})

module.exports = unidadeMedidaSchema