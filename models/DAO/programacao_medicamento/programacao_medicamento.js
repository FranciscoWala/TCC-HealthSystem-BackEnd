/*******************************************************************************************
 * Objetivo: Arquivo responsável pelo CRUD de dados da tabela de PROGRAMACAO_MEDICAMENTO no 
 *  banco de dados MySQL
 *          
 * Data: 25/10/2026
 * Autor: Kayque Brenno Ferreira Almeida
 * Versão: 1.0
********************************************************************************************/

const knexConection = require('../../global_knex/global_knex.js')

const insertProgramacaoMedicamento = async function (programacaoMedicamento, transaction = null) {
    try {
        let connection = transaction || knexConection

        let sql = `call procProgramacaoMedicamento(?, ?, ?, ?, ?, ?, ?)`

        let result = await connection.raw(sql, [
            'INSERT',
            programacaoMedicamento.frequencia,
            programacaoMedicamento.data_hora_inicio,
            programacaoMedicamento.data_hora_fim ?? null,
            programacaoMedicamento.id_tipo_intervalo,
            programacaoMedicamento.id_receita_medica,
            null
        ])

        if (result && result[0][0][0].id)
            return result[0][0][0].id
        else
            return false
    } catch (error) {
        console.log(error)
        return false
    }
}

const updateProgramacaoMedicamento = async function (programacaoMedicamento, transaction = null) {
    try {
        let connection = transaction || knexConection

        let sql = `call procProgramacaoMedicamento(?, ?, ?, ?, ?, ?, ?)`

        let result = await connection.raw(sql, [
            'UPDATE',
            null,
            null,
            programacaoMedicamento.data_hora_fim,
            null,
            null,
            programacaoMedicamento.id
        ])

        if (result && result[0][0][0].affectedRows > 0)
            return true
        else
            return false
    } catch (error) {
        console.log(error);
        return false
    }
}

const updateDadosProgramacaoMedicamento = async function (programacaoMedicamento, transaction = null) {
    try {
        let connection = transaction || knexConection

        let sql = `call procProgramacaoMedicamento(?, ?, ?, ?, ?, ?, ?)`

        let result = await connection.raw(sql, [
            'UPDATE_DADOS',
            programacaoMedicamento.frequencia,
            programacaoMedicamento.data_hora_inicio,
            null,
            programacaoMedicamento.id_tipo_intervalo,
            null,
            programacaoMedicamento.id
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

const selectProgramacaoMedicamento = async function (transaction = null) {
    try {
        let connection = transaction || knexConection

        let sql = `call procProgramacaoMedicamento(?, ?, ?, ?, ?, ?, ?)`

        let result = await connection.raw(sql, [
            'SELECT_ALL',
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
        console.log(error)
        return false
    }
}

const selectByIdProgramacaoMedicamento = async function (id, transaction = null) {
    try {
        let connection = transaction || knexConection

        let sql = `call procProgramacaoMedicamento(?, ?, ?, ?, ?, ?, ?)`

        let result = await connection.raw(sql, [
            'SELECT_BY_ID',
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
        console.log(error)
        return false
    }
}

const selectProgramacaoMedicamentoByIdReceita = async function (idReceitaMedica, transaction = null) {
    try {
        let connection = transaction || knexConection

        let sql = `call procProgramacaoMedicamento(?, ?, ?, ?, ?, ?, ?)`

        let result = await connection.raw(sql, [
            'SELECT_BY_ID_RECEITA',
            null,
            null,
            null,
            null,
            idReceitaMedica,
            null
        ])

        if (Array.isArray(result[0][0]))
            return result[0][0]
        else
            return false
    } catch (error) {
        console.log(error)
        return false
    }
}


const selectByIdUsuarioProgramacaoMedicamento = async function (idUsuario, transaction = null) {
    try {
        let sql = `call procProgramacaoMedicamento(?, ?, ?, ?, ?, ?, ?);`

        let connection = transaction || knexConection

        let result = await connection.raw(sql, [
            'SELECT_BY_ID_USUARIO',
            null,
            null,
            null,
            null,
            null,
            idUsuario
        ])

        if (Array.isArray(result[0][0]))
            return result[0][0]
        else
            return false

    } catch (error) {
        console.log(error)
        return false
    }
}


const deleteProgramacaoMedicamento = async function (id, transaction = null) {
    try {
        let connection = transaction || knexConection

        let sql = `call procProgramacaoMedicamento(?, ?, ?, ?, ?, ?, ?)`

        let result = await connection.raw(sql, [
            'DELETE',
            null,
            null,
            null,
            null,
            null,
            id
        ])

        if (result)
            return result
        else
            return false
    } catch (error) {
        console.log(error)
        return false
    }
}

module.exports = {
    insertProgramacaoMedicamento,
    updateProgramacaoMedicamento,
    updateDadosProgramacaoMedicamento,
    selectByIdProgramacaoMedicamento,
    selectProgramacaoMedicamento,
    selectProgramacaoMedicamentoByIdReceita,
    selectByIdUsuarioProgramacaoMedicamento,
    deleteProgramacaoMedicamento,
}