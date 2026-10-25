/*******************************************************************************************
 * Objetivo: Arquivo responsável pelo CRUD de dados da tabela intermediária de CONTATOS_DE_EMERGENCIA_USUARIO no 
 *  banco de dados MySQL
 *          
 * Data: 07/10/2026
 * Autor: Samuel Silva Moreira Dos Santos
 * Versão: 1.0
********************************************************************************************/

// Import da conexão global com o Banco de Dados MySQL
const knexConection = require('../../global_knex/global_knex.js')


async function insertContatoEmergenciaUsuario(contatoEmergenciaUsuario, transaction = null) {
    try {
        let connection = transaction || knexConection

        let sql =
            `call procContatoEmergenciaUsuarios(?, ?, ?, ?);`

        let result = await connection.raw(sql, [
            'INSERT',
            contatoEmergenciaUsuario.id_contato_de_emergencia,
            contatoEmergenciaUsuario.id_usuarios,
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

async function updateContatoEmergenciaUsuario(contatoEmergenciaUsuario, transaction = null) {
    try {
        let connection = transaction || knexConection

        let sql = `call procContatoEmergenciaUsuarios(?, ?, ?, ?);`

        let result = await connection.raw(sql, [
            'UPDATE',
            contatoEmergenciaUsuario.id_contato_de_emergencia,
            contatoEmergenciaUsuario.id_usuarios,
            contatoEmergenciaUsuario.id
        ])

        if (result && result[0][0][0].affectedRows > 0)
            return true
        else
            return false
    } catch (error) {
        return false
    }
}

async function selectContatoEmergenciaUsuario(transaction = null) {
    try {
        let connection = transaction || knexConection

        let sql = `call procContatoEmergenciaUsuarios(?, ?, ?, ?);`

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

async function selectContatosEmergenciaByID(id, transaction = null) {
    try {
        let connection = transaction || knexConection

        let sql = `call procContatoEmergenciaUsuarios(?, ?, ?, ?);`

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

async function deleteContatoEmergenciaUsuarioByID(id, transaction = null) {
    try {
        let connection = transaction || knexConection

        let sql = `call procContatoEmergenciaUsuarios(?, ?, ?, ?);`

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
    insertContatoEmergenciaUsuario,
    updateContatoEmergenciaUsuario,
    selectContatoEmergenciaUsuario,
    selectContatosEmergenciaByID,
    deleteContatoEmergenciaUsuarioByID
}