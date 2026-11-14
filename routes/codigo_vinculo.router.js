/************************************************
    Objetivo: Arquivo responsável pela ROTA
    data: 12/11/2026
    Autor: Kayque Brenno Ferreira Almeida
    Versão: 1.0
*************************************************/

const express = require('express')
const bodyParser = require('body-parser')

const router = express.Router()
const bodyParserJSON = bodyParser.json()

const codigoVinculoController = require('../controllers/codigo_verificacao/controller_codigo_vinculo.js')
const verificarToken = require('../middleware/auth.js')
const authorization = require('../middleware/authorization.js')
const limitarTentativas = require('../utils/limitar_tentativas/limitarTentativasCodigo.js')

// ========== GERAR CÓDIGO DE VÍNCULO ==========
router.post('/gerar', verificarToken.verificarToken,
    authorization.verficarPermissao('GERENCIAR_PACIENTES'), async function (request, response) {
    
    let idUsuario = request.user.id

    let result = await codigoVinculoController.gerarCodigoVinculo(idUsuario)

    response.status(result.status_code)
    response.json(result)
})

// ========== VALIDAR CÓDIGO DE VÍNCULO ==========
router.post('/validar', verificarToken.verificarToken, limitarTentativas.limitarTentativasCodigo(5, 10), bodyParserJSON, async function (request, response) {
    let idPaciente = request.user.id
    let codigo = request.body.codigo

    let result = await codigoVinculoController.validarCodigoVinculo(idPaciente, codigo)

    response.status(result.status_code)
    response.json(result)
})

module.exports = router