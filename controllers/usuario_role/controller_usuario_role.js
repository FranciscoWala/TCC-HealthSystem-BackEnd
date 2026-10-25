/*************************************************************************************************************************
 * Objetivo: Arquivo responsável pela manipulação de dados para realizar o CRUD de USUARIO ROLE
 * Autor: Kayque Brenno Ferreira Almeida
 * Data: 25/10/2026
 * Versão: 2.0
**************************************************************************************************************************/

// IMPORT DO ARQUIVO DE CONFIGURAÇÕES DE MENSAGENS DO PROJETO
const configMessages = require('../../utils/messages/configMessages.js')

// IMPORT DA SERVICE
const usuarioRoleService = require('../../services/usuario_role/service_usuario_role.js')

const inserirNovoUsuarioRole = async function (usuarioRole, contentType) {
    let customMessages = JSON.parse(JSON.stringify(configMessages))
    try {
        if (String(contentType).toUpperCase() == 'APPLICATION/JSON')
            return await usuarioRoleService.inserirUsuarioRoleService(usuarioRole)
        else
            return customMessages.ERROR_CONTENT_TYPE
    } catch (error) {
        return customMessages.ERROR_INTERNAL_SERVER_CONTROLLER
    }
}

const atualizarUsuarioRole = async function (usuarioRole, id, contentType) {
    let customMessages = JSON.parse(JSON.stringify(configMessages))
    try {
        if (String(contentType).toUpperCase() == 'APPLICATION/JSON')
            return await usuarioRoleService.atualizarUsuarioRoleService(usuarioRole, id)
        else
            return customMessages.ERROR_CONTENT_TYPE
    } catch (error) {
        return customMessages.ERROR_INTERNAL_SERVER_CONTROLLER
    }
}

const listarUsuarioRole = async function () {
    let customMessages = JSON.parse(JSON.stringify(configMessages))
    try {
        return await usuarioRoleService.listarUsuarioRoleService()
    } catch (error) {
        return customMessages.ERROR_INTERNAL_SERVER_CONTROLLER
    }
}

const buscarUsuarioRole = async function (id) {
    let customMessages = JSON.parse(JSON.stringify(configMessages))
    try {
        return await usuarioRoleService.buscarUsuarioRoleService(id)
    } catch (error) {
        return customMessages.ERROR_INTERNAL_SERVER_CONTROLLER
    }
}

const excluirUsuarioRole = async function (id) {
    let customMessages = JSON.parse(JSON.stringify(configMessages))
    try {
        return await usuarioRoleService.excluirUsuarioRoleService(id)
    } catch (error) {
        return customMessages.ERROR_INTERNAL_SERVER_CONTROLLER
    }
}

module.exports = {
    inserirNovoUsuarioRole,
    atualizarUsuarioRole,
    listarUsuarioRole,
    buscarUsuarioRole,
    excluirUsuarioRole
}