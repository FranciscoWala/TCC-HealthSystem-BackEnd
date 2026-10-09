/*******************************************************************************************
 * Objetivo: Arquivo responsável pelo CRUD de dados do TIPO DOSAGEM no banco de dados
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

const insertTipoDosagem = async function (tipoDosagem) {
    try {
        let sql = `insert into tbl_tipo_dosagem (
            tipo_dosagem
        ) values (
            '${tipoDosagem.tipo_dosagem}' 
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

const updateTipoDosagem = async function (tipoDosagem) {
    try {
        let sql = `update tbl_tipo_dosagem set
                        tipo_dosagem = '${tipoDosagem.tipo_dosagem}'
                    where id = ${tipoDosagem.id};`

        let result = await knexConection.raw(sql)

        if (result)
            return true
        else
            return false
    } catch (error) {
        return false
    }
}

const selectAllTipoDosagem = async function () {
    try {
        let sql = `select * from tbl_tipo_dosagem order by id desc;`

        let result = await knexConection.raw(sql)

        if (Array.isArray(result))
            return result[0]
        else
            return false
    } catch (error) {
        return false
    }
}

const selectByIdTipoDosagem = async function (id) {
    try {
        let sql = `select * from tbl_tipo_dosagem where id = ${id};`

        let result = await knexConection.raw(sql)

        if (Array.isArray(result))
            return result[0]
        else
            return false
    } catch (error) {
        return false
    }
}

const deleteTipoDosagem = async function (id) {
    try {
        let sql = `delete from tbl_tipo_dosagem where id = ${id}`

        let result = await knexConection.raw(sql)

        if (result)
            return true
        else
            return false
    } catch (error) {
        return false
    }
}

module.exports = {
    insertTipoDosagem,
    updateTipoDosagem,
    selectAllTipoDosagem,
    selectByIdTipoDosagem,
    deleteTipoDosagem
}