/*******************************************************************************************
 * Objetivo: Arquivo responsável pelo CRUD de dados da UNIDADE DE MEDIDA no banco de dados
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

const insertUnidadeMedida = async function (unidadeMedida) {
    try {
        let sql = `call procUnidadeMedida(?, ?, ?, ?)`

        let result = await knexConection.raw(sql, [
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

const updateUnidadeMedida = async function (unidadeMedida) {
    try {
        let sql = `call procUnidadeMedida(?, ?, ?, ?)`

        let result = await knexConection.raw(sql, [
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

const selectAllUnidadeMedida = async function () {
    try {
        let sql = `call procUnidadeMedida(?, ?, ?, ?)`

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

const selectByIdUnidadeMedida = async function (id) {
    try {
        let sql = `call procUnidadeMedida(?, ?, ?, ?)`

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

const deleteUnidadeMedida = async function (id) {
    try {
        let sql = `call procUnidadeMedida(?, ?, ?, ?)`

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
    insertUnidadeMedida,
    updateUnidadeMedida,
    selectAllUnidadeMedida,
    selectByIdUnidadeMedida,
    deleteUnidadeMedida
}