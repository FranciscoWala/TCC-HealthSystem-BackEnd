/**********************************************************************************************************************************
 * Objetivo: Arquivo responsável pela manipulação de dados para realizar o CRUD de CONTATOS DE EMERGÊNCIA USUARIO
 * Autor: Kayque Brenno Ferreira Almeida
 * Data: 25/10/2026
 * Versão: 2.0
***********************************************************************************************************************************/

// IMPORT DO ARQUIVO DE CONFIGURAÇÕES DE MENSAGENS DO PROJETO
const configMessages = require('../../utils/messages/configMessages.js')

// IMPORT DA SERVICE
const contatoEmergenciaUsuarioService = require('../../services/contato_emergencia_usuarios/service_contato_emergencia_usuarios.js')

const inserirNovoContatoEmergenciaUsuario = async function (contatoEmergenciaUsu, contentType) {
    let customMessages = JSON.parse(JSON.stringify(configMessages))
    try {
        if (String(contentType).toUpperCase() == 'APPLICATION/JSON')
            return await contatoEmergenciaUsuarioService.inserirContatoEmergenciaUsuarioService(contatoEmergenciaUsu)
        else
            return customMessages.ERROR_CONTENT_TYPE
    } catch (error) {
        return customMessages.ERROR_INTERNAL_SERVER_CONTROLLER
    }
}

const atualizarContatoEmergenciaUsuario = async function (contatoEmergenciaUsu, id, contentType) {
    let customMessages = JSON.parse(JSON.stringify(configMessages))
    try {
        if (String(contentType).toUpperCase() == 'APPLICATION/JSON')
            return await contatoEmergenciaUsuarioService.atualizarContatoEmergenciaUsuarioService(contatoEmergenciaUsu, id)
        else
            return customMessages.ERROR_CONTENT_TYPE
    } catch (error) {
        return customMessages.ERROR_INTERNAL_SERVER_CONTROLLER
    }
}

const listarContatoEmergenciaUsuario = async function () {
    let customMessages = JSON.parse(JSON.stringify(configMessages))
    try {
        return await contatoEmergenciaUsuarioService.listarContatoEmergenciaUsuarioService()
    } catch (error) {
        return customMessages.ERROR_INTERNAL_SERVER_CONTROLLER
    }
}

const buscarContatoEmergenciaUsuario = async function (id) {
    let customMessages = JSON.parse(JSON.stringify(configMessages))
    try {
        return await contatoEmergenciaUsuarioService.buscarContatoEmergenciaUsuarioService(id)
    } catch (error) {
        return customMessages.ERROR_INTERNAL_SERVER_CONTROLLER
    }
}

const excluirContatoEmergenciaUsuario = async function (id) {
    let customMessages = JSON.parse(JSON.stringify(configMessages))
    try {
        return await contatoEmergenciaUsuarioService.excluirContatoEmergenciaUsuarioService(id)
    } catch (error) {
        return customMessages.ERROR_INTERNAL_SERVER_CONTROLLER
    }
}

module.exports = {
    inserirNovoContatoEmergenciaUsuario,
    atualizarContatoEmergenciaUsuario,
    listarContatoEmergenciaUsuario,
    buscarContatoEmergenciaUsuario,
    excluirContatoEmergenciaUsuario
}