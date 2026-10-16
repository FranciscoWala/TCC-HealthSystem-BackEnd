/*******************************************************************************************
 * Objetivo: Arquivo responsável pelo CRUD de dados do ESTOQUE no banco de dados
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

const insertEstoque = async function (estoque) {
    try {
        let sql = `insert into tbl_estoque (
            quantidade_em_estoque,
            id_usuarios,
            id_medicamentos
        ) values (
            '${estoque.quantidade_em_estoque}',
            ${estoque.id_usuarios},
            ${estoque.id_medicamentos}
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

const updateEstoque = async function (estoque) {
    try {
        let sql = `update tbl_estoque set
                        estoque = '${estoque.quantidade_em_estoque}',
                        id_usuarios = ${estoque.id_usuarios},
                        id_medicamentos = ${estoque.id_medicamentos}
                    where id = ${estoque.id};`

        let result = await knexConection.raw(sql)

        if (result)
            return true
        else
            return false
    } catch (error) {
        return false
    }
}

const selectAllEstoques = async function () {
    try {
        let sql = `select * from tbl_estoque order by id desc;`

        let result = await knexConection.raw(sql)

        if (Array.isArray(result))
            return result[0]
        else
            return false
    } catch (error) {
        return false
    }
}

const selectByIdEstoque = async function (id) {
    try {
        let sql = `select * from tbl_estoque where id = ${id};`

        let result = await knexConection.raw(sql)

        if (Array.isArray(result))
            return result[0]
        else
            return false
    } catch (error) {
        return false
    }
}

const deleteEstoque = async function (id) {
    try {
        let sql = `delete from tbl_estoque where id = ${id};`

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
    insertEstoque,
    updateEstoque,
    selectAllEstoques,
    selectByIdEstoque,
    deleteEstoque
}