/*************************************************************************************************************************
 * Objetivo: Arquivo responsável pela manipulação de dados para realizar o CRUD de USUARIO
 * Autor: Samuel Silva Moreira Dos Santos
 * Data: 23/10/2026
 * Versão: 1.0
**************************************************************************************************************************/

// IMPORT DO ARQUIVO DE CONFIGURAÇÕES DE MENSAGENS DO PROJETO
const configMessages = require('../../utils/messages/configMessages.js')
const usuarioService = require('../../services/usuarios/service_usuario.js')

async function inserirNovoUsuario(usuario, contentType) {
    let customMessages = JSON.parse(JSON.stringify(configMessages))

    try {
        if (String(contentType).toUpperCase() === 'APPLICATION/JSON')
            return await usuarioService.inserirUsuarioService(usuario)
        else
            return customMessages.ERROR_CONTENT_TYPE
    } catch (error) {
        console.log(error)
        return customMessages.ERROR_INTERNAL_SERVER_CONTROLLER
    }
}

async function atualizarUsuario(usuario, id, contentType) {
    let customMessages = JSON.parse(JSON.stringify(configMessages))

    try {
        if (String(contentType).toUpperCase() == 'APPLICATION/JSON')
            return await usuarioService.atualizarUsuarioService(usuario, id)
        else
            return customMessages.ERROR_CONTENT_TYPE
    } catch (error) {
        console.log(error)
        return customMessages.ERROR_INTERNAL_SERVER_CONTROLLER
    }
}

async function listarUsuario() {
    let customMessages = JSON.parse(JSON.stringify(configMessages))

    try {
        return await usuarioService.listarUsuarioService()
    } catch (error) {
        console.log(error)
        return customMessages.ERROR_INTERNAL_SERVER_CONTROLLER
    }
}

async function buscarUsuario(id) {
    let customMessages = JSON.parse(JSON.stringify(configMessages))

    try {
        return await usuarioService.buscarUsuarioService(id)
    } catch (error) {
        console.log(error)
        return customMessages.ERROR_INTERNAL_SERVER_CONTROLLER
    }
}

async function buscarDadosUsuario(id) {
    let customMessages = JSON.parse(JSON.stringify(configMessages))

    try {
        return await usuarioService.listarDadosUsuariosService(id)
    } catch (error) {
        console.log(error)
        return customMessages.ERROR_INTERNAL_SERVER_CONTROLLER
    }
}

async function excluirUsuario(id) {
    let customMessages = JSON.parse(JSON.stringify(configMessages))

    try {
        return await usuarioService.excluirUsuarioService(id)
    } catch (error) {
        console.log(error)
        return customMessages.ERROR_INTERNAL_SERVER_CONTROLLER
    }
}

//IMPLEMENTAR EM AUTENTICARLOGIN
async function buscarUsuarioPorEmail(email) {
    let customMessages = JSON.parse(JSON.stringify(configMessages))

    try {
        return await usuarioService.buscarUsuarioPorEmailService(email)
    } catch (error) {
        console.log(error)
        return customMessages.ERROR_INTERNAL_SERVER_CONTROLLER
    }
}

module.exports = {
    inserirNovoUsuario,
    atualizarUsuario,
    listarUsuario,
    buscarUsuario,
    buscarDadosUsuario,
    buscarUsuarioPorEmail,
    excluirUsuario
}