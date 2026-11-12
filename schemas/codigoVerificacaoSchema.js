/*************************************************************************************
 * Objetivo: Arquivo responsável por validar os dados recebidos
 * Data: 12/11/2026
 * Autor: Kayque Brenno Ferreira Almeida
 * Versão: 1.0
**************************************************************************************/

const JOI = require('joi')

const codigoVerificacaoSchema = JOI.object({
    codigo_hash: JOI.string()
                    .max(255)
                    .required(),

    tipo: JOI.string()
            .max(30)
            .required(),

    id_usuario: JOI.number()
                .integer()
                .min(1)
                .required(),

    data_expiracao: JOI.date()
                    .required(),

    utilizado: JOI.boolean()
                .optional(),

    tentativas: JOI.number()
                .integer()
                .min(0)
                .optional()
})

module.exports = codigoVerificacaoSchema
