/**************************************************************************
    Objetivo: Arquivo responsável por limitar tentativas de cadastro
    Data: 13/11/2026
    Autor: Kayque Brenno Ferreira Almeida
    Versão: 1.0
***************************************************************************/

const limitador = require('express-rate-limit')

const limitarTentativasCadastro = limitador.rateLimit({
    windowMs: 10 * 60 * 1000,
    limit: 20,
    standardHeaders: 'draft-7',
    legacyHeaders: false,
    message: {
        status: false,
        status_code: 429,
        message: 'Muitas tentativas de cadastro. Tente novamente em 10 minutos.'
    }
})

module.exports = limitarTentativasCadastro