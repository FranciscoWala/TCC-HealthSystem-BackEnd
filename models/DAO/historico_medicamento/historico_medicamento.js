/*******************************************************************************************
 * Objetivo: Arquivo responsável pelo CRUD de dados da tabela de HORARIO_MEDICAMENTO no 
 *  banco de dados MySQL
 *          
 * Data: 06/10/2026
 * Autor: Samuel Silva Moreira Dos Santos
 * Versão: 1.0
********************************************************************************************/

const knexConection = require('../../global_knex/global_knex.js')

const insertHistoricoMedicamento = async function (historicoMedicamento, transaction = null) {
    try {
        let connection = transaction || knexConection

        let sql = `call procHistoricoMedicamento(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`

        let result = await connection.raw(sql, [
            'INSERT',
            historicoMedicamento.hora_ingestao,
            historicoMedicamento.id_paciente,
            historicoMedicamento.id_receita_medica,
            historicoMedicamento.dosagem_ingerida,
            historicoMedicamento.horario_programado,
            historicoMedicamento.nome_medicamento,
            historicoMedicamento.concentracao,
            historicoMedicamento.unidade_concentracao,
            historicoMedicamento.tipo_dosagem,
            null
        ])

        if (result && result[0][0][0].id)
            return result[0][0][0].id
        else
            return false

    } catch (error) {
        return false
    }
}

async function updateHistoricoMedicamento(historicoMedicamento, transaction = null) {
    try {
        let connection = transaction || knexConection

        let sql = `call procHistoricoMedicamento(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`

        let result = await connection.raw(sql, [
            'UPDATE',
            historicoMedicamento.hora_ingestao,
            historicoMedicamento.id_paciente,
            historicoMedicamento.id_receita_medica,
            historicoMedicamento.dosagem_ingerida,
            historicoMedicamento.horario_programado,
            historicoMedicamento.nome_medicamento,
            historicoMedicamento.concentracao,
            historicoMedicamento.unidade_concentracao,
            historicoMedicamento.tipo_dosagem,
            historicoMedicamento.id
        ])

        if (result && result[0][0][0].affectedRows > 0)
            return true
        else
            return false

    } catch (error) {
        return false
    }
}

async function getHistoricoMedicamento(transaction = null) {
    try {
        let connection = transaction || knexConection

        let sql = `call procHistoricoMedicamento(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`

        let result = await connection.raw(sql, [
            'SELECT_ALL',
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            null
        ])

        if (Array.isArray(result[0][0]))
            return result[0][0]
        else
            return false

    } catch (error) {
        return false
    }
}

async function getHistoricoMedicamentoByID(id, transaction = null) {
    try {
        let connection = transaction || knexConection

        let sql = `call procHistoricoMedicamento(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`

        let result = await connection.raw(sql, [
            'SELECT_BY_ID',
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            id
        ])

        if (Array.isArray(result[0][0]))
            return result[0][0]
        else
            return false

    } catch (error) {
        return false
    }
}

const selectByIdReceitaHistoricoMedicamento = async function (idReceitaMedica, transaction = null) {
    try {
        let connection = transaction || knexConection

        let sql = `call procHistoricoMedicamento(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`

        let result = await connection.raw(sql, [
            'SELECT_BY_ID_RECEITA',
            null,
            null,
            idReceitaMedica,
            null,
            null,
            null,
            null,
            null,
            null,
            null
        ])

        if (Array.isArray(result[0][0]))
            return result[0][0]
        else
            return false

    } catch (error) {
        return false
    }
}

async function deleteHistoricoMedicamentoByID(id, transaction = null) {
    try {
        let connection = transaction || knexConection

        let sql = `call procHistoricoMedicamento(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`

        let result = await connection.raw(sql, [
            'DELETE',
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            null,
            id
        ])

        if (result && result[0][0][0].affectedRows > 0)
            return true
        else
            return false

    } catch (error) {
        console.log(error)
        return false
    }
}

module.exports = {
    insertHistoricoMedicamento,
    updateHistoricoMedicamento,
    getHistoricoMedicamento,
    getHistoricoMedicamentoByID,
    selectByIdReceitaHistoricoMedicamento,
    deleteHistoricoMedicamentoByID
}