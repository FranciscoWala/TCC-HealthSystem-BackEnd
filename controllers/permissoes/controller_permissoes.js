/*************************************************************************************************************************
 * Objetivo: Arquivo responsável pela manipulação de dados para realizar o CRUD de PERMISSOES
 * Autor: Kayque Brenno Ferreira Almeida
 * Data: 20/10/2026
 * Versão: 2.0
**************************************************************************************************************************/

// IMPORT DO ARQUIVO DE CONFIGURAÇÕES DE MENSAGENS DO PROJETO
const configMessages = require('../../utils/messages/configMessages.js')

// IMPORT DA SERVICE
const permissoesService = require('../../services/permissoes/service_permissoes.js')

const inserirNovaPermissao = async function (permissoes, contentType) {
    let customMessages = JSON.parse(JSON.stringify(configMessages))
    try {
        if (String(contentType).toUpperCase() == 'APPLICATION/JSON')
            return await permissoesService.inserirPermissaoService(permissoes)
        else
            return customMessages.ERROR_CONTENT_TYPE
    } catch (error) {
        return customMessages.ERROR_INTERNAL_SERVER_CONTROLLER
    }
}

const atualizarPermissao = async function (permissoes, id, contentType) {
    let customMessages = JSON.parse(JSON.stringify(configMessages))
    try {
        if (String(contentType).toUpperCase() == 'APPLICATION/JSON')
            return await permissoesService.atualizarPermissaoService(permissoes, id)
        else
            return customMessages.ERROR_CONTENT_TYPE
    } catch (error) {
        return customMessages.ERROR_INTERNAL_SERVER_CONTROLLER
    }
}

const listarPermissao = async function () {
    let customMessages = JSON.parse(JSON.stringify(configMessages))
    try {
        return await permissoesService.listarPermissaoService()
    } catch (error) {
        return customMessages.ERROR_INTERNAL_SERVER_CONTROLLER
    }
}

const buscarPermissao = async function (id) {
    let customMessages = JSON.parse(JSON.stringify(configMessages))
    try {
        return await permissoesService.buscarPermissaoService(id)
    } catch (error) {
        return customMessages.ERROR_INTERNAL_SERVER_CONTROLLER
    }
}

const excluirPermissao = async function (id) {
    let customMessages = JSON.parse(JSON.stringify(configMessages))
    try {
        return await permissoesService.excluirPermissaoService(id)
    } catch (error) {
        return customMessages.ERROR_INTERNAL_SERVER_CONTROLLER
    }
}

module.exports = {
    inserirNovaPermissao,
    atualizarPermissao,
    listarPermissao,
    buscarPermissao,
    excluirPermissao
}