/*************************************************************************************
 * Objetivo: Arquivo responsável pelo CRUD de dados MySQL na tabela 
 *      de relação entre ROLE e PERMISSOES
 * Data: 06/10/2026
 * Autor: Kayque Brenno Ferreira Almeida
 * Versão: 1.0
**************************************************************************************/

const knexConection = require('../../global_knex/global_knex.js')

const insertRolePermissoes = async function (rolePermissoes, transaction = null) {
    try {
        let connection = transaction || knexConection

        let sql = `call procRolePermissoes(?, ?, ?, ?)`

        let result = await connection.raw(sql, [
            'INSERT',
            rolePermissoes.id_role,
            rolePermissoes.id_permissoes,
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

const updateRolePermissoes = async function (rolePermissoes, transaction = null) {
    try {
        let connection = transaction || knexConection

        let sql = `call procRolePermissoes(?, ?, ?, ?)`

        let result = await connection.raw(sql, [
            'UPDATE',
            rolePermissoes.id_role,
            rolePermissoes.id_permissoes,
            rolePermissoes.id
        ])

        if (result && result[0][0][0].affectedRows > 0)
            return true
        else
            return false
    } catch (error) {
        return false
    }
}

const selectAllRolePermissoes = async function (transaction = null) {
    try {
        let connection = transaction || knexConection

        let sql = `call procRolePermissoes(?, ?, ?, ?)`

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

const selectByIdRolePermissoes = async function (id, transaction = null) {
    try {
        let connection = transaction || knexConection

        let sql = `call procRolePermissoes(?, ?, ?, ?)`

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

const deleteRolePermissoes = async function (id, transaction = null) {
    try {
        let connection = transaction || knexConection

        let sql = `call procRolePermissoes(?, ?, ?, ?)`

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

const selectPermissoesByRole = async function(role){
    try {
        let sql = `select * from vw_role_permissoes where id_role = ?`

        let result = await knexConection.raw(sql, [role])

        if(result)
            return result[0][0]
        else
            return false
    } catch (error) {
        console.log(error)
        return false
    }
}

module.exports = {
    insertRolePermissoes,
    updateRolePermissoes,
    selectAllRolePermissoes,
    selectByIdRolePermissoes,
    deleteRolePermissoes,
    deleteRolePermissoes,
    selectPermissoesByRole
}