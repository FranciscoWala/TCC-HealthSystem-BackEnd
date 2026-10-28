
/*************************************************************************************************************************
 * Objetivo: Arquivo responsável pela geração da agenda de medicamentos
 * Autor: Kayque Brenno Ferreira Almeida
 * Data: 27/10/2026
 * Versão: 1.0
**************************************************************************************************************************/

const configMessages = require('../../utils/messages/configMessages.js')

const programacaoMedicamentoService = require('../../services/programacao_medicamento/service_programacao_medicamento.js')
const historicoMedicamentoService = require('../../services/historico_medicamento/service_historico_medicamento.js')

const validarDados = require('../../utils/validar_dados/validarDados.js')

// Gerar a agenda de medicamentos de um usuário
const gerarAgendaMedicamento = async function (idUsuario, data) {
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

        let dataConsulta = new Date(data + 'T00:00:00')

        if (isNaN(dataConsulta.getTime()) || dataConsulta.getFullYear() != Number(data.substring(0, 4)) ||
            dataConsulta.getMonth() + 1 != Number(data.substring(5, 7)) || dataConsulta.getDate() != Number(data.substring(8, 10))) {
            customMessages.ERROR_BAD_REQUEST.field = ['DATA']
            return customMessages.ERROR_BAD_REQUEST
        }

        // Buscar as programações do usuário
        let programacoes = await programacaoMedicamentoService.buscarProgramacaoPorIdUsuarioService(idUsuario)

        if (!programacoes.status && programacoes.status_code != 404)
            return programacoes

        let listaProgramacoes = programacoes.status ? programacoes.response.programacao_medicamento : []

        let agenda = []
        let historicos = []

        let inicioDia = new Date(dataConsulta)

        let fimDia = new Date(dataConsulta)
        fimDia.setDate(fimDia.getDate() + 1)

        // Buscar os históricos dos medicamentos
        let receitasConsultadas = []

        for (let programacao of listaProgramacoes) {
            if (!receitasConsultadas.includes(programacao.id_receita_medica)) {
                let historico = await historicoMedicamentoService.buscarHistoricoPorIdReceitaService(programacao.id_receita_medica)

                if (!historico.status && historico.status_code != 404)
                    return historico

                if (historico.status) {
                    for (let registro of historico.response.historico_medicamento)
                        historicos.push(registro)
                }

                receitasConsultadas.push(programacao.id_receita_medica)
            }
        }

        // Percorrer as programações
        for (let programacao of listaProgramacoes) {
            let dataInicio = new Date(programacao.data_hora_inicio)
            let dataFim = programacao.data_hora_fim ? new Date(programacao.data_hora_fim) : null

            let intervalo = 0

            // Verificar o tipo de intervalo
            if (String(programacao.tipo_intervalo).toUpperCase() == 'HORA')
                intervalo = Number(programacao.frequencia) * 60 * 60 * 1000

            else if (String(programacao.tipo_intervalo).toUpperCase() == 'DIA')
                intervalo = Number(programacao.frequencia) * 24 * 60 * 60 * 1000

            if (intervalo <= 0 || isNaN(dataInicio.getTime()) ||
                (dataFim && isNaN(dataFim.getTime())))
                continue

            // Encontrar o primeiro horário do dia
            let horario = new Date(dataInicio)

            if (horario < inicioDia) {
                let diferenca = inicioDia.getTime() - dataInicio.getTime()
                let quantidade = Math.ceil(diferenca / intervalo)

                horario = new Date(dataInicio.getTime() + quantidade * intervalo)
            }

            // Gerar os horários da programação
            while (horario < fimDia && (!dataFim || horario < dataFim)) {
                if (horario >= inicioDia) {
                    let ano = horario.getFullYear()
                    let mes = String(horario.getMonth() + 1).padStart(2, '0')
                    let dia = String(horario.getDate()).padStart(2, '0')
                    let hora = String(horario.getHours()).padStart(2, '0')
                    let minuto = String(horario.getMinutes()).padStart(2, '0')
                    let segundo = String(horario.getSeconds()).padStart(2, '0')

                    let horarioFormatado = `${ano}-${mes}-${dia} ${hora}:${minuto}:${segundo}`

                    // Verificar se o medicamento já foi tomado
                    let confirmado = historicos.some(function (historico) {
                        return Number(historico.id_receita_medica) == Number(programacao.id_receita_medica) &&
                            new Date(historico.horario_programado).getTime() == horario.getTime()
                    })

                    agenda.push({
                        id_programacao_medicamento: programacao.id_programacao_medicamento,
                        id_receita_medica: programacao.id_receita_medica,
                        id_medicamento: programacao.id_medicamento,
                        nome_medicamento: programacao.nome_medicamento,
                        dosagem: programacao.dosagem,
                        horario_programado: horarioFormatado,
                        confirmado: confirmado
                    })
                }

                horario = new Date(horario.getTime() + intervalo)
            }
        }

        // Organizar os medicamentos por horário
        agenda.sort(function (a, b) {
            return a.horario_programado.localeCompare(b.horario_programado)
        })

        let dataFormatada = dataConsulta.toLocaleDateString('pt-BR')

        // Retorno da agenda
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