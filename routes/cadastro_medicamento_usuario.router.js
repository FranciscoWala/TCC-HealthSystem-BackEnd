/************************************************
    Objetivo: Arquivo responsável pela ROTA
    data: 27/10/2026
    Autor: Kayque Brenno Ferreira Almeida
    Versão: 1.0
*************************************************/

const express = require('express')
const bodyParser = require('body-parser')

const bodyParserJSON = bodyParser.json()

const router = express.Router()

const controllerCadastroMedicamentoUsuario = require('../controllers/cadastro_medicamento_usuario/controller_cadastro_medicamento_usuario.js')

const verificarToken = require('../middleware/auth.js')
const authorization = require('../middleware/authorization.js')

//                          ENDPOINTS CADASTRO MEDICAMENTO USUARIO
router.post('/:idUsuario', verificarToken.verificarToken,
    authorization.verficarPermissao('CADASTRAR_MEDICAMENTOS'),
    authorization.verificarRelacao(), bodyParserJSON,
    async function (request, response) {

        let idUsuario = request.idPacienteAutorizado
        let dados = request.body
        let contentType = request.headers['content-type']

        let result = await controllerCadastroMedicamentoUsuario.cadastrarMedicamentoUsuario(idUsuario, dados, contentType)

        response.status(result.status_code)
        response.json(result)
    }
)

module.exports = router