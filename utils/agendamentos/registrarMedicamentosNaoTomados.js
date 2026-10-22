/**
 *  Arquivo responnsável pelo históricos de medicamentos tomado
 * 
 * Autor: Kayque Brenno Ferreira Almeida
 */

// IMPORT DA CONTROLLER
const historicoMedicamentoController = require('../../controllers/historico_medicamento/controller_historico_medicamento.js')

// Executar o registro automático
const registrarMedicamentosNaoTomados = async function () {
    try {
        console.log('Verificando medicamentos não tomados...')

        let result = await historicoMedicamentoController.registrarMedicamentosNaoTomados()

        if (!result.status)
            console.log('Erro ao registrar medicamentos não tomados:', result)
        else
            console.log('Verificação concluída:', result.response)

    } catch (error) {
        console.log(error)
    }
}

// Iniciar verificação automática
const iniciarVerificacaoMedicamentos = function () {
    // Executa ao iniciar e depois a cada minuto
    registrarMedicamentosNaoTomados()

    setInterval(registrarMedicamentosNaoTomados, 60000)
}

module.exports = {
    iniciarVerificacaoMedicamentos
}