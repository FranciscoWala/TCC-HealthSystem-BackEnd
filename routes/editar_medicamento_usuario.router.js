/************************************************
    Objetivo: Arquivo responsável pela ROTA
    data: 28/10/2026
    Autor: Kayque Brenno Ferreira Almeida
    Versão: 1.0
*************************************************/

const express = require('express')
const bodyParser = require('body-parser')

const bodyParserJSON = bodyParser.json()

const router = express.Router()

const verificarToken = require('../middleware/auth.js')
const authorization = require('../middleware/authorization.js')

const controllerEditarMedicamentoUsuario = require('../controllers/editar_medicamento_usuario/controller_editar_medicamento_usuario.js')

//                          ENDPOINTS EDITAR MEDICAMENTO USUARIO
router.patch('/:idReceitaMedica/:idUsuario', verificarToken.verificarToken,
    authorization.verficarPermissao('EDITAR_MEDICAMENTOS'),
    authorization.verificarRelacao(), bodyParserJSON,
    async function (request, response) {

        let idReceitaMedica = request.params.idReceitaMedica
        let idUsuario = request.params.idUsuario
        let dados = request.body
        let contentType = request.headers['content-type']

        let result = await controllerEditarMedicamentoUsuario.editarMedicamentoUsuario(idReceitaMedica, idUsuario, dados, contentType)

        response.status(result.status_code)
        response.json(result)
    }
)

module.exports = router