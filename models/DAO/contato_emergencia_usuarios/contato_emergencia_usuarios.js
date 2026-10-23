/*******************************************************************************************
 * Objetivo: Arquivo responsável pelo CRUD de dados da tabela intermediária de CONTATOS_DE_EMERGENCIA_USUARIO no 
 *  banco de dados MySQL
 *          
 * Data: 07/10/2026
 * Autor: Samuel Silva Moreira Dos Santos
 * Versão: 1.0
********************************************************************************************/

// Import da conexão global com o Banco de Dados MySQL
const knexConection = require('../../global_knex/global_knex.js')


async function insertContatoEmergenciaUsuario(contatoEmergenciaUsuario){
    let sql = 
        `call procContatoEmergenciaUsuarios(?, ?, ?, ?);`

    let result = await knexConection.raw(sql)

    if (result)
        return result[0].insertId
    else
        return false
}

async function updateContatoEmergenciaUsuario(contatoEmergenciaUsuario, id) {
    let sql = 
    `
        update tbl_contato_emergencia_usuario
            set 
                id_contato_de_emergencia = '${contatoEmergenciaUsuario.id_contato_de_emergencia}',
                id_usuario = '${contatoEmergenciaUsuario.id_usuario}'
            where id = ${id};
    `

    let result = await knexConection.raw(sql)

    if(result)
        return true
    else
        return false
}

async function selectContatoEmergenciaUsuario() {
    let sql = 
    `
        select * from tbl_contatos_emergencia_usuario;    
    `

    let result = await knexConection.raw(sql)

    if(result)
        return result[0]
    else
        return false
}

async function selectContatosEmergenciaByID(id) {
    let sql =
    `
        select * from tbl_contato_de_emergencia where id = ${id}
    `

    let result = await knexConection.raw(sql)

    if(result)
        return result[0]
    else 
        return false
}

async function deleteContatoEmergenciaUsuarioByID(id) {
    let sql =
    `
        delete from tbl_contato_emergencia_usuario where id = ${id}
    `

    let result = await knexConection.raw(sql)

    if(result)
        return true
    else
        return false
}

module.exports = {
    insertContatoEmergenciaUsuario,
    updateContatoEmergenciaUsuario,
    selectContatoEmergenciaUsuario,
    selectContatosEmergenciaByID,
    deleteContatoEmergenciaUsuarioByID
}