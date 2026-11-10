/*************************************************************************************
 * Objetivo: Arquivo responsável por validar os dados recebidos
 * Data: 09/10/2026
 * Autor: Kayque Brenno Ferreira Almeida
 * Versão: 1.0
**************************************************************************************/

const Joi = require('joi')

const usuarioRoleSchema = Joi.object({
    ativo: Joi.number()
            .integer()
            .valid(0, 1)
            .required(),

    data_ativacao: Joi.date()
                    .iso(),
                    
    data_desativacao: Joi.date()
                        .iso()
                        .allow('', null),
    
    id_usuarios: Joi.number()
                    .integer()
                    .min(1)
                    .required(),

    id_role: Joi.number()
                .integer()
                .min(1)
                .required()
})

module.exports = usuarioRoleSchema