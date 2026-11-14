/************************************************************************** 
    Objetivo: Arquivo responsável pela validação de tentativas
    data: 12/11/2026
    Autor: Kayque Brenno Ferreira Almeida
    Versão: 1.0
***************************************************************************/

const limitador = require('express-rate-limit')

const limitarTentativasCodigo = function (limite = 5, minutos = 10) {
    return limitador.rateLimit({
        windowMs: minutos * 60 * 1000,
        limit: limite,
        standardHeaders: 'draft-8',
        legacyHeaders: false,

        keyGenerator: function (request) {
            return `codigo:${request.user.id}`
        },

        message: {
            status: false,
            status_code: 429,
            message: 'Limite de tentativas atingido. Tente novamente mais tarde.'
        }
    })
}

module.exports = {
    limitarTentativasCodigo
}