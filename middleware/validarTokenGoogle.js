/* 
    Objetivo: Validar o token enviado do google
    data: 09/11/2026
    Autor: Kayque Brenno Ferreira Almeida
    Versão: 1.0
*/


const googleAuth = require('google-auth-library')

const client = new googleAuth.OAuth2Client(process.env.GOOGLE_CLIENT_ID)

const validarTokenGoogle = async function (token) {
    try {
        const ticket = await client.verifyIdToken({
            idToken: token,
            audience: process.env.GOOGLE_CLIENT_ID
        })

        const payload = ticket.getPayload()

        if (!payload || !payload.sub || !payload.email_verified)
            return false

        return {
            google_id: payload.sub,
            nome: payload.name,
            email: payload.email,
            foto: payload.picture ?? null
        }

    } catch (error) {
        console.log("ERRO AO VALIDAR TOKEN GOOGLE:", error.message)
        return false
    }
}

module.exports = {
    validarTokenGoogle
}
