
/*************************************************************************************************************************
 * Objetivo: Arquivo responsável pela validação, tratamento, manipulação de dados para realizar o CRUD de HORÁRIOS
 * Autor: Kayque Brenno Ferreira Almeida
 * Data: 22/10/2026
 * Versão: 1.0
**************************************************************************************************************************/

// IMPORT DO ARQUIVO DE CONFIGURAÇÕES DE MENSAGENS DO PROJETO
const configMessages = require('../../utils/messages/configMessages.js')

// IMPORT DA SERVICE
const horarioService = require('../../services/horarios/service_horarios.js')

// Inserir um novo horário
const inserirNovoHorario = async function (horario, contentType) {
    let customMessages = JSON.parse(JSON.stringify(configMessages))

    try {
        if (String(contentType).toUpperCase() == 'APPLICATION/JSON') {
            let result = await horarioService.inserirHorarioService(horario)

            return result
        } else {
            return customMessages.ERROR_CONTENT_TYPE
        }
    } catch (error) {
        return customMessages.ERROR_INTERNAL_SERVER_CONTROLLER
    }
}

// Atualizar um horário
const atualizarHorario = async function (horario, id, contentType) {
    let customMessages = JSON.parse(JSON.stringify(configMessages))

    try {
        if (String(contentType).toUpperCase() == 'APPLICATION/JSON') {
            let result = await horarioService.atualizarHorarioService(horario, id)

            return result
        } else {
            return customMessages.ERROR_CONTENT_TYPE
        }
    } catch (error) {
        return customMessages.ERROR_INTERNAL_SERVER_CONTROLLER
    }
}

// Listar todos os horários
const listarHorario = async function () {
    let customMessages = JSON.parse(JSON.stringify(configMessages))

    try {
        let result = await horarioService.listarHorarioService()

        return result
    } catch (error) {
        return customMessages.ERROR_INTERNAL_SERVER_CONTROLLER
    }
}

// Buscar horário pelo ID
const buscarHorario = async function (id) {
    let customMessages = JSON.parse(JSON.stringify(configMessages))

    try {
        let result = await horarioService.buscarHorarioService(id)

        return result
    } catch (error) {
        return customMessages.ERROR_INTERNAL_SERVER_CONTROLLER
    }
}

// Listar horários de medicamentos não tomados
const listarHorariosNaoTomados = async function () {
    let customMessages = JSON.parse(JSON.stringify(configMessages))

    try {
        let result = await horarioService.listarHorariosNaoTomadosService()

        return result
    } catch (error) {
        return customMessages.ERROR_INTERNAL_SERVER_CONTROLLER
    }
}

// Excluir um horário
const excluirHorario = async function (id) {
    let customMessages = JSON.parse(JSON.stringify(configMessages))

    try {
        let result = await horarioService.excluirHorarioService(id)

        return result
    } catch (error) {
        return customMessages.ERROR_INTERNAL_SERVER_CONTROLLER
    }
}

module.exports = {
    inserirNovoHorario,
    atualizarHorario,
    listarHorario,
    buscarHorario,
    listarHorariosNaoTomados,
    excluirHorario
}
