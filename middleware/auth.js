/*
    Objetivo: Arquivo responsável pela verificação do TOKEN
    Data: 07/10/2026
    Autor: Samuel Silva Moreira Dos Santos
    Versão: 1.0
*/

const jwt = require('./authenticate.js')

async function verificarToken(request, response, next) {

    try {
        let token = request.headers.authorization

        const autenticidadeToken = await jwt.validateToken(token)

        if (autenticidadeToken) {
            request.user = autenticidadeToken
            return next()
        }
        else
            return response.status(401).json(
                {
                    message: "TOKEN INVÁLIDO OU NÃO INFORMADO"
                }
            )
    } catch (error) {
        console.log(error)
        return response.status(500).json(
                {
                    message: "ERRO INTERNO DO SERVIDOR"
                }
            ) 
    }
}

module.exports = {
    verificarToken
}