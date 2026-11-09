/*************************************************************************************
 * Objetivo: Arquivo responsável por validar os dados do cadastro com Google
 * Data: 09/11/2026
 * Autor: Kayque Brenno Ferreira Almeida
 * Versão: 1.0
**************************************************************************************/

const usuarioSchema = require('./usuarioSchema.js')

const usuarioCadastroGoogleSchema = usuarioSchema.fork(
    ['senha'],
    (schema) => schema.allow(null).optional()
)

module.exports = usuarioCadastroGoogleSchema