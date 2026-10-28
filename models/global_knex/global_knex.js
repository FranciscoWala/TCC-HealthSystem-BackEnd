/****************************
 * Objetivo: Arquivo responsável por padronizar a chamada do KNEX entre as MODELs
 * Data: 23/10/2026
 * Autor: Kayque Brenno Ferreira Almeida
 * Versão: 1.0
****************************/

const knex = require('knex')
const knexDatabaseConfig = require('../database/database_config/knexConfig.js')
const knexConnection = knex(knexDatabaseConfig.development)

module.exports = knexConnection