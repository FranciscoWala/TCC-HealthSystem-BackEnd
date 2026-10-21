/*******************************************************************************************
 * Objetivo: Arquivo responsável pelo CRUD de dados da DOENÇA CRÔNICA no banco de dados
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

const insertDoencaCronica = async function (doencaCronica) {
    try {
        let sql = `call procDoencaCronica(?, ?, ?)`

        let result = await knexConection.raw(sql, [
            'INSERT',
            doencaCronica.nome_doenca,
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

const updateDoencaCronica = async function (doencaCronica) {
    try {
        let sql = `call procDoencaCronica(?, ?, ?)`

        let result = await knexConection.raw(sql, [
            'UPDATE',
            doencaCronica.nome_doenca,
            doencaCronica.id
        ])

        if (result && result[0][0][0].affectedRows > 0)
            return true
        else
            return false
    } catch (error) {
        return false
    }
}

const selectAllDoencasCronicas = async function () {
    try {
        let sql = `call procDoencaCronica(?, ?, ?)`

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

const selectByIdDoencasCronicas = async function (id) {
    try {
        let sql = `call procDoencaCronica(?, ?, ?)`

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

const deleteDoencaCronica = async function (id) {
    try {
        let sql = `call procDoencaCronica(?, ?, ?)`

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
    insertDoencaCronica,
    updateDoencaCronica,
    selectAllDoencasCronicas,
    selectByIdDoencasCronicas,
    deleteDoencaCronica
}