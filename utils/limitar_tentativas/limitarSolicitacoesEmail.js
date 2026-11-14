/************************************************************************** 
    Objetivo: Arquivo responsável pela validação de tentativas
    data: 12/11/2026
    Autor: Kayque Brenno Ferreira Almeida
    Versão: 1.0
***************************************************************************/

const limitador = require('express-rate-limit')

const limitarSolicitacoesEmail = limitador.rateLimit({
    windowMs: 10 * 60 * 1000,
    limit: 5,
    standardHeaders: 'draft-7',
    legacyHeaders: false,
    message: {
        status: false,
        status_code: 429,
        message: 'Muitas solicitações. Tente novamente em 10 minutos.'
    }
})

module.exports = limitarSolicitacoesEmail