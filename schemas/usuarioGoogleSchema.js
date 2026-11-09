
/*
    Objetivo: Schema de validação dos dados do usuário Google
    Data: 09/11/2026
    Autor: Kayque Brenno Ferreira Almeida
    Versão: 1.0
*/

const JOI = require('joi')

const usuarioGoogleSchema = JOI.object({
    google_id: JOI.string()
                .max(255)
                .required(),

    id_usuario: JOI.number()
                .integer()
                .min(1)
                .required()
})

module.exports = usuarioGoogleSchema
