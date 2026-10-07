/*************************************************************************************
 * Objetivo: Arquivo responsável por validar os dados recebidos
 * Data: 07/10/2026
 * Autor: Kayque Brenno Ferreira Almeida
 * Versão: 1.0
**************************************************************************************/

const Joi = require('joi')

const estoqueSchema = Joi.object({
    quantidade_em_estoque: Joi.number()
                            .min(0)
                            .max(99999.99)
                            .precision(2)
                            .required(),

    id_usuario: Joi.number()
                    .integer()
                    .min(1)
                    .required(),

    id_medicamento: Joi.number()
                        .integer()
                        .min(1)
                        .required()
})

module.exports = estoqueSchema