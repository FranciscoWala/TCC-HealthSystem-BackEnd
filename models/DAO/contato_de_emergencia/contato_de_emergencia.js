/*******************************************************************************************
 * Objetivo: Arquivo responsável pelo CRUD de dados da tabela de CONTATOS_DE_EMERGENCIA no 
 *  banco de dados MySQL
 *          
 * Data: 06/10/2026
 * Autor: Samuel Silva Moreira Dos Santos
 * Versão: 1.0
********************************************************************************************/

const knexConection = require('../../global_knex/global_knex.js')

async function insertContatoEmergencia(contatoEmergencia, transaction = null) {
    try {
        let connection = transaction || knexConection

        let sql = `call procContatoEmergencia(?, ?, ?, ?);`

        let result = await connection.raw(sql, [
            'INSERT',
            contatoEmergencia.nome,
            contatoEmergencia.telefone,
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

async function updateContatoEmergencia(contatoEmergencia, transaction = null) {
    try {
        let connection = transaction || knexConection

        let sql = `call procContatoEmergencia(?, ?, ?, ?);`

        let result = await connection.raw(sql, [
            'UPDATE',
            contatoEmergencia.nome,
            contatoEmergencia.telefone,
            contatoEmergencia.id
        ])

        if (result && result[0][0][0].affectedRows > 0)
            return true
        else
            return false
    } catch (error) {
        return false
    }
}

async function getContatosEmergencia(transaction = null) {
    try {
        let connection = transaction || knexConection

        let sql = `call procContatoEmergencia(?, ?, ?, ?)`

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

async function getContatosEmergenciaByID(id, transaction = null) {
    try {
        let connection = transaction || knexConection

        let sql = `call procContatoEmergencia(?, ?, ?, ?)`

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

async function deleteContatoEmergenciaByID(id, transaction = null) {
    try {
        let connection = transaction || knexConection

        let sql = `call procContatoEmergencia(?, ?, ?, ?)`

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
    insertContatoEmergencia,
    updateContatoEmergencia,
    getContatosEmergencia,
    getContatosEmergenciaByID,
    deleteContatoEmergenciaByID
}