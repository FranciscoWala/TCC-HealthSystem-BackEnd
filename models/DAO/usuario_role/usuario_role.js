/*******************************************************************************************
 * Objetivo: Arquivo responsável pelo CRUD de dados da tabela intermediária de USUARIO_ROLE no 
 *  banco de dados MySQL
 *          
 * Data: 07/10/2026
 * Autor: Samuel Silva Moreira Dos Santos
 * Versão: 1.0
********************************************************************************************/

const knexConection = require('../../global_knex/global_knex.js')

async function insertUsuarioRole(usuarioRole, transaction = null) {
    try {
        let connection = transaction || knexConection

        let sql = `call procUsuariosRole(?, ?, ?, ?, ?, ?, ?)`

        let result = await connection.raw(sql, [
            'INSERT',
            usuarioRole.ativo,
            usuarioRole.data_ativacao,
            usuarioRole.data_desativacao,
            usuarioRole.id_usuarios,
            usuarioRole.id_role,
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

async function updateUsuarioRole(usuarioRole, transaction = null) {
    try {
        let connection = transaction || knexConection

        let sql = `call procUsuariosRole(?, ?, ?, ?, ?, ?, ?)`

        let result = await connection.raw(sql, [
            'UPDATE',
            usuarioRole.ativo,
            usuarioRole.data_ativacao,
            usuarioRole.data_desativacao,
            usuarioRole.id_usuarios,
            usuarioRole.id_role,
            usuarioRole.id
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

async function selectUsuarioRole(transaction = null) {
    try {
        let connection = transaction || knexConection

        let sql = `call procUsuariosRole(?, ?, ?, ?, ?, ?, ?)`

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

async function selectUsuarioRoleByID(id, transaction = null) {
    try {
        let connection = transaction || knexConection

        let sql = `call procUsuariosRole(?, ?, ?, ?, ?, ?, ?)`

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

async function deleteUsuarioRoleByID(id, transaction = null) {
    try {
        let connection = transaction || knexConection

        let sql = `call procUsuariosRole(?, ?, ?, ?, ?, ?, ?)`

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
            return true
        else
            return false
    } catch (error) {
        console.log(error)
        return false
    }
}

module.exports = {
    insertUsuarioRole,
    updateUsuarioRole,
    selectUsuarioRole,
    selectUsuarioRoleByID,
    deleteUsuarioRoleByID
}