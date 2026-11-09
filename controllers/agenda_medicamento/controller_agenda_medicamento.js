/*************************************************************************************************************************
 * Objetivo: Arquivo responsável pela geração da agenda de medicamentos
 * Autor: Kayque Brenno Ferreira Almeida
 * Data: 27/10/2026
 * Versão: 1.0
**************************************************************************************************************************/

const configMessages = require('../../utils/messages/configMessages.js')

const luxon = require('luxon')

const programacaoMedicamentoService = require('../../services/programacao_medicamento/service_programacao_medicamento.js')
const historicoMedicamentoService = require('../../services/historico_medicamento/service_historico_medicamento.js')

const validarDados = require('../../utils/validar_dados/validarDados.js')

// Gerar a agenda de medicamentos de um usuário
const gerarAgendaMedicamento = async function (idUsuario, data, fuso) {
    let customMessages = JSON.parse(JSON.stringify(configMessages))

    try {
        let validarID = validarDados.validarIDs(idUsuario, customMessages)

        if (validarID)
            return validarID

        // Validação da data
        if (!data || !/^\d{4}-\d{2}-\d{2}$/.test(data)) {
            customMessages.ERROR_BAD_REQUEST.field = ['DATA']
            return customMessages.ERROR_BAD_REQUEST
        }

        // Validação do fuso horário
        if (typeof fuso != 'string' || !luxon.DateTime.local().setZone(fuso).isValid) {
            customMessages.ERROR_BAD_REQUEST.field = ['FUSO']
            return customMessages.ERROR_BAD_REQUEST
        }

        let dataConsulta = luxon.DateTime.fromISO(data, { zone: fuso })

        if (!dataConsulta.isValid || dataConsulta.toISODate() != data) {
            customMessages.ERROR_BAD_REQUEST.field = ['DATA']
            return customMessages.ERROR_BAD_REQUEST
        }

        let programacoes = await programacaoMedicamentoService.buscarProgramacaoPorIdUsuarioService(idUsuario)

        if (!programacoes.status && programacoes.status_code != 404)
            return programacoes

        let listaProgramacoes = programacoes.status ? programacoes.response.programacao_medicamento : []

        let agenda = []
        let historicos = []

        let inicioDia = dataConsulta.startOf('day').toUTC().toJSDate()

        let fimDia = dataConsulta.plus({ days: 1 }).startOf('day').toUTC().toJSDate()

        // Buscar os históricos dos medicamentos do paciente
        let historico = await historicoMedicamentoService.buscarHistoricoPorIdPacienteService(idUsuario)

        if (!historico.status && historico.status_code != 404)
            return historico

        if (historico.status)
            historicos = historico.response.historico_medicamento

        // Horário atual para verificar o status dos medicamentos
        let horaAtual = new Date()

        // Verificar se a data consultada é anterior ao dia atual
        let dataAtual = luxon.DateTime.fromJSDate(horaAtual).setZone(fuso).toISODate()

        let diaAnterior = data < dataAtual

        // Gerar os horários das programações somente para o dia atual ou futuro
        if (!diaAnterior) {
            for (let programacao of listaProgramacoes) {
                let dataInicio = new Date(programacao.data_hora_inicio)
                let dataFim = programacao.data_hora_fim ? new Date(programacao.data_hora_fim) : null

                let intervalo = 0

                if (String(programacao.tipo_intervalo).toUpperCase() == 'HORA')
                    intervalo = Number(programacao.frequencia) * 60 * 60 * 1000

                else if (String(programacao.tipo_intervalo).toUpperCase() == 'DIA')
                    intervalo = Number(programacao.frequencia) * 24 * 60 * 60 * 1000

                // Verificar se a programação possui dados válidos
                if (Number.isFinite(intervalo) && intervalo > 0 &&
                    !isNaN(dataInicio.getTime()) &&
                    (!dataFim || !isNaN(dataFim.getTime()))) {

                    // Encontrar o primeiro horário do dia
                    let horario = new Date(dataInicio)

                    if (horario < inicioDia) {
                        let diferenca = inicioDia.getTime() - dataInicio.getTime()
                        let quantidade = Math.ceil(diferenca / intervalo)

                        horario = new Date(dataInicio.getTime() + quantidade * intervalo)
                    }

                    // Verificar se a programação foi substituída no dia consultado
                    let substituidaHoje = dataFim && listaProgramacoes.some(function (outraProgramacao) {
                        let inicioOutra = new Date(outraProgramacao.data_hora_inicio)

                        return Number(outraProgramacao.id_receita_medica) == Number(programacao.id_receita_medica) &&
                            Number(outraProgramacao.id_programacao_medicamento) != Number(programacao.id_programacao_medicamento) &&
                            inicioOutra.getTime() > dataInicio.getTime() &&
                            luxon.DateTime.fromJSDate(inicioOutra).setZone(fuso).toISODate() == data
                    })


                    // Gerar os horários da programação
                    while (horario < fimDia && (!dataFim || horario < dataFim)) {
                        if (horario >= inicioDia) {
                            let horarioFormatado = horario.toISOString()

                            // Verificar se o medicamento já foi tomado
                            let confirmado = historicos.some(function (historico) {
                                return Number(historico.id_receita_medica) == Number(programacao.id_receita_medica) &&
                                    new Date(historico.horario_programado).getTime() == horario.getTime()
                            })

                            // Adicionar somente doses não confirmadas da programação
                            if (!substituidaHoje && !confirmado) {
                                let status = 'PENDENTE'

                                if (horario < horaAtual)
                                    status = 'ATRASADO'

                                agenda.push({
                                    id_programacao_medicamento: programacao.id_programacao_medicamento,
                                    id_receita_medica: programacao.id_receita_medica,
                                    id_medicamento: programacao.id_medicamento,
                                    nome_medicamento: programacao.nome_medicamento,
                                    dosagem: programacao.dosagem,
                                    horario_programado: horarioFormatado,
                                    confirmado: false,
                                    status: status
                                })
                            }
                        }

                        horario = new Date(horario.getTime() + intervalo)
                    }
                }
            }
        }

        // Adicionar os medicamentos tomados na agenda
        for (let historico of historicos) {
            let horarioHistorico = new Date(historico.horario_programado)

            // Verificar se o medicamento foi programado para o dia consultado
            if (!isNaN(horarioHistorico.getTime()) &&
                horarioHistorico >= inicioDia &&
                horarioHistorico < fimDia) {

                agenda.push({
                    id_historico_medicamento: historico.id_historico_medicamento,
                    id_programacao_medicamento: null,
                    id_receita_medica: historico.id_receita_medica,
                    id_medicamento: null,
                    nome_medicamento: historico.nome_medicamento,
                    concentracao: historico.concentracao,
                    unidade_concentracao: historico.unidade_concentracao,
                    tipo_dosagem: historico.tipo_dosagem,
                    dosagem: historico.dosagem_ingerida,
                    horario_programado: horarioHistorico.toISOString(),
                    confirmado: true,
                    status: 'TOMADO'
                })
            }
        }

        // Organizar os medicamentos por horário
        agenda.sort(function (a, b) {
            return a.horario_programado.localeCompare(b.horario_programado)
        })

        let dataFormatada = dataConsulta.toFormat('dd/MM/yyyy')

        customMessages.DEFAULT_MESSAGE.status = customMessages.SUCCESS_RESPONSE.status
        customMessages.DEFAULT_MESSAGE.status_code = customMessages.SUCCESS_RESPONSE.status_code
        customMessages.DEFAULT_MESSAGE.message = customMessages.SUCCESS_RESPONSE.message
        customMessages.DEFAULT_MESSAGE.response = {
            data: dataFormatada,
            count: agenda.length,
            agenda: agenda
        }

        return customMessages.DEFAULT_MESSAGE
    } catch (error) {
        console.log(error)
        return customMessages.ERROR_INTERNAL_SERVER_CONTROLLER
    }
}

module.exports = {
    gerarAgendaMedicamento
}