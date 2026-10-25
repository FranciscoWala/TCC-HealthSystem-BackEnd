/*******************************************************************************************
 * Objetivo: Arquivo responsável pelo CRUD de dados dos HORÁRIOS no banco de dados
 *          MySQL
 * Data: 06/10/2026
 * Autor: Kayque Brenno Ferreira Almeida
 * Versão: 1.0
********************************************************************************************/

const knexConection = require('../../global_knex/global_knex.js')

const insertHorario = async function (horario, transaction = null) {
    try {
        let connection = transaction || knexConection

        let sql = `call procHorario(?, ?, ?, ?)`

        let result = await connection.raw(sql, [
            'INSERT',
            horario.horario,
            horario.id_receita_medica,
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

const updateHorario = async function (horario, transaction = null) {
    try {
        let connection = transaction || knexConection

        let sql = `call procHorario(?, ?, ?, ?)`

        let result = await connection.raw(sql, [
            'UPDATE',
            horario.horario,
            horario.id_receita_medica,
            horario.id
        ])

        if (result && result[0][0][0].affectedRows > 0)
            return true
        else
            return false
    } catch (error) {
        return false
    }
}

const selectAllHorarios = async function (transaction = null) {
    try {
        let connection = transaction || knexConection

        let sql = `call procHorario(?, ?, ?, ?)`

        let result = await connection.raw(sql, [
            'SELECT_ALL',
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

const selectByIdHorario = async function (id, transaction = null) {
    try {
        let connection = transaction || knexConection

        let sql = `call procHorario(?, ?, ?, ?)`

        let result = await connection.raw(sql, [
            'SELECT_BY_ID',
            null,
            null,
            id
        ])

        if (Array.isArray(result[0][0]))
            return result[0][0]
        else
            return false
    } catch (error) {
        console.log('ERRO SELECT_BY_ID HORARIO:', error)
        return false
    }
}

const selectHorariosNaoTomados = async function (transaction = null) {
    try {
        let connection = transaction || knexConection

        let sql = `call procHorario(?, ?, ?, ?)`

        let result = await connection.raw(sql, [
            'SELECT_NAO_TOMADOS',
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

const deleteHorario = async function (id, transaction = null) {
    try {
        let connection = transaction || knexConection

        let sql = `call procHorario(?, ?, ?, ?)`

        let result = await connection.raw(sql, [
            'DELETE',
            null,
            null,
            id
        ])

        if (result)
            return true
        else
            return false
    } catch (error) {
        return false
    }
}

module.exports = {
    insertHorario,
    updateHorario,
    selectAllHorarios,
    selectByIdHorario,
    selectHorariosNaoTomados,
    deleteHorario
}