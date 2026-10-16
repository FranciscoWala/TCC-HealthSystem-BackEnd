/*************************************************************************************
 * Objetivo: Arquivo responsável pelo CRUD de dados MySQL na tabela 
 *      de relação entre ROLE e PERMISSOES
 * Data: 06/10/2026
 * Autor: Kayque Brenno Ferreira Almeida
 * Versão: 1.0
**************************************************************************************/

//IMPORT DA BIBLIOTECA PARA MANIPULAR DADOS NO BD MYSQL
const knex = require('knex')

//IMPORT DO ARQUIVO DE CONFIGURAÇÃO PARA ACESSO AO BD
const knexDataBaseConfig = require('../../database_config/knexConfig.js')

//CRIAR A CONEXÃO COM O BANCO DE DADOS CONFORME A CONFIGURAÇÃO
const knexConection = knex(knexDataBaseConfig.development)

const insertRolePermissoes = async function (rolePermissoes) {
    try {
        let sql = `insert into tbl_role_permissoes (
            id_role,
            id_permissoes
        ) values (
            ${rolePermissoes.id_role},
            ${rolePermissoes.id_permissoes}
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

const updateRolePermissoes = async function (rolePermissoes) {
    try {
        let sql = `update tbl_role_permissoes set
                        id_role = ${rolePermissoes.id_role},
                        id_permissoes = ${rolePermissoes.id_permissoes}
                    where id = ${rolePermissoes.id};`

        let result = await knexConection.raw(sql)

        if (result)
            return true
        else
            return false
    } catch (error) {
        return false
    }
}

const selectAllRolePermissoes = async function () {
    try {
        let sql = `select * from tbl_role_permissoes order by id desc;`

        let result = await knexConection.raw(sql)

        if (Array.isArray(result))
            return result[0]
        else
            return false
    } catch (error) {
        return false
    }
}

const selectByIdRolePermissoes = async function (id) {
    try {
        let sql = `select * from tbl_role_permissoes where id = ${id};`

        let result = await knexConection.raw(sql)

        if (Array.isArray(result))
            return result[0]
        else
            return false
    } catch (error) {
        return false
    }
}

const selectPermissoesByIdRole = async function (idRole) {
    try {
        let sql = ` select * from vw_permissoes_id_role where id_role = ${idRole};`

        let result = await knexConection.raw(sql)

        if (Array.isArray(result))
            return result[0]
        else 
            return false
    } catch (error) {
        return false
    }
}

const selectRolesByIdPermissoes = async function (idPermissoes) {
    try {
        let sql = ` select * from vw_role_id_permissoes where id_permissoes = ${idPermissoes};`

        let result = await knexConection.raw(sql)

        if (Array.isArray(result))
            return result[0]
        else 
            return false
    } catch (error) {
        return false
    }
}

const deleteRolePermissoes = async function (id) {
    try {
        let sql = `delete from tbl_role_permissoes where id = ${id};`

        let result = knexConection.raw(sql)

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
        let sql = `select * from vw_role_permissoes where role = '${role}'`
        
        let result = await knexConection.raw(sql)
        
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
    selectPermissoesByIdRole,
    selectRolesByIdPermissoes,
    deleteRolePermissoes,

    selectPermissoesByRole
}