/*************************************************************************************************************************
 * Objetivo: Arquivo responsável pela manipulação de dados para realizar o CRUD de DOENÇAS CRONICAS USUARIO
 * Autor: Kayque Brenno Ferreira Almeida
 * Data: 25/10/2026
 * Versão: 2.0
**************************************************************************************************************************/

// IMPORT DO ARQUIVO DE CONFIGURAÇÕES DE MENSAGENS DO PROJETO
const configMessages = require('../../utils/messages/configMessages.js')

// IMPORT DA SERVICE
const doencaCronicaUsuarioService = require('../../services/doenca_cronica_usuario/service_doenca_cronica_usuario.js')

const inserirNovaDoencaCronicaUsuario = async function (doencaCronicaUsuario, contentType) {
    let customMessages = JSON.parse(JSON.stringify(configMessages))
    try {
        if (String(contentType).toUpperCase() == 'APPLICATION/JSON')
            return await doencaCronicaUsuarioService.inserirDoencaCronicaUsuarioService(doencaCronicaUsuario)
        else
            return customMessages.ERROR_CONTENT_TYPE
    } catch (error) {
        return customMessages.ERROR_INTERNAL_SERVER_CONTROLLER
    }
}

const atualizarDoencaCronicaUsuario = async function (doencaCronicaUsuario, id, contentType) {
    let customMessages = JSON.parse(JSON.stringify(configMessages))
    try {
        if (String(contentType).toUpperCase() == 'APPLICATION/JSON')
            return await doencaCronicaUsuarioService.atualizarDoencaCronicaUsuarioService(doencaCronicaUsuario, id)
        else
            return customMessages.ERROR_CONTENT_TYPE
    } catch (error) {
        return customMessages.ERROR_INTERNAL_SERVER_CONTROLLER
    }
}

const listarDoencaCronicaUsuario = async function () {
    let customMessages = JSON.parse(JSON.stringify(configMessages))
    try {
        return await doencaCronicaUsuarioService.listarDoencaCronicaUsuarioService()
    } catch (error) {
        return customMessages.ERROR_INTERNAL_SERVER_CONTROLLER
    }
}

const buscarDoencaCronicaUsuario = async function (id) {
    let customMessages = JSON.parse(JSON.stringify(configMessages))
    try {
        return await doencaCronicaUsuarioService.buscarDoencaCronicaUsuarioService(id)
    } catch (error) {
        return customMessages.ERROR_INTERNAL_SERVER_CONTROLLER
    }
}

const excluirDoencaCronicaUsuario = async function (id) {
    let customMessages = JSON.parse(JSON.stringify(configMessages))
    try {
        return await doencaCronicaUsuarioService.excluirDoencaCronicaUsuarioService(id)
    } catch (error) {
        return customMessages.ERROR_INTERNAL_SERVER_CONTROLLER
    }
}

module.exports = {
    inserirNovaDoencaCronicaUsuario,
    atualizarDoencaCronicaUsuario,
    listarDoencaCronicaUsuario,
    buscarDoencaCronicaUsuario,
    excluirDoencaCronicaUsuario
}