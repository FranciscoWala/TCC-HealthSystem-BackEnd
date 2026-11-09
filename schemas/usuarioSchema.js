/*************************************************************************************
 * Objetivo: Arquivo responsável por validar os dados recebidos
 * Data: 07/10/2026
 * Autor: Kayque Brenno Ferreira Almeida
 * Versão: 1.0
**************************************************************************************/

const JOI = require('joi')

const usuarioSchema = JOI.object({
    nome: JOI.string()
        .max(80)
        .required(),

    foto: JOI.string()
        .uri({ scheme: ['http', 'https'] })
        .max(500)
        .allow(null)
        .optional(),

    email: JOI.string()
        .max(255)
        .email()
        .required(),

    senha: JOI.string()
        .max(70)
        .required(),

    cpf: JOI.string()
        .max(20)
        .allow(null),

    data_nascimento: JOI.date()
        .iso()
        .required()
})

module.exports = usuarioSchema