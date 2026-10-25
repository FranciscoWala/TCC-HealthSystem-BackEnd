/*******************************************************************************************
 * Objetivo: Arquivo responsável pelo CRUD de dados da tabela intermediária de DOENCA_CRONICA_USUARIO no 
 *  banco de dados MySQL
 *          
 * Data: 07/10/2026
 * Autor: Samuel Silva Moreira Dos Santos
 * Versão: 1.0
********************************************************************************************/

const knexConection = require('../../global_knex/global_knex.js')

async function insertDoencaCronicaUsuario(doencaCronicaUsuario, transaction = null) {
    try {
        let connection = transaction || knexConection

        let sql = `call procDoencaCronicaUsuario(?, ?, ?, ?)`

        let result = await connection.raw(sql, [
            'INSERT',
            doencaCronicaUsuario.id_doencas_cronicas,
            doencaCronicaUsuario.id_usuarios,
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

async function updateDoencaCronicaUsuario(doencaCronicaUsuario, transaction = null) {

    try {
        let connection = transaction || knexConection

        let sql = `call procDoencaCronicaUsuario(?, ?, ?, ?)`

        let result = await connection.raw(sql, [
            'UPDATE',
            doencaCronicaUsuario.id_doencas_cronicas,
            doencaCronicaUsuario.id_usuarios,
            doencaCronicaUsuario.id
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

async function selectDoencaCronicaUsuario(transaction = null) {

    try {
        let connection = transaction || knexConection

        let sql = `call procDoencaCronicaUsuario(?, ?, ?, ?)`

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
        console.log(error)
        return false
    }
}

async function selectDoencaCronicaUsuarioByID(id, transaction = null) {

    try {
        let connection = transaction || knexConection

        let sql = `call procDoencaCronicaUsuario(?, ?, ?, ?)`

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
        console.log(error)
        return false
    }


}

async function deleteDoencaCronicaUsuarioByID(id, transaction = null) {

    try {
        let connection = transaction || knexConection

        let sql = `call procDoencaCronicaUsuario(?, ?, ?, ?)`

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
        console.log(error)
        return false
    }
}

module.exports = {
    insertDoencaCronicaUsuario,
    updateDoencaCronicaUsuario,
    selectDoencaCronicaUsuario,
    selectDoencaCronicaUsuarioByID,
    deleteDoencaCronicaUsuarioByID
}