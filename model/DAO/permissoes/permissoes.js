/*******************************************************************************************
 * Objetivo: Arquivo responsável pelo CRUD de dados da PERMISSÕES no banco de dados
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

const insertPermissoes = async function (permissoes) {
    try {
        let sql = `insert into tbl_permissoes (
            permissao
        ) values (
            '${permissoes.permissao}' 
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

const updatePermissoes = async function (permissoes) {
    try {
        let sql = `update tbl_permissoes set
                        permissao = '${permissoes.permissao}'
                    where id = ${permissoes.id}`

        let result = await knexConection.raw(sql)

        if (result)
            return true
        else
            return false
    } catch (error) {
        return false
    }
}

const selectAllPermissoes = async function () {
    try {
        let sql = `select * from tbl_permissoes order by id desc;`

        let result = await knexConection.raw(sql)

        if (Array.isArray(result))
            return result[0]
        else
            return false
    } catch (error) {
        return false
    }
}

const selectByIdPermissoes = async function (id) {
    try {
        let sql = `select * from tbl_permissoes where id = ${id};`

        let result = await knexConection.raw(sql)

        if (Array.isArray(result))
            return result[0]
        else
            return false
    } catch (error) {
        return false
    }
}

const deletePermissoes = async function (id) {
    try {
        let sql = `delete from tbl_permissoes where id = ${id};`

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
    insertPermissoes,
    updatePermissoes,
    selectAllPermissoes,
    selectByIdPermissoes,
    deletePermissoes
}