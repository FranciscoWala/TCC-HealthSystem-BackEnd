/*************************************************************************************************************************
 * Objetivo: Arquivo responsável pela manipulação de dados para realizar o CRUD de ROLE PERMISSOES
 * Autor: Kayque Brenno Ferreira Almeida
 * Data: 25/10/2026
 * Versão: 2.0
**************************************************************************************************************************/

// IMPORT DO ARQUIVO DE CONFIGURAÇÕES DE MENSAGENS DO PROJETO
const configMessages = require('../../utils/messages/configMessages.js')

// IMPORT DA SERVICE
const rolePermissoesService = require('../../services/role_permissoes/service_role_permissoes.js')

const inserirNovaRolePermissoes = async function (rolePermissoes, contentType) {
    let customMessages = JSON.parse(JSON.stringify(configMessages))
    try {
        if (String(contentType).toUpperCase() == 'APPLICATION/JSON')
            return await rolePermissoesService.inserirRolePermissoesService(rolePermissoes)
        else
            return customMessages.ERROR_CONTENT_TYPE
    } catch (error) {
        return customMessages.ERROR_INTERNAL_SERVER_CONTROLLER
    }
}

const atualizarRolePermissoes = async function (rolePermissoes, id, contentType) {
    let customMessages = JSON.parse(JSON.stringify(configMessages))
    try {
        if (String(contentType).toUpperCase() == 'APPLICATION/JSON')
            return await rolePermissoesService.atualizarRolePermissoesService(rolePermissoes, id)
        else
            return customMessages.ERROR_CONTENT_TYPE
    } catch (error) {
        return customMessages.ERROR_INTERNAL_SERVER_CONTROLLER
    }
}

const listarRolePermissoes = async function () {
    let customMessages = JSON.parse(JSON.stringify(configMessages))
    try {
        return await rolePermissoesService.listarRolePermissoesService()
    } catch (error) {
        return customMessages.ERROR_INTERNAL_SERVER_CONTROLLER
    }
}

const buscarPermissoesUsuario = async function (idRole) {
    let customMessages = JSON.parse(JSON.stringify(configMessages))
    try {
        return await rolePermissoesService.buscarPermissoesUsuarioService(idRole)
    } catch (error) {
        return customMessages.ERROR_INTERNAL_SERVER_CONTROLLER
    }
}

const buscarRolePermissoes = async function (id) {
    let customMessages = JSON.parse(JSON.stringify(configMessages))
    try {
        return await rolePermissoesService.buscarRolePermissoesService(id)
    } catch (error) {
        return customMessages.ERROR_INTERNAL_SERVER_CONTROLLER
    }
}

const excluirRolePermissoes = async function (id) {
    let customMessages = JSON.parse(JSON.stringify(configMessages))
    try {
        return await rolePermissoesService.excluirRolePermissoesService(id)
    } catch (error) {
        return customMessages.ERROR_INTERNAL_SERVER_CONTROLLER
    }
}

module.exports = {
    inserirNovaRolePermissoes,
    atualizarRolePermissoes,
    listarRolePermissoes,
    buscarPermissoesUsuario,
    buscarRolePermissoes,
    excluirRolePermissoes
}