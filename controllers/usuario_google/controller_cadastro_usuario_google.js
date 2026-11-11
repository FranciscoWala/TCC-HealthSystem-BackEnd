/*******************************************************************************************
 * Objetivo: Arquivo responsável pelo cadastro de usuários utilizando o Google
 * Autor: Kayque Brenno Ferreira Almeida
 * Data: 09/11/2026
 * Versão: 1.0
********************************************************************************************/

// IMPORT DO ARQUIVO DE CONFIGURAÇÕES DE MENSAGENS DO PROJETO
const configMessages = require('../../utils/messages/configMessages.js')

// IMPORT DAS SERVICES
const usuarioService = require('../../services/usuarios/service_usuario.js')
const usuarioGoogleService = require('../../services/usuario_google/service_usuario_google.js')
const roleService = require('../../services/role/service_role.js')
const usuarioRoleService = require('../../services/usuario_role/service_usuario_role.js')

// IMPORT DO ARQUIVO DE VALIDAÇÃO DO TOKEN GOOGLE
const validarTokenGoogle = require('../../middleware/validarTokenGoogle.js')

// IMPORT DA CONEXÃO COM O BANCO DE DADOS
const knexConection = require('../../models/global_knex/global_knex.js')

const cadastrarUsuarioGoogle = async function (dados, contentType) {
    let customMessages = JSON.parse(JSON.stringify(configMessages))
    try {
        if (String(contentType).toUpperCase() == 'APPLICATION/JSON') {

            if (!dados || !dados.token)
                return customMessages.ERROR_BAD_REQUEST

            let dadosGoogle = await validarTokenGoogle.validarTokenGoogle(dados.token)

            if (!dadosGoogle)
                return customMessages.ERROR_UNAUTHORIZED

            let buscarGoogle = await usuarioGoogleService.buscarUsuarioGooglePorGoogleIdService(dadosGoogle.google_id)

            if (buscarGoogle.status) {
                customMessages.DEFAULT_MESSAGE.status = true
                customMessages.DEFAULT_MESSAGE.status_code = 200
                customMessages.DEFAULT_MESSAGE.message = "CONTA GOOGLE JÁ CADASTRADA. REALIZE O LOGIN."
                customMessages.DEFAULT_MESSAGE.response = {
                    login_necessario: true,
                    tipo_login: "google"
                }

                return customMessages.DEFAULT_MESSAGE
            }

            if (buscarGoogle.status_code != 404)
                return buscarGoogle

            let buscarEmail = await usuarioService.buscarUsuarioPorEmailService({
                email: dadosGoogle.email
            })

            if (buscarEmail.status) {
                customMessages.DEFAULT_MESSAGE.status = true
                customMessages.DEFAULT_MESSAGE.status_code = 200
                customMessages.DEFAULT_MESSAGE.message = "E-MAIL JÁ CADASTRADO. REALIZE O LOGIN."
                customMessages.DEFAULT_MESSAGE.response = {
                    login_necessario: true,
                    tipo_login: "tradicional"
                }

                return customMessages.DEFAULT_MESSAGE
            }

            if (buscarEmail.status_code != 404)
                return buscarEmail

            if (!dados.usuario_role || !Number.isInteger(dados.usuario_role.id_role) || ![1, 2, 3].includes(dados.usuario_role.id_role))
                return customMessages.ERROR_BAD_REQUEST

            let buscarRole = await roleService.buscarRoleService(dados.usuario_role.id_role)

            if (!buscarRole.status)
                return buscarRole

            let result = await knexConection.transaction(async (transaction) => {

                let usuario = {
                    nome: dadosGoogle.nome,
                    foto: dadosGoogle.foto ?? null,
                    email: dadosGoogle.email,
                    senha: null,
                    cpf: dados.cpf ?? null,
                    telefone: dados.telefone ?? null,
                    data_nascimento: dados.data_nascimento
                }

                let cadastrarUsuario = await usuarioService.inserirUsuarioGoogleService(usuario, transaction)

                if (!cadastrarUsuario.status) {
                    let error = new Error('NÃO FOI POSSÍVEL CADASTRAR O USUÁRIO')
                    error.resposta = cadastrarUsuario
                    throw error
                }

                let usuarioGoogle = {
                    google_id: dadosGoogle.google_id,
                    id_usuario: cadastrarUsuario.response.id
                }

                let cadastrarGoogle = await usuarioGoogleService.inserirUsuarioGoogleService(usuarioGoogle, transaction)

                if (!cadastrarGoogle.status) {
                    let error = new Error('NÃO FOI POSSÍVEL VINCULAR O GOOGLE AO USUÁRIO')
                    error.resposta = cadastrarGoogle
                    throw error
                }

                let usuarioRole = {
                    ativo: 1,
                    data_ativacao: new Date(),
                    data_desativacao: null,
                    id_usuarios: cadastrarUsuario.response.id,
                    id_role: dados.usuario_role.id_role
                }

                let cadastrarRole = await usuarioRoleService.inserirUsuarioRoleService(usuarioRole, transaction)

                if (!cadastrarRole.status) {
                    let error = new Error('NÃO FOI POSSÍVEL VINCULAR A ROLE AO USUÁRIO')
                    error.resposta = cadastrarRole
                    throw error
                }

                return cadastrarUsuario.response
            })

            customMessages.DEFAULT_MESSAGE.status = customMessages.SUCCESS_CREATED_ITEM.status
            customMessages.DEFAULT_MESSAGE.status_code = customMessages.SUCCESS_CREATED_ITEM.status_code
            customMessages.DEFAULT_MESSAGE.message = customMessages.SUCCESS_CREATED_ITEM.message
            customMessages.DEFAULT_MESSAGE.response = result

            return customMessages.DEFAULT_MESSAGE

        } else
            return customMessages.ERROR_CONTENT_TYPE

    } catch (error) {
        console.log(error)
        return error.resposta || customMessages.ERROR_INTERNAL_SERVER_CONTROLLER
    }
}

module.exports = {
    cadastrarUsuarioGoogle
}