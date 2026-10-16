/*************************************************************************************************************************
 * Objetivo: Arquivo responsável pela validação, tratamento, manipulação de dados para realizar o CRUD da ROLE
 * Autor: Kayque Brenno Ferreira Almeida
 * Data: 09/10/2026
 * Versão: 1.0
**************************************************************************************************************************/

// IMPORT DO ARQUIVO DE CONFIGURAÇÕES DE MENSAGENS DO PROJETO
const configMessages = require('../modulo/configMessages.js')

// IMPORT DA DAO
const roleDAO = require('../../models/DAO/role/role.js')

// IMPORT DO SCHEMAS DE VALIDAÇÃO
const validarDados = require('../../utils/validarDados.js')
const roleSchema = require('../../schemas/roleSchemas.js')

const validarDadosRole = function (role) {
    let customMessages = JSON.parse(JSON.stringify(configMessages))

    return validarDados.validarDados(roleSchema, role, customMessages)
}

const inserirNovaRole = async function (role, contentType) {
    let customMessages = JSON.parse(JSON.stringify(configMessages))

    try {
        if (String(contentType).toUpperCase() == 'APPLICATION/JSON') {
            let validar = validarDadosRole(role)

            if (validar)
                return validar
            else {
                let result = await roleDAO.insertRole(role)

                if (result) {
                    role.id = result

                    customMessages.DEFAULT_MESSAGE.status       = customMessages.SUCCESS_CREATED_ITEM.status
                    customMessages.DEFAULT_MESSAGE.status_code  = customMessages.SUCCESS_CREATED_ITEM.status_code
                    customMessages.DEFAULT_MESSAGE.message      = customMessages.SUCCESS_CREATED_ITEM.message
                    customMessages.DEFAULT_MESSAGE.response     = role

                    return customMessages.DEFAULT_MESSAGE
                } else
                    return customMessages.ERROR_INTERNAL_SERVER_MODEL
            }
        } else
            return customMessages.ERROR_CONTENT_TYPE
    } catch (error) {
        return customMessages.ERROR_INTERNAL_SERVER_CONTROLLER
    }
}

const atualizarRole = async function (role, id, contentType) {
    let customMessages = JSON.parse(JSON.stringify(configMessages))

    try {
        if (String(contentType).toUpperCase() == 'APPLICATION/JSON') {
            let resultBuscarID = await buscarRole(id)

            if (resultBuscarID.status) {
                let validar = await validarDadosRole(role)

                if (validar)
                    return validar
                else {
                    role.id = Number(id)

                    let result = await roleDAO.updateRole(role)

                    if (result) {
                        customMessages.DEFAULT_MESSAGE.status       = customMessages.SUCCESS_UPDATE_ITEM.status
                        customMessages.DEFAULT_MESSAGE.status_code  = customMessages.SUCCESS_UPDATE_ITEM.status_code
                        customMessages.DEFAULT_MESSAGE.message      = customMessages.SUCCESS_UPDATE_ITEM.message
                        customMessages.DEFAULT_MESSAGE.response     = role

                        return customMessages.DEFAULT_MESSAGE
                    } else
                        return customMessages.ERROR_INTERNAL_SERVER_MODEL
                }
            } else
                return resultBuscarID
        } else
            return customMessages.ERROR_CONTENT_TYPE
    } catch (error) {
        return customMessages.ERROR_INTERNAL_SERVER_CONTROLLER
    }
}

const listarRole = async function () {
    let customMessages = JSON.parse(JSON.stringify(configMessages))

    try {
        let result = await roleDAO.selectAllRoles()

        if (result) {
            if (result.length > 0) {
                customMessages.DEFAULT_MESSAGE.status               = customMessages.SUCCESS_RESPONSE.status
                customMessages.DEFAULT_MESSAGE.status_code          = customMessages.SUCCESS_RESPONSE.status_code
                customMessages.DEFAULT_MESSAGE.response.count       = result.length
                customMessages.DEFAULT_MESSAGE.response.role        = result

                return customMessages.DEFAULT_MESSAGE
            } else
                return customMessages.ERROR_NOT_FOUND
        } else
            return customMessages.ERROR_INTERNAL_SERVER_MODEL
    } catch (error) {
        return customMessages.ERROR_INTERNAL_SERVER_CONTROLLER
    }
}

const buscarRole = async function (id) {
    let customMessages = JSON.parse(JSON.stringify(configMessages))

    try {
        let validarID = validarDados.validarIDs(id, customMessages)

        if (validarID) {
            return validarID
        } else {
            let result = await roleDAO.selectByIdRole(id)

            if (result) {
                if (result.length > 0) {
                    customMessages.DEFAULT_MESSAGE.status               = customMessages.SUCCESS_RESPONSE.status
                    customMessages.DEFAULT_MESSAGE.status_code          = customMessages.SUCCESS_RESPONSE.status_code
                    customMessages.DEFAULT_MESSAGE.response.role        = result

                    return customMessages.DEFAULT_MESSAGE
                } else
                    return customMessages.ERROR_NOT_FOUND
            } else
                return customMessages.ERROR_INTERNAL_SERVER_MODEL
        }
    } catch (error) {
        return customMessages.ERROR_INTERNAL_SERVER_CONTROLLER
    }
}

const excluirRole = async function (id) {
    let customMessages = JSON.parse(JSON.stringify(configMessages))

    try {
        let resultBuscarID = await buscarRole(id)

        if (resultBuscarID.status) {
            let result = await roleDAO.deleteRole(id)

            if (result)
                return customMessages.SUCCESS_DELETE_ITEM
            else
                return customMessages.ERROR_INTERNAL_SERVER_MODEL
        } else
            return resultBuscarID
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