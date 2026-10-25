/*************************************************************************************************************************
 * Objetivo: Arquivo responsável pela manipulação de dados para realizar o CRUD de ESTOQUE
 * Autor: Kayque Brenno Ferreira Almeida
 * Data: 25/10/2026
 * Versão: 2.0
**************************************************************************************************************************/

// IMPORT DO ARQUIVO DE CONFIGURAÇÕES DE MENSAGENS DO PROJETO
const configMessages = require('../../utils/messages/configMessages.js')

// IMPORT DA SERVICE
const estoqueService = require('../../services/estoque/service_estoque.js')

const inserirNovoEstoque = async function (estoque, contentType) {
    let customMessages = JSON.parse(JSON.stringify(configMessages))
    try {
        if (String(contentType).toUpperCase() == 'APPLICATION/JSON')
            return await estoqueService.inserirEstoqueService(estoque)
        else
            return customMessages.ERROR_CONTENT_TYPE
    } catch (error) {
        return customMessages.ERROR_INTERNAL_SERVER_CONTROLLER
    }
}

const atualizarEstoque = async function (estoque, id, contentType) {
    let customMessages = JSON.parse(JSON.stringify(configMessages))
    try {
        if (String(contentType).toUpperCase() == 'APPLICATION/JSON')
            return await estoqueService.atualizarEstoqueService(estoque, id)
        else
            return customMessages.ERROR_CONTENT_TYPE
    } catch (error) {
        return customMessages.ERROR_INTERNAL_SERVER_CONTROLLER
    }
}

const listarEstoque = async function () {
    let customMessages = JSON.parse(JSON.stringify(configMessages))
    try {
        return await estoqueService.listarEstoqueService()
    } catch (error) {
        return customMessages.ERROR_INTERNAL_SERVER_CONTROLLER
    }
}

const buscarEstoque = async function (id) {
    let customMessages = JSON.parse(JSON.stringify(configMessages))
    try {
        return await estoqueService.buscarEstoqueService(id)
    } catch (error) {
        return customMessages.ERROR_INTERNAL_SERVER_CONTROLLER
    }
}

const excluirEstoque = async function (id) {
    let customMessages = JSON.parse(JSON.stringify(configMessages))
    try {
        return await estoqueService.excluirEstoqueService(id)
    } catch (error) {
        return customMessages.ERROR_INTERNAL_SERVER_CONTROLLER
    }
}

module.exports = {
    inserirNovoEstoque,
    atualizarEstoque,
    listarEstoque,
    buscarEstoque,
    excluirEstoque
}