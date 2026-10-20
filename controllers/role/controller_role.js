/*************************************************************************************************************************
 * Objetivo: Arquivo responsável pela validação, tratamento, manipulação de dados para realizar o CRUD da ROLE
 * Autor: Kayque Brenno Ferreira Almeida
 * Data: 20/10/2026
 * Versão: 2.0
**************************************************************************************************************************/

// IMPORT DO ARQUIVO DE CONFIGURAÇÕES DE MENSAGENS DO PROJETO
const configMessages = require('../../utils/messages/configMessages.js')

// IMPORT DA SERVICE
const roleService = require('../../services/role/service_role.js')

const inserirNovaRole = async function (role, contentType) {
    let customMessages = JSON.parse(JSON.stringify(configMessages))
    try {
        if (String(contentType).toUpperCase() == 'APPLICATION/JSON')
            return await roleService.inserirRoleService(role)
        else
            return customMessages.ERROR_CONTENT_TYPE
    } catch (error) {
        return customMessages.ERROR_INTERNAL_SERVER_CONTROLLER
    }
}

const atualizarRole = async function (role, id, contentType) {
    let customMessages = JSON.parse(JSON.stringify(configMessages))
    try {
        if (String(contentType).toUpperCase() == 'APPLICATION/JSON')
            return await roleService.atualizarRoleService(role, id)
        else
            return customMessages.ERROR_CONTENT_TYPE
    } catch (error) {
        return customMessages.ERROR_INTERNAL_SERVER_CONTROLLER
    }
}

const listarRole = async function () {
    let customMessages = JSON.parse(JSON.stringify(configMessages))
    try {
        return await roleService.listarRoleService()
    } catch (error) {
        return customMessages.ERROR_INTERNAL_SERVER_CONTROLLER
    }
}

const buscarRole = async function (id) {
    let customMessages = JSON.parse(JSON.stringify(configMessages))
    try {
        return await roleService.buscarRoleService(id)
    } catch (error) {
        return customMessages.ERROR_INTERNAL_SERVER_CONTROLLER
    }
}

const excluirRole = async function (id) {
    let customMessages = JSON.parse(JSON.stringify(configMessages))
    try {
        return await roleService.excluirRoleService(id)
    } catch (error) {
        return customMessages.ERROR_INTERNAL_SERVER_CONTROLLER
    }
}

module.exports = {
    inserirNovaRole,
    atualizarRole,
    listarRole,
    buscarRole,
    excluirRole
}