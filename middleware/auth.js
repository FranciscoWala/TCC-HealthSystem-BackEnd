/*
    Objetivo: Arquivo responsável pela verificação do TOKEN
    Data: 07/10/2026
    Autor: Samuel Silva Moreira Dos Santos
    Versão: 1.0
*/

const jwt = require('./authenticate.js')

async function verificarToken(request, response, next) {
    let token = request.headers.authorization

    const autenticidadeToken = await jwt.validateToken(token)

    if(autenticidadeToken)
        next()
    else
        return response.status(401).json(
            {
                message: "TOKEN INVÁLIDO OU NÃO INFORMADO"
            }
        )
}

module.exports = {
    verificarToken
}