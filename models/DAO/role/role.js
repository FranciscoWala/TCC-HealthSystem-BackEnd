/*******************************************************************************************
 * Objetivo: Arquivo responsável pelo CRUD de dados da ROLE no banco de dados
 *          MySQL
 * Data: 06/10/2026
 * Autor: Kayque Brenno Ferreira Almeida
 * Versão: 1.0
********************************************************************************************/

//IMPORT DA BIBLIOTECA PARA MANIPULAR DADOS NO BD MYSQL
const knex = require('knex')

//IMPORT DO ARQUIVO DE CONFIGURAÇÃO PARA ACESSO AO BD
const knexDataBaseConfig = require('../../database_config/knexConfig.js')

//CRIAR A CONEXÃO COM O BANCO DE DADOS CONFORME A CONFIGURAÇÃO
const knexConection = knex(knexDataBaseConfig.development)

const insertRole = async function (role) {
    try {
        let sql = `call procRole(?, ?, ?)`

        let result = await knexConection.raw(sql, [
            'INSERT',
            role.role,
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

const updateRole = async function (role) {
    try {
        let sql = `call procRole(?, ?, ?)`

        let result = await knexConection.raw(sql, [
            'UPDATE',
            role.role,
            role.id
        ])

        if (result && result[0][0][0].affectedRows > 0)
            return true
        else
            return false
    } catch (error) {
        return false
    }
}

const selectAllRoles = async function () {
    try {
        let sql = `call procRole(?, ?, ?)`

        let result = await knexConection.raw(sql, [
            'SELECT_ALL',
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

const selectByIdRole = async function (id) {
    try {
        let sql = `call procRole(?, ?, ?)`

        let result = await knexConection.raw(sql, [
            'SELECT_BY_ID',
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

const deleteRole = async function (id) {
    try {
        let sql = `call procRole(?, ?, ?)`

        let result = await knexConection.raw(sql, [
            'DELETE',
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
    insertRole,
    updateRole,
    selectAllRoles,
    selectByIdRole,
    deleteRole
}