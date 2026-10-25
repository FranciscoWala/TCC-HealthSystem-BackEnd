/*******************************************************************************************
 * Objetivo: Arquivo responsável pelo CRUD de dados do ESTOQUE no banco de dados
 *          MySQL
 * Data: 06/10/2026
 * Autor: Kayque Brenno Ferreira Almeida
 * Versão: 1.0
********************************************************************************************/

const knexConection = require('../../global_knex/global_knex.js')

const insertEstoque = async function (estoque, transaction = null) {
    try {
        let connection = transaction || knexConection

        let sql = `call procEstoque(?, ?, ?, ?, ?)`

        let result = await connection.raw(sql, [
            'INSERT',
            estoque.quantidade_em_estoque,
            estoque.id_usuarios,
            estoque.id_medicamentos,
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

const updateEstoque = async function (estoque, transaction = null) {
    try {
        let connection = transaction || knexConection

        let sql = `call procEstoque(?, ?, ?, ?, ?)`

        let result = await connection.raw(sql, [
            'UPDATE',
            estoque.quantidade_em_estoque,
            estoque.id_usuarios,
            estoque.id_medicamentos,
            estoque.id
        ])

        if (result && result[0][0][0].affectedRows > 0)
            return true
        else
            return false
    } catch (error) {
        return false
    }
}

const selectAllEstoques = async function (transaction = null) {
    try {
        let connection = transaction || knexConection

        let sql = `call procEstoque(?, ?, ?, ?, ?)`

        let result = await connection.raw(sql, [
            'SELECT_ALL',
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

const selectByIdEstoque = async function (id, transaction = null) {
    try {
        let connection = transaction || knexConection

        let sql = `call procEstoque(?, ?, ?, ?, ?)`

        let result = await connection.raw(sql, [
            'SELECT_BY_ID',
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

const deleteEstoque = async function (id, transaction = null) {
    try {
        let connection = transaction || knexConection

        let sql = `call procEstoque(?, ?, ?, ?, ?)`

        let result = await connection.raw(sql, [
            'DELETE',
            null,
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
    insertEstoque,
    updateEstoque,
    selectAllEstoques,
    selectByIdEstoque,
    deleteEstoque
}