/*************************************************************************************************************************
 * Objetivo: Arquivo responsável pela manipulação de dados para realizar o CRUD do MEDICAMENTO
 * Autor: Kayque Brenno Ferreira Almeida
 * Data: 20/10/2026
 * Versão: 2.0
**************************************************************************************************************************/

// IMPORT DO ARQUIVO DE CONFIGURAÇÕES DE MENSAGENS DO PROJETO
const configMessages = require('../../utils/messages/configMessages.js')

// IMPORT DA SERVICE
const programacaoMedicamentoService = require('../../services/programacao_medicamento/service_programacao_medicamento.js')

const inserirNovaProgramacaoMedicamento = async function (programacaoMedicamento, contentType) {
    let customMessages = JSON.parse(JSON.stringify(configMessages))
    try {
        if (String(contentType).toUpperCase() == 'APPLICATION/JSON')
            return await programacaoMedicamentoService.inserirProgramacaoMedicamentoService(programacaoMedicamento)
        else
            return customMessages.ERROR_CONTENT_TYPE
    } catch (error) {
        return customMessages.ERROR_INTERNAL_SERVER_CONTROLLER
    }
}

const atualizarProgramacaoMedicamento = async function (programacaoMedicamento, id, contentType) {
    let customMessages = JSON.parse(JSON.stringify(configMessages))
    try {
        if (String(contentType).toUpperCase() == 'APPLICATION/JSON')
            return await programacaoMedicamentoService.atualizarProgramacaoMedicamentoService(programacaoMedicamento, id)
        else
            return customMessages.ERROR_CONTENT_TYPE
    } catch (error) {
        return customMessages.ERROR_INTERNAL_SERVER_CONTROLLER
    }
}

const listarProgramacaoMedicamento = async function (idUsuario) {
    let customMessages = JSON.parse(JSON.stringify(configMessages))
    try {
        return await programacaoMedicamentoService.listarProgramacaoMedicamentoService(idUsuario)
    } catch (error) {
        return customMessages.ERROR_INTERNAL_SERVER_CONTROLLER
    }
}

const buscarProgramacaoMedicamento = async function (id) {
    let customMessages = JSON.parse(JSON.stringify(configMessages))
    try {
        return await programacaoMedicamentoService.buscarProgramacaoMedicamentoService(id)
    } catch (error) {
        return customMessages.ERROR_INTERNAL_SERVER_CONTROLLER
    }
}

const buscarProgramacaoMedicamentoPorIdReceita = async function (idReceita) {
    let customMessages = JSON.parse(JSON.stringify(configMessages))
    try {
        return await programacaoMedicamentoService.buscarProgramacaoPorIdReceitaService(idReceita)
    } catch (error) {
        return customMessages.ERROR_INTERNAL_SERVER_CONTROLLER
    }
}

const buscarProgramacaoMedicamentoPorIdUsuario = async function (idUsuario) {
    let customMessages = JSON.parse(JSON.stringify(configMessages))
    try {
        return await programacaoMedicamentoService.buscarProgramacaoPorIdUsuarioService(idUsuario)
    } catch (error) {
        return customMessages.ERROR_INTERNAL_SERVER_CONTROLLER
    }
}

const excluirProgramacaoMedicamento = async function (id, idUsuario) {
    let customMessages = JSON.parse(JSON.stringify(configMessages))
    try {
        return await programacaoMedicamentoService.excluirMedicamentoService(id, idUsuario)
    } catch (error) {
        return customMessages.ERROR_INTERNAL_SERVER_CONTROLLER
    }
}

module.exports = {
    inserirNovaProgramacaoMedicamento,
    atualizarProgramacaoMedicamento,
    listarProgramacaoMedicamento,
    buscarProgramacaoMedicamento,
    buscarProgramacaoMedicamentoPorIdReceita,
    buscarProgramacaoMedicamentoPorIdUsuario,
    excluirProgramacaoMedicamento
}