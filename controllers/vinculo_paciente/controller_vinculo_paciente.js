/*************************************************************************************************************************
 * Objetivo: Arquivo responsável pela manipulação de dados para realizar o CRUD de VINCULO PACIENTE
 * Autor: Kayque Brenno Ferreira Almeida
 * Data: 25/10/2026
 * Versão: 2.0
**************************************************************************************************************************/

// IMPORT DO ARQUIVO DE CONFIGURAÇÕES DE MENSAGENS DO PROJETO
const configMessages = require('../../utils/messages/configMessages.js')

// IMPORT DA SERVICE
const vinculoPacienteService = require('../../services/vinculo_paciente/service_vinculo_paciente.js')
const knexConection = require('../../models/global_knex/global_knex.js')

const buscarMeuCuidador = async function (idPaciente, roleUsuario) {
    let customMessages = JSON.parse(JSON.stringify(configMessages))

    try {
        if (Number(roleUsuario) != 2)
            return customMessages.ERROR_FORBIDDEN

        return await vinculoPacienteService.buscarVinculoPorIdPacienteService(idPaciente)

    } catch (error) {
        return customMessages.ERROR_INTERNAL_SERVER_CONTROLLER
    }
}

const buscarMeusPacientes = async function (idCuidador, roleUsuario) {
    let customMessages = JSON.parse(JSON.stringify(configMessages))

    try {
        if (Number(roleUsuario) != 1)
            return customMessages.ERROR_FORBIDDEN

        return await vinculoPacienteService.buscarVinculosPorIdCuidadorService(idCuidador)

    } catch (error) {
        return customMessages.ERROR_INTERNAL_SERVER_CONTROLLER
    }
}

const buscarVinculoPorPaciente = async function (idPaciente, idUsuario, roleUsuario) {
    let customMessages = JSON.parse(JSON.stringify(configMessages))

    try {
        let buscarVinculo = await vinculoPacienteService.buscarVinculoPorIdPacienteService(idPaciente)

        if (!buscarVinculo.status)
            return buscarVinculo

        let dadosVinculo = buscarVinculo.response.vinculo_paciente[0]

        if (Number(idUsuario) != Number(dadosVinculo.id_paciente)) {
            if (Number(roleUsuario) != 1 || Number(idUsuario) != Number(dadosVinculo.id_cuidador))
                return customMessages.ERROR_FORBIDDEN
        }

        return buscarVinculo

    } catch (error) {
        return customMessages.ERROR_INTERNAL_SERVER_CONTROLLER
    }
}

const encerrarVinculoPaciente = async function (idPaciente, idUsuario, roleUsuario) {
    let customMessages = JSON.parse(JSON.stringify(configMessages))

    try {
        let result = await knexConection.transaction(async function (transaction) {

            let usuarioBloqueado = await transaction('tbl_usuarios')
                .where('id', idPaciente)
                .forUpdate()
                .first()

            if (!usuarioBloqueado) {
                let error = new Error('PACIENTE NÃO ENCONTRADO')
                error.resposta = customMessages.ERROR_NOT_FOUND
                throw error
            }

            let buscarVinculo = await vinculoPacienteService.buscarVinculoPorIdPacienteService(idPaciente, transaction)

            if (!buscarVinculo.status) {
                let error = new Error('VÍNCULO NÃO ENCONTRADO')
                error.resposta = buscarVinculo
                throw error
            }

            let dadosVinculo = buscarVinculo.response.vinculo_paciente[0]

            if (Number(idUsuario) != Number(dadosVinculo.id_paciente)) {
                if (Number(roleUsuario) != 1 || Number(idUsuario) != Number(dadosVinculo.id_cuidador)) {
                    let error = new Error('USUÁRIO NÃO AUTORIZADO')
                    error.resposta = customMessages.ERROR_FORBIDDEN
                    throw error
                }
            }

            let excluirVinculo = await vinculoPacienteService.excluirVinculoPacienteService(dadosVinculo.id, transaction)

            if (!excluirVinculo.status) {
                let error = new Error('NÃO FOI POSSÍVEL EXCLUIR O VÍNCULO')
                error.resposta = excluirVinculo
                throw error
            }

            return excluirVinculo
        })

        return result

    } catch (error) {
        if (error.resposta)
            return error.resposta

        console.log(error)
        return customMessages.ERROR_INTERNAL_SERVER_CONTROLLER
    }
}

module.exports = {
    buscarMeuCuidador,
    buscarMeusPacientes,
    buscarVinculoPorPaciente,
    encerrarVinculoPaciente
}