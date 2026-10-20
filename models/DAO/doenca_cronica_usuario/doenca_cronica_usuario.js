/*******************************************************************************************
 * Objetivo: Arquivo responsável pelo CRUD de dados da tabela intermediária de DOENCA_CRONICA_USUARIO no 
 *  banco de dados MySQL
 *          
 * Data: 07/10/2026
 * Autor: Samuel Silva Moreira Dos Santos
 * Versão: 1.0
********************************************************************************************/

const knex = require('knex')

const knexDataBaseConfig = require('../../database_config/knexConfig.js')

const knexConection = knex(knexDataBaseConfig.development)


async function insertDoencaCronicaUsuario(doencaCronicaUsuario) {

    try {
        let sql =
            `insert into tbl_doenca_cronica_usuario(
            id_doenca_cronica,
            id_usuario 
        ).values(
            ${doencaCronicaUsuario.id_doenca_cronica},
            ${doencaCronicaUsuario.id_usuario}
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

async function updateDoencaCronicaUsuario(doencaCronicaUsuario, id) {

    try {
        let sql =
            `
        update tbl_doenca_cronica_usuario
            set 
                id_doenca_cronica = ${doencaCronicaUsuario.id_doenca_cronica},
                id_usuario = ${doencaCronicaUsuario.id_usuario}
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

async function selectDoencaCronicaUsuario() {

    try {
        let sql =
            `
        select * from tbl_doenca_cronica_usuario;    
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

async function selectDoencaCronicaUsuarioByID(id) {

    try {
        let sql =
            `
        select * from tbl_doenca_cronica_usuario where id = ${id}
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

async function deleteDoencaCronicaUsuarioByID(id) {

    try {
        let sql =
            `
        delete from tbl_doenca_cronica_usuario where id = ${id}
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
    insertDoencaCronicaUsuario,
    updateDoencaCronicaUsuario,
    selectDoencaCronicaUsuario,
    selectDoencaCronicaUsuarioByID,
    deleteDoencaCronicaUsuarioByID
}