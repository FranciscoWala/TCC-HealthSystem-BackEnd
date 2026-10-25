/*******************************************************************************************
 * Objetivo: Arquivo responsável pelo CRUD de dados da UNIDADE DE MEDIDA no banco de dados
 *          MySQL
 * Data: 06/10/2026
 * Autor: Kayque Brenno Ferreira Almeida
 * Versão: 1.0
********************************************************************************************/

const knexConection = require('../../global_knex/global_knex.js')

const insertUnidadeMedida = async function (unidadeMedida, transaction = null) {
    try {
        let connection = transaction || knexConection

        let sql = `call procUnidadeMedida(?, ?, ?, ?)`

        let result = await connection.raw(sql, [
            'INSERT',
            unidadeMedida.unidade_medida,
            unidadeMedida.sigla,
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

const updateUnidadeMedida = async function (unidadeMedida, transaction = null) {
    try {
        let connection = transaction || knexConection

        let sql = `call procUnidadeMedida(?, ?, ?, ?)`

        let result = await connection.raw(sql, [
            'UPDATE',
            unidadeMedida.unidade_medida,
            unidadeMedida.sigla,
            unidadeMedida.id
        ])

        if (result && result[0][0][0].affectedRows > 0)
            return true
        else
            return false
    } catch (error) {
        return false
    }
}

const selectAllUnidadeMedida = async function (transaction = null) {
    try {
        let connection = transaction || knexConection

        let sql = `call procUnidadeMedida(?, ?, ?, ?)`

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

const selectByIdUnidadeMedida = async function (id, transaction = null) {
    try {
        let connection = transaction || knexConection

        let sql = `call procUnidadeMedida(?, ?, ?, ?)`

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
        return false
    }
}

const deleteUnidadeMedida = async function (id, transaction = null) {
    try {
        let connection = transaction || knexConection

        let sql = `call procUnidadeMedida(?, ?, ?, ?)`

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
    insertUnidadeMedida,
    updateUnidadeMedida,
    selectAllUnidadeMedida,
    selectByIdUnidadeMedida,
    deleteUnidadeMedida
}