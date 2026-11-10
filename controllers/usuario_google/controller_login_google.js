
/*************************************************************************************************************************
 * Objetivo: Arquivo responsável pelas regras de negócio do LOGIN GOOGLE
 * Autor: Kayque Brenno Ferreira Almeida
 * Data: 09/11/2026
 * Versão: 1.0
**************************************************************************************************************************/

// IMPORT DO ARQUIVO DE CONFIGURAÇÕES DE MENSAGENS DO PROJETO
const configMessages = require('../../utils/messages/configMessages.js')

// IMPORT DAS SERVICES
const usuarioGoogleService = require('../../services/usuario_google/service_usuario_google.js')
const usuarioService = require('../../services/usuarios/service_usuario.js')

// IMPORT DA VALIDAÇÃO DO TOKEN GOOGLE
const validarTokenGoogle = require('../../middleware/validarTokenGoogle.js')

// IMPORT DO ARQUIVO DE AUTENTICAÇÃO
const authenticate = require('../../middleware/authenticate.js')

const loginGoogle = async function (token, contentType) {
    let customMessages = JSON.parse(JSON.stringify(configMessages))

    try {
        if (String(contentType).toUpperCase() == 'APPLICATION/JSON') {

            if (!token)
                return customMessages.ERROR_BAD_REQUEST

            let dadosGoogle = await validarTokenGoogle.validarTokenGoogle(token)

            if (!dadosGoogle)
                return customMessages.ERROR_UNAUTHORIZED

            let buscarGoogle = await usuarioGoogleService.buscarUsuarioGooglePorGoogleIdService(dadosGoogle.google_id)

            if (!buscarGoogle.status) {
                if (buscarGoogle.status_code == 404) {
                    customMessages.DEFAULT_MESSAGE.status = true
                    customMessages.DEFAULT_MESSAGE.status_code = 200
                    customMessages.DEFAULT_MESSAGE.message = "USUÁRIO NÃO CADASTRADO. NECESSÁRIO REALIZAR CADASTRO."
                    customMessages.DEFAULT_MESSAGE.response = {
                        cadastro_necessario: true,
                        nome: dadosGoogle.nome,
                        email: dadosGoogle.email,
                        foto: dadosGoogle.foto
                    }

                    return customMessages.DEFAULT_MESSAGE
                }

                return buscarGoogle
            }

            let idUsuario = buscarGoogle.response.usuario_google[0].id_usuario

            let buscarUsuario = await usuarioService.buscarUsuarioService(idUsuario)

            if (!buscarUsuario.status)
                return buscarUsuario

            let usuario = buscarUsuario.response.usuario[0]

            if (usuario.ativo != 1)
                return customMessages.ERROR_FORBIDDEN

            let buscarRoles = await usuarioService.buscarRolesAtivasUsuarioService(usuario.id)

            if (!buscarRoles.status)
                return buscarRoles

            let roles = buscarRoles.response.roles

            if (roles.length != 1)
                return customMessages.ERROR_FORBIDDEN

            let payload = {
                id: usuario.id,
                role: roles[0].id_role
            }

            let jwt = await authenticate.createJWT(payload)

            delete usuario.senha

            usuario.jwt = jwt

            customMessages.DEFAULT_MESSAGE.status = customMessages.SUCCESS_RESPONSE.status
            customMessages.DEFAULT_MESSAGE.status_code = customMessages.SUCCESS_RESPONSE.status_code
            customMessages.DEFAULT_MESSAGE.response = usuario

            return customMessages.DEFAULT_MESSAGE
        } else
            return customMessages.ERROR_CONTENT_TYPE

    } catch (error) {
        console.log(error)
        return customMessages.ERROR_INTERNAL_SERVER_CONTROLLER
    }
}

module.exports = {
    loginGoogle
}
