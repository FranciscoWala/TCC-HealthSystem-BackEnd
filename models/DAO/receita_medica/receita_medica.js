/*******************************************************************************************
 * Objetivo: Arquivo responsável pelo CRUD de dados da tabela de RECEITA_MEDICA no 
 *  banco de dados MySQL
 *          
 * Data: 06/10/2026
 * Autor: Samuel Silva Moreira Dos Santos
 * Versão: 1.0
********************************************************************************************/

const knexConection = require('../../global_knex/global_knex.js')

async function insertReceitamedica(receitaMedica, transaction = null) {
    try {
        let connection = transaction || knexConection

        let sql = `call procReceitaMedica(?, ?, ?, ?, ?, ?, ?)`

        let result = await connection.raw(sql, [
            'INSERT',
            receitaMedica.id_usuario,
            receitaMedica.id_medicamento,
            receitaMedica.dosagem,
            receitaMedica.id_unidade_medida,
            receitaMedica.descricao,
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

async function updateReceitaMedica(receitaMedica, transaction = null) {
    try {
        let connection = transaction || knexConection

        let sql = `call procReceitaMedica(?, ?, ?, ?, ?, ?, ?)`

        let result = await connection.raw(sql, [
            'UPDATE',
            receitaMedica.id_usuario,
            receitaMedica.id_medicamento,
            receitaMedica.dosagem,
            receitaMedica.id_unidade_medida,
            receitaMedica.descricao,
            receitaMedica.id
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

async function getReceitaMedica(transaction = null) {
    try {
        let connection = transaction || knexConection

        let sql = `call procReceitaMedica(?, ?, ?, ?, ?, ?, ?)`

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

async function getReceitaMedicaByID(id, transaction = null) {
    try {
        let connection = transaction || knexConection

        let sql = `call procReceitaMedica(?, ?, ?, ?, ?, ?, ?)`

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

async function deleteReceitaMedicaByID(id, transaction = null) {
    try {
        let connection = transaction || knexConection

        let sql = `call procReceitaMedica(?, ?, ?, ?, ?, ?, ?)`

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
    insertReceitamedica,
    updateReceitaMedica,
    getReceitaMedicaByID,
    getReceitaMedica,
    deleteReceitaMedicaByID
}