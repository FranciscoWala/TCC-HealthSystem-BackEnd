
/*************************************************************************************************************************
 * Objetivo: Arquivo responsável pela validação, tratamento, manipulação de dados para realizar o CRUD de HISTORICO MEDICAMENTO
 * Autor: Kayque Brenno Ferreira Almeida
 * Data: 22/10/2026
 * Versão: 2.0
**************************************************************************************************************************/

// IMPORT DO ARQUIVO DE CONFIGURAÇÕES DE MENSAGENS DO PROJETO
const configMessages = require('../../utils/messages/configMessages.js')

// IMPORT DA SERVICE
const historicoMedicamentoService = require('../../services/historico_medicamento/service_historico_medicamento.js')
const horarioService = require('../../services/horarios/service_horarios.js')

const inserirNovoHistoricoMedicamento = async function (historicoMedicamento, contentType) {
    let customMessages = JSON.parse(JSON.stringify(configMessages))
    try {
        if (String(contentType).toUpperCase() == 'APPLICATION/JSON')
            return await historicoMedicamentoService.inserirHistoricoMedicamentoService(historicoMedicamento)
        else
            return customMessages.ERROR_CONTENT_TYPE
    } catch (error) {
        return customMessages.ERROR_INTERNAL_SERVER_CONTROLLER
    }
}

const atualizarHistoricoMedicamento = async function (historicoMedicamento, id, contentType) {
    let customMessages = JSON.parse(JSON.stringify(configMessages))
    try {
        if (String(contentType).toUpperCase() == 'APPLICATION/JSON')
            return await historicoMedicamentoService.atualizarHistoricoMedicamentoService(historicoMedicamento, id)
        else
            return customMessages.ERROR_CONTENT_TYPE
    } catch (error) {
        return customMessages.ERROR_INTERNAL_SERVER_CONTROLLER
    }
}

const listarHistoricoMedicamento = async function () {
    let customMessages = JSON.parse(JSON.stringify(configMessages))
    try {
        return await historicoMedicamentoService.listarHistoricoMedicamentoService()
    } catch (error) {
        return customMessages.ERROR_INTERNAL_SERVER_CONTROLLER
    }
}

const buscarHistoricoMedicamento = async function (id) {
    let customMessages = JSON.parse(JSON.stringify(configMessages))
    try {
        return await historicoMedicamentoService.buscarHistoricoMedicamentoService(id)
    } catch (error) {
        return customMessages.ERROR_INTERNAL_SERVER_CONTROLLER
    }
}


// Registrar automaticamente medicamentos não tomados
const registrarMedicamentosNaoTomados = async function () {
    let customMessages = JSON.parse(JSON.stringify(configMessages))

    try {
        let horarios = await horarioService.listarHorariosNaoTomadosService()

        if (!horarios.status)
            return horarios

        let quantidadeRegistrada = 0
        let quantidadeFalhas = 0

        for (let horario of horarios.response.horarios) {
            let dados = {
                hora_ingestao: null,
                id_paciente: horario.id_paciente,
                dosagem_ingerida: 0,
                id_horario: horario.id_horario,
                status_ingestao: 'NAO_TOMADO',
                horario_programado: horario.horario_programado,
                nome_medicamento: horario.nome_medicamento,
                concentracao: horario.concentracao,
                unidade_concentracao: horario.unidade_concentracao,
                tipo_dosagem: horario.tipo_dosagem
            }

            let result = await historicoMedicamentoService.inserirHistoricoMedicamentoService(dados)

            if (result.status) {
                quantidadeRegistrada++
            } else {
                quantidadeFalhas++

                console.log('Erro ao registrar medicamento:')
                console.log('ID do horário:', horario.id_horario)
                console.log('Dados enviados:', dados)
                console.log('Retorno da Service:', result)
            }
        }

        customMessages.DEFAULT_MESSAGE.status = customMessages.SUCCESS_RESPONSE.status
        customMessages.DEFAULT_MESSAGE.status_code = customMessages.SUCCESS_RESPONSE.status_code
        customMessages.DEFAULT_MESSAGE.response = {
            quantidadeRegistrada,
            quantidadeFalhas
        }

        return customMessages.DEFAULT_MESSAGE

    } catch (error) {
        return customMessages.ERROR_INTERNAL_SERVER_CONTROLLER
    }
}

const excluirHistoricoMedicamento = async function (id) {
    let customMessages = JSON.parse(JSON.stringify(configMessages))
    try {
        return await historicoMedicamentoService.excluirHistoricoMedicamentoService(id)
    } catch (error) {
        return customMessages.ERROR_INTERNAL_SERVER_CONTROLLER
    }
}

module.exports = {
    inserirNovoHistoricoMedicamento,
    atualizarHistoricoMedicamento,
    listarHistoricoMedicamento,
    buscarHistoricoMedicamento,
    registrarMedicamentosNaoTomados,
    excluirHistoricoMedicamento
}
