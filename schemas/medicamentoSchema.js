/*************************************************************************************
 * Objetivo: Arquivo responsável por validar os dados recebidos
 * Data: 07/10/2026
 * Autor: Kayque Brenno Ferreira Almeida
 * Versão: 1.0
**************************************************************************************/

const Joi = require('joi')

const medicamentoSchema = Joi.object({
        nome: Joi.string()
                .max(45)
                .required(),

        imagem: Joi.string()
                .max(255)
                .required(),

        concentracao: Joi.number()
                        .min(0)
                        .max(999.99)
                        .precision(2)
                        .required(),

        id_unidade_medida_embalagem: Joi.number()
                                        .integer()
                                        .min(1)
                                        .required(),

        id_tipo_dosagem: Joi.number()
                        .integer()
                        .min(1)
                        .required(),
        
        id_usuario: Joi.number()
                        .integer()
                        .min(1)
                        .allow(null)
})

module.exports = medicamentoSchema