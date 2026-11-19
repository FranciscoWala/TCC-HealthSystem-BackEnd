/*************************************************************************************************************************
 * Objetivo: Arquivo responsável pela confirmação de ingestão de medicamentos
 * Autor: Kayque Brenno Ferreira Almeida
 * Data: 26/10/2026
 * Versão: 1.0
**************************************************************************************************************************/

const configMessages = require('../../utils/messages/configMessages.js')

const receitaMedicaService = require('../../services/receita_medica/service_receita_medica.js')
const programacaoMedicamentoService = require('../../services/programacao_medicamento/service_programacao_medicamento.js')
const historicoMedicamentoService = require('../../services/historico_medicamento/service_historico_medicamento.js')
const estoqueService = require('../../services/estoque/service_estoque.js')
const vinculoPacienteService = require('../../services/vinculo_paciente/service_vinculo_paciente.js')

const knexConection = require('../../models/global_knex/global_knex.js')

const confirmarIngestaoMedicamento = async function (idReceitaMedica, idUsuario, horarioProgramado) {
    let customMessages = JSON.parse(JSON.stringify(configMessages))
    let erroTransacao = null

    try {
        let result = await knexConection.transaction(async function (transaction) {
            let receita = await receitaMedicaService.buscarReceitaMedicaService(idReceitaMedica, transaction)

            if (!receita.status)
                return receita

            let dadosReceita = receita.response.receita_medica[0]


            if (Number(dadosReceita.id_usuario) != Number(idUsuario)) {
                let buscarVinculo = await vinculoPacienteService.buscarVinculoPorIdPacienteService(
                    dadosReceita.id_usuario,
                    transaction
                )

                if (!buscarVinculo.status) {
                    if (buscarVinculo.status_code == 404) {
                        customMessages.ERROR_FORBIDDEN.field = ['ID_USUARIO']
                        return customMessages.ERROR_FORBIDDEN
                    }

                    return buscarVinculo
                }

                let dadosVinculo = buscarVinculo.response.vinculo_paciente[0]

                if (!dadosVinculo ||
                    Number(dadosVinculo.id_paciente) != Number(dadosReceita.id_usuario) ||
                    Number(dadosVinculo.id_cuidador) != Number(idUsuario)) {

                    customMessages.ERROR_FORBIDDEN.field = ['ID_USUARIO']
                    return customMessages.ERROR_FORBIDDEN
                }
            }


            let programacoes = await programacaoMedicamentoService.buscarProgramacaoPorIdReceitaService(idReceitaMedica, transaction)

            if (!programacoes.status)
                return programacoes

            let formatoISO = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?(?:Z|[+-]\d{2}:\d{2})$/i

            if (typeof horarioProgramado != 'string' || !formatoISO.test(horarioProgramado)) {
                customMessages.ERROR_BAD_REQUEST.field = ['HORARIO_PROGRAMADO']
                return customMessages.ERROR_BAD_REQUEST
            }

            let dataHorario = new Date(horarioProgramado)

            if (isNaN(dataHorario.getTime())) {
                customMessages.ERROR_BAD_REQUEST.field = ['HORARIO_PROGRAMADO']
                return customMessages.ERROR_BAD_REQUEST
            }

            let horaAtual = new Date()

            let toleranciaAntecipacao = 30 * 60 * 1000

            let horarioLiberacao = new Date(
                dataHorario.getTime() - toleranciaAntecipacao
            )

            if (horaAtual < horarioLiberacao) {
                customMessages.ERROR_BAD_REQUEST.field = ['HORARIO_PROGRAMADO']
                return customMessages.ERROR_BAD_REQUEST
            }

            let horarioValido = false

            for (let programacao of programacoes.response.programacao_medicamento) {
                let dataInicio = new Date(programacao.data_hora_inicio)
                let dataFim = programacao.data_hora_fim ? new Date(programacao.data_hora_fim) : null

                if (dataHorario >= dataInicio && (!dataFim || dataHorario < dataFim)) {
                    let intervalo = 0

                    if (String(programacao.tipo_intervalo).toUpperCase() == 'HORA')
                        intervalo = programacao.frequencia * 60 * 60 * 1000
                    else if (String(programacao.tipo_intervalo).toUpperCase() == 'DIA')
                        intervalo = programacao.frequencia * 24 * 60 * 60 * 1000

                    let diferenca = dataHorario.getTime() - dataInicio.getTime()

                    if (intervalo > 0 && diferenca % intervalo == 0) {
                        horarioValido = true
                        break
                    }
                }
            }

            if (!horarioValido) {
                customMessages.ERROR_BAD_REQUEST.field = ['HORARIO_PROGRAMADO']
                return customMessages.ERROR_BAD_REQUEST
            }

            let historico = await historicoMedicamentoService.buscarHistoricoPorIdReceitaService(idReceitaMedica, transaction)

            if (!historico.status && historico.status_code != 404)
                return historico

            let registros = historico.status ? historico.response.historico_medicamento : []

            let ingestaoConfirmada = registros.some(function (registro) {
                return new Date(registro.horario_programado).getTime() == dataHorario.getTime()
            })

            if (ingestaoConfirmada) {
                customMessages.ERROR_BAD_REQUEST.field = ['HORARIO_JA_CONFIRMADO']
                return customMessages.ERROR_BAD_REQUEST
            }

            let dadosHistorico = {
                hora_ingestao: new Date(),
                id_paciente: dadosReceita.id_usuario,
                id_receita_medica: dadosReceita.id_receita_medica,
                dosagem_ingerida: dadosReceita.dosagem,
                horario_programado: dataHorario,
                nome_medicamento: dadosReceita.nome_medicamento,
                concentracao: dadosReceita.concentracao,
                unidade_concentracao: dadosReceita.sigla_embalagem,
                tipo_dosagem: dadosReceita.tipo_dosagem
            }

            let resultadoHistorico = await historicoMedicamentoService.inserirHistoricoMedicamentoService(dadosHistorico, transaction)

            if (!resultadoHistorico.status) {
                erroTransacao = resultadoHistorico
                throw new Error('ERRO_HISTORICO')
            }

            let resultadoEstoque = await estoqueService.descontarEstoqueService(
                dadosReceita.id_estoque,
                dadosReceita.dosagem,
                transaction
            )

            if (!resultadoEstoque.status) {
                erroTransacao = resultadoEstoque
                throw new Error('ERRO_ESTOQUE')
            }

            return resultadoHistorico
        })

        return result

    } catch (error) {
        if (erroTransacao)
            return erroTransacao

        console.log(error)
        return customMessages.ERROR_INTERNAL_SERVER_CONTROLLER
    }
}

module.exports = {
    confirmarIngestaoMedicamento
}