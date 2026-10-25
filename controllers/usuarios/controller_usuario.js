/*************************************************************************************************************************
 * Objetivo: Arquivo responsável pela manipulação de dados para realizar o CRUD de USUARIOS
 * Autor: Kayque Brenno Ferreira Almeida
 * Data: 25/10/2026
 * Versão: 2.0
**************************************************************************************************************************/

// IMPORT DO ARQUIVO DE CONFIGURAÇÕES DE MENSAGENS DO PROJETO
const configMessages = require('../../utils/messages/configMessages.js')

// IMPORT DA SERVICE
const usuarioService = require('../../services/usuarios/service_usuario.js')

const inserirNovoUsuario = async function (usuario, contentType) {
    let customMessages = JSON.parse(JSON.stringify(configMessages))
    try {
        if (String(contentType).toUpperCase() == 'APPLICATION/JSON')
            return await usuarioService.inserirUsuarioService(usuario)
        else
            return customMessages.ERROR_CONTENT_TYPE
    } catch (error) {
        return customMessages.ERROR_INTERNAL_SERVER_CONTROLLER
    }
}

const atualizarUsuario = async function (usuario, id, contentType) {
    let customMessages = JSON.parse(JSON.stringify(configMessages))
    try {
        if (String(contentType).toUpperCase() == 'APPLICATION/JSON')
            return await usuarioService.atualizarUsuarioService(usuario, id)
        else
            return customMessages.ERROR_CONTENT_TYPE
    } catch (error) {
        return customMessages.ERROR_INTERNAL_SERVER_CONTROLLER
    }
}

const listarUsuario = async function () {
    let customMessages = JSON.parse(JSON.stringify(configMessages))
    try {
        return await usuarioService.listarUsuarioService()
    } catch (error) {
        return customMessages.ERROR_INTERNAL_SERVER_CONTROLLER
    }
}

const listarDadosUsuario = async function () {
    let customMessages = JSON.parse(JSON.stringify(configMessages))
    try {
        return await usuarioService.listarDadosUsuariosService()
    } catch (error) {
        return customMessages.ERROR_INTERNAL_SERVER_CONTROLLER
    }
}

const buscarUsuario = async function (id) {
    let customMessages = JSON.parse(JSON.stringify(configMessages))
    try {
        return await usuarioService.buscarUsuarioService(id)
    } catch (error) {
        return customMessages.ERROR_INTERNAL_SERVER_CONTROLLER
    }
}

const buscarUsuarioPorEmail = async function (email) {
    let customMessages = JSON.parse(JSON.stringify(configMessages))
    try {
        return await usuarioService.buscarUsuarioPorEmailService(email)
    } catch (error) {
        return customMessages.ERROR_INTERNAL_SERVER_CONTROLLER
    }
}

const excluirUsuario = async function (id) {
    let customMessages = JSON.parse(JSON.stringify(configMessages))
    try {
        return await usuarioService.excluirUsuarioService(id)
    } catch (error) {
        return customMessages.ERROR_INTERNAL_SERVER_CONTROLLER
    }
}

module.exports = {
    inserirNovoUsuario,
    atualizarUsuario,
    listarUsuario,
    listarDadosUsuario,
    buscarUsuario,
    buscarUsuarioPorEmail,
    excluirUsuario
}