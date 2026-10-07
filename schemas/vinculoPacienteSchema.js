/*************************************************************************************
 * Objetivo: Arquivo responsável por validar os dados recebidos
 * Data: 07/10/2026
 * Autor: Kayque Brenno Ferreira Almeida
 * Versão: 1.0
**************************************************************************************/

const Joi = require('joi')

const vinculoPacienteSchema = Joi.object({
    id_paciente: Joi.number()
                    .integer()
                    .min(1)
                    .required(),
    
    id_cuidador: Joi.number()
                    .integer()
                    .min(1)
                    .required()
})

module.exports = vinculoPacienteSchema