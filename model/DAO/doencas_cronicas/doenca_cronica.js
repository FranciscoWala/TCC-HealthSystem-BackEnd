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
        let sql = `insert into tbl_doencas_cronicas (
            nome_doenca
        ) values (
            '${doencaCronica.nome_doenca}' 
        );`

        let result = await knexConection.raw(sql)

        if (result)
            return result[0].insertId
        else
            return false
    } catch (error) {
        return false
    }
}

const updateDoencaCronica = async function (doencaCronica) {
    try {
        let sql = `update tbl_doencas_cronicas set
                        nome_doenca = '${doencaCronica.nome_doenca}'
                    where id = ${doencaCronica.id};`

        let result = await knexConection.raw(sql)

        if (result)
            return true
        else
            return false
    } catch (error) {
        return false
    }
}

const selectAllDoencasCronicas = async function () {
    try {
        let sql = `select * from tbl_doencas_cronicas order by id desc;`

        let result = await knexConection.raw(sql)

        if (Array.isArray(result))
            return result[0]
        else
            return false
    } catch (error) {
        return false
    }
}

const selectByIdDoencasCronicas = async function (id) {
    try {
        let sql = `select * from tbl_doencas_cronicas where id = ${id};`

        let result = await knexConection.raw(sql)

        if (Array.isArray(result))
            return result[0]
        else
            return false
    } catch (error) {
        return false
    }
}

const deleteDoencaCronica = async function (id) {
    try {
        let sql = `delete from tbl_doencas_cronicas where id = ${id};`

        let result = knexConection.raw(sql)

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