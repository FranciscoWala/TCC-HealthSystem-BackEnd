/*******************************************************************************************
 * Objetivo: Arquivo responsável pelo CRUD de dados da tabela de CONTATOS_DE_EMERGENCIA no 
 *  banco de dados MySQL
 *          
 * Data: 06/10/2026
 * Autor: Samuel Silva Moreira Dos Santos
 * Versão: 1.0
********************************************************************************************/

const knex = require('knex')

const knexDataBaseConfig = require('../../database_config/knexConfig.js')

const knexConection = knex(knexDataBaseConfig.development)


async function insertContatoEmergencia(contatoEmergencia) {
    try {
        let sql = `call procContatoEmergencia(?, ?, ?, ?);`

        let result = await knexConection.raw(sql, [
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

async function updateContatoEmergencia(contatoEmergencia) {
    try {
        let sql = `call procContatoEmergencia(?, ?, ?, ?);`

        let result = await knexConection.raw(sql, [
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

async function getContatosEmergencia() {
    try {
        let sql = `call procContatoEmergencia(?, ?, ?, ?)`

        let result = await knexConection.raw(sql, [
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

async function getContatosEmergenciaByID(id) {
    try {
        let sql = `call procContatoEmergencia(?, ?, ?, ?)`

        let result = await knexConection.raw(sql, [
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

async function deleteContatoEmergenciaByID(id) {
    try {
        let sql = `call procContatoEmergencia(?, ?, ?, ?)`

        let result = await knexConection.raw(sql, [
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