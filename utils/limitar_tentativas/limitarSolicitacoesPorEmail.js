
/**************************************************************************
    Objetivo: Arquivo responsável por limitar solicitações por e-mail
    Data: 13/11/2026
    Autor: Kayque Brenno Ferreira Almeida
    Versão: 1.0
***************************************************************************/

const limitador = require('express-rate-limit')

const limitarSolicitacoesPorEmail = limitador.rateLimit({
    windowMs: 10 * 60 * 1000,
    limit: 5,
    standardHeaders: 'draft-7',
    legacyHeaders: false,

    keyGenerator: function (request) {
        let email = request.body.email

        if (typeof email != 'string')
            return 'email-invalido'

        return email.trim().toLowerCase()
    },

    message: {
        status: false,
        status_code: 429,
        message: 'Muitas solicitações para este e-mail. Tente novamente em 10 minutos.'
    }
})

module.exports = limitarSolicitacoesPorEmail
