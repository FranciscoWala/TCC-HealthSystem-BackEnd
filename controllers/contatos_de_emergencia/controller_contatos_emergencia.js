/**********************************************************************************************************************************
 * Objetivo: Arquivo responsável pela validação, tratamento, manipulação de dados para realizar o CRUD de CONTATOS DE EMERGÊNCIA,
 *  e também fazer a integração entre a API e a model
 * Autor: Kayque Brenno Ferreira Almeida
 * Data: 15/10/2026
 * Versão: 1.0
***********************************************************************************************************************************/

// IMPORT DO ARQUIVO DE CONFIGURAÇÕES DE MENSAGENS DO PROJETO
const configMessages = require('../../utils/messages/configMessages.js')

// IMPORT DA DAO
const contatoEmergenciaDAO = require('../../models/DAO/contato_de_emergencia/contato_de_emergencia.js')

// IMPORT DO SCHEMAS DE VALIDAÇÃO
const validarDados = require('../../utils/validar_dados/validarDados.js')
const contatoEmergenciaSchema = require('../../schemas/contatoEmergenciaSchema.js')

const validarDadosContatosEmergencia = function (contatoEmergencia) {
    let customMessages = JSON.parse(JSON.stringify(configMessages))

    return validarDados.validarDados(contatoEmergenciaSchema, contatoEmergencia, customMessages)
}

const inserirNovoContatoEmergencia = async function (contatoEmergencia, contentType) {
    let customMessages = JSON.parse(JSON.stringify(configMessages))

    try {
        if (String(contentType).toUpperCase() == 'APPLICATION/JSON') {
            let validar = validarDadosContatosEmergencia(contatoEmergencia)

            if (validar)
                return validar
            else {
                let result = await contatoEmergenciaDAO.insertContatoEmergencia(contatoEmergencia)

                if (result) {
                    contatoEmergencia.id = result

                    customMessages.DEFAULT_MESSAGE.status       = customMessages.SUCCESS_CREATED_ITEM.status
                    customMessages.DEFAULT_MESSAGE.status_code  = customMessages.SUCCESS_CREATED_ITEM.status_code
                    customMessages.DEFAULT_MESSAGE.message      = customMessages.SUCCESS_CREATED_ITEM.message
                    customMessages.DEFAULT_MESSAGE.response     = contatoEmergencia

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

const atualizarContatoEmergencia = async function (contatoEmergencia, id, contentType) {
    let customMessages = JSON.parse(JSON.stringify(configMessages))

    try {
        if (String(contentType).toUpperCase() == 'APPLICATION/JSON') {
            let resultBuscarID = await buscarContatoEmergencia(id)

            if (resultBuscarID.status) {
                let validar = await validarDadosContatosEmergencia(contatoEmergencia)

                if (validar)
                    return validar
                else {
                    contatoEmergencia.id = Number(id)

                    let result = await contatoEmergenciaDAO.updateContatoEmergencia(contatoEmergencia)

                    if (result) {
                        customMessages.DEFAULT_MESSAGE.status       = customMessages.SUCCESS_UPDATE_ITEM.status
                        customMessages.DEFAULT_MESSAGE.status_code  = customMessages.SUCCESS_UPDATE_ITEM.status_code
                        customMessages.DEFAULT_MESSAGE.message      = customMessages.SUCCESS_UPDATE_ITEM.message
                        customMessages.DEFAULT_MESSAGE.response     = contatoEmergencia

                        return customMessages.DEFAULT_MESSAGE
                    } else
                        return customMessages.ERROR_INTERNAL_SERVER_MODEL
                }
            } else
                return resultBuscarID
        } else
            return customMessages.ERROR_CONTENT_TYPE
    } catch (error) {
        console.log(error)
        return customMessages.ERROR_INTERNAL_SERVER_CONTROLLER
    }
}

const listarContatoEmergencia = async function () {
    let customMessages = JSON.parse(JSON.stringify(configMessages))

    try {
        let result = await contatoEmergenciaDAO.getContatosEmergencia()

        if (result) {
            if (result.length > 0) {
                customMessages.DEFAULT_MESSAGE.status                       = customMessages.SUCCESS_RESPONSE.status
                customMessages.DEFAULT_MESSAGE.status_code                  = customMessages.SUCCESS_RESPONSE.status_code
                customMessages.DEFAULT_MESSAGE.response.count               = result.length
                customMessages.DEFAULT_MESSAGE.response.contato_emergencia  = result

                return customMessages.DEFAULT_MESSAGE
            } else
                return customMessages.ERROR_NOT_FOUND
        } else
            return customMessages.ERROR_INTERNAL_SERVER_MODEL
    } catch (error) {
        return customMessages.ERROR_INTERNAL_SERVER_CONTROLLER
    }
}

const buscarContatoEmergencia = async function (id) {
    let customMessages = JSON.parse(JSON.stringify(configMessages))

    try {
        const validarID = validarDados.validarIDs(id, customMessages)

        if (validarID) {
            return validarID
        } else {
            let result = await contatoEmergenciaDAO.getContatosEmergenciaByID(id)

            if (result) {
                if (result.length > 0) {
                    customMessages.DEFAULT_MESSAGE.status                       = customMessages.SUCCESS_RESPONSE.status
                    customMessages.DEFAULT_MESSAGE.status_code                  = customMessages.SUCCESS_RESPONSE.status_code
                    customMessages.DEFAULT_MESSAGE.response.contato_emergencia  = result

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

const excluirContatoEmergencia = async function (id) {
    let customMessages = JSON.parse(JSON.stringify(configMessages))

    try {
        let resultBuscarID = await buscarContatoEmergencia(id)

        if (resultBuscarID.status) {
            let result = await contatoEmergenciaDAO.deleteContatoEmergenciaByID(id)

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
    inserirNovoContatoEmergencia,
    atualizarContatoEmergencia,
    listarContatoEmergencia,
    buscarContatoEmergencia,
    excluirContatoEmergencia
}