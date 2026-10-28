/* 
    Objetivo: Implementação do JWT no projeto
    data: 07/10/2026
    Autor: Samuel Silva Moreira Dos Santos
    Versão: 1.0
*/

const JWT = require('jsonwebtoken')

const  SECRET = "abc123"
const EXPIRES = 28800

async function createJWT(payLoad) {
   
    const token = JWT.sign(
        payLoad,
        SECRET,
        {expiresIn: EXPIRES}
    )

    return token
}

async function validateToken(token) {
    try {
      
        let clsToken = String(token).replace('Bearer ', '')

        return JWT.verify(clsToken, SECRET)

    } catch (error) {
        console.log(error)
        return false
    }
}

module.exports = {
    createJWT,
    validateToken
}