
/*************************************************************************************************************************
 * Objetivo: Arquivo responsável pelas regras de negócio da alteração de programação de medicamentos
 * Autor: Kayque Brenno Ferreira Almeida
 * Data: 27/10/2026
 * Versão: 1.0
**************************************************************************************************************************/

// IMPORT DO ARQUIVO DE CONFIGURAÇÕES DE MENSAGENS DO PROJETO
const configMessages = require('../../utils/messages/configMessages.js')

// IMPORT DA SERVICE
const programacaoMedicamentoService = require('../../services/programacao_medicamento/service_programacao_medicamento.js')

// IMPORT DA FUNÇÃO DE NORMALIZAÇÃO DE DATAS
const normalizarDataUTC = require('../../utils/datas/normalizarDataUTC.js')

// IMPORT DA CONFIGURAÇÃO GLOBAL DO KNEX
const knexConection = require('../../models/global_knex/global_knex.js')

// Alterar a programação de um medicamento
const alterarProgramacaoMedicamento = async function (id, dados, contentType, transaction = null) {
    let customMessages = JSON.parse(JSON.stringify(configMessages))
    let erroTransacao = null

    try {
        if (String(contentType).toUpperCase() == 'APPLICATION/JSON') {

            let executarAlteracao = async function (connection) {

                let programacao = await programacaoMedicamentoService.buscarProgramacaoMedicamentoService(id, connection)

                if (!programacao.status) {
                    erroTransacao = programacao
                    throw new Error('ERRO_BUSCAR_PROGRAMACAO')
                }

                let programacaoAtual = programacao.response.programacao_medicamento[0]

                if (programacaoAtual.data_hora_fim != null) {
                    customMessages.ERROR_BAD_REQUEST.field = ['PROGRAMACAO_ENCERRADA']
                    erroTransacao = customMessages.ERROR_BAD_REQUEST
                    throw new Error('PROGRAMACAO_ENCERRADA')
                }

                let dataInicioFormatada = normalizarDataUTC(dados.data_hora_inicio)

                if (!dataInicioFormatada) {
                    customMessages.ERROR_BAD_REQUEST.field = ['DATA_HORA_INICIO']
                    erroTransacao = customMessages.ERROR_BAD_REQUEST
                    throw new Error('DATA_HORA_INICIO')
                }

                let dataInicio = new Date(dados.data_hora_inicio)
                let dataInicioAtual = new Date(programacaoAtual.data_hora_inicio)

                if (isNaN(dataInicioAtual.getTime()) ||
                    dataInicio <= dataInicioAtual || dataInicio <= new Date()) {

                    customMessages.ERROR_BAD_REQUEST.field = ['DATA_HORA_INICIO']
                    erroTransacao = customMessages.ERROR_BAD_REQUEST
                    throw new Error('DATA_HORA_INICIO')
                }

                let dadosAtualizacao = {
                    data_hora_fim: dataInicioFormatada
                }

                let resultadoAtualizacao = await programacaoMedicamentoService.atualizarProgramacaoMedicamentoService(dadosAtualizacao, id, connection)

                if (!resultadoAtualizacao.status) {
                    erroTransacao = resultadoAtualizacao
                    throw new Error('ERRO_ATUALIZAR_PROGRAMACAO')
                }

                // Criar uma nova programação para a mesma receita
                let novaProgramacao = {
                    frequencia: dados.frequencia,
                    data_hora_inicio: dataInicioFormatada,
                    data_hora_fim: null,
                    id_tipo_intervalo: dados.id_tipo_intervalo,
                    id_receita_medica: programacaoAtual.id_receita_medica
                }

                let resultadoInsercao = await programacaoMedicamentoService.inserirProgramacaoMedicamentoService(novaProgramacao, connection)

                if (!resultadoInsercao.status) {
                    erroTransacao = resultadoInsercao
                    throw new Error('ERRO_INSERIR_PROGRAMACAO')
                }

                return resultadoInsercao
            }

            if (transaction)
                return await executarAlteracao(transaction)
            else
                return await knexConection.transaction(executarAlteracao)

        } else {
            return customMessages.ERROR_CONTENT_TYPE
        }

    } catch (error) {
        if (erroTransacao)
            return erroTransacao

        console.log(error)
        return customMessages.ERROR_INTERNAL_SERVER_CONTROLLER
    }
}

module.exports = {
    alterarProgramacaoMedicamento
}