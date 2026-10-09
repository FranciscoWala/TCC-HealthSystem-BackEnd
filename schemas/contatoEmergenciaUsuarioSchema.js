/*************************************************************************************
 * Objetivo: Arquivo responsável por validar os dados recebidos
 * Data: 09/10/2026
 * Autor: Kayque Brenno Ferreira Almeida
 * Versão: 1.0
**************************************************************************************/

const Joi = require('joi')

const contatoEmergenciaUsuarioSchema = Joi.object({
    id_contato_de_emergencia: Joi.number()
                                .integer()
                                .min(1)
                                .required(),
    
    id_usuarios: Joi.number()
                    .integer()
                    .min(1)
                    .required()
})

module.exports = contatoEmergenciaUsuarioSchema