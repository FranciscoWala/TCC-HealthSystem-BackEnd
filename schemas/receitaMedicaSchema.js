/*************************************************************************************
 * Objetivo: Arquivo responsável por validar os dados recebidos
 * Data: 07/10/2026
 * Autor: Kayque Brenno Ferreira Almeida
 * Versão: 1.0
**************************************************************************************/

const Joi = require('joi')

const receitaMedicaSchema = Joi.object({
    id_usuario: Joi.number()
                .integer()
                .min(1)
                .required(),

    id_medicamento: Joi.number()
                    .integer()
                    .min(1)
                    .required(),
    
    frequencia: Joi.string()
                .pattern(/^([01]\d|2[0-3]):([0-5]\d):([0-5]\d)$/)
                .required(),

    dosagem: Joi.number()
                .min(0)
                .max(999.99)
                .precision(2)
                .required(),

    data_hora_inicio: Joi.string()
                        .pattern(/^([01]\d|2[0-3]):([0-5]\d):([0-5]\d)$/)
                        .required(),

    id_unidade_medida: Joi.number()
                        .integer()
                        .min(1)
                        .required(),
    
    id_tipo_intervalo: Joi.number()
                        .integer()
                        .min(1)
                        .required(),

    descricao: Joi.string()
})

module.exports = receitaMedicaSchema