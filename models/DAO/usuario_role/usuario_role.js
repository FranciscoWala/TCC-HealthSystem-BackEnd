/*******************************************************************************************
 * Objetivo: Arquivo responsável pelo CRUD de dados da tabela intermediária de USUARIO_ROLE no 
 *  banco de dados MySQL
 *          
 * Data: 07/10/2026
 * Autor: Samuel Silva Moreira Dos Santos
 * Versão: 1.0
********************************************************************************************/

const knex = require('knex')

const knexDataBaseConfig = require('../../database_config/knexConfig.js')

const knexConection = knex(knexDataBaseConfig.development)


async function insertUsuarioRole(usuarioRole) {

    try {
        let sql =
            `insert into tbl_usuario_role(
           ativo, 
           data_ativacao,
           data_desativacao,
           id_usuario,
           id_role 
        ).values(
            '${usuarioRole.ativo}',
            '${usuarioRole.data_ativacao}',
            '${usuarioRole.data_desativacao}',
            ${usuarioRole.id_usuario},
            ${usuarioRole.id_role}
        );`

        let result = await knexConection.raw(sql)

        if (result)
            return result[0].insertId
        else
            return false
    } catch (error) {
        console.log(error)
        return false
    }
}

async function updateUsuarioRole(usuarioRole, id) {

    try {
        let sql =
            `
        update tbl_historico_medicamento
            set 
                ativo = '${usuarioRole.ativo}',
                data_ativacao = '${usuarioRole.data_ativacao}',
                data_desativacao = '${usuarioRole.data_desativacao}',
                id_usuario = ${usuarioRole.id_usuario},
                id_role = ${usuarioRole.id_role}
            where id = ${id};
    `

        let result = await knexConection.raw(sql)

        if (result)
            return true
        else
            return false
    } catch (error) {
        console.log(error)
        return false
    }
}

async function selectUsuarioRole() {

    try {
        let sql =
            `
        select * from tbl_usuario_role;    
    `

        let result = await knexConection.raw(sql)

        if (result)
            return result[0]
        else
            return false
    } catch (error) {
        console.log(error)
        return false
    }
}

async function selectUsuarioRoleByID(id) {

    try {
        let sql =
            `
        select * from tbl_usuario_role where id = ${id}
    `

        let result = await knexConection.raw(sql)

        if (result)
            return result[0]
        else
            return false
    } catch (error) {
        console.log(error)
        return false
    }


}

async function deleteUsuarioRoleByID(id) {

    try {
        let sql =
            `
        delete from tbl_usuario_role where id = ${id}
    `

        let result = await knexConection.raw(sql)

        if (result)
            return true
        else
            return false
    } catch (error) {
        console.log(error)
        return false
    }
}

module.exports = {
    insertUsuarioRole,
    updateUsuarioRole,
    selectUsuarioRole,
    selectUsuarioRoleByID,
    deleteUsuarioRoleByID
}