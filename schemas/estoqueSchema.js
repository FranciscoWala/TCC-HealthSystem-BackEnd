/*************************************************************************************
 * Objetivo: Arquivo responsável por validar os dados recebidos
 * Data: 07/10/2026
 * Autor: Kayque Brenno Ferreira Almeida
 * Versão: 1.0
**************************************************************************************/

const JOI = require('joi')

const estoqueSchema = JOI.object({
    quantidade_em_estoque: JOI.number()
                            .min(0)
                            .max(99999.99)
                            .precision(2)
                            .required(),

    id_usuarios: JOI.number()
                    .integer()
                    .min(1)
                    .required(),

    id_medicamentos: JOI.number()
                        .integer()
                        .min(1)
                        .required()
})

module.exports = estoqueSchema