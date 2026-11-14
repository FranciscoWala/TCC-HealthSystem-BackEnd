/************************************************
    Objetivo: Arquivo responsável pela ROTA
    data: 25/10/2026
    Autor: Kayque Brenno Ferreira Almeida
    Versão: 1.0
*************************************************/

const express = require('express')

const router = express.Router()

const controllerEstoque = require('../controllers/estoque/controller_estoque.js')
const verificarToken = require('../middleware/auth.js')
const authorization = require('../middleware/authorization.js')

//                          ENDPOINTS ESTOQUE
router.get('/usuario/:idUsuario', verificarToken.verificarToken,
    authorization.verficarPermissao('VISUALIZAR_MEDICAMENTOS'),
    authorization.verificarRelacao(),
    async function (request, response) {
        
        let idUsuario = request.params.idUsuario

        let result = await controllerEstoque.listarEstoquePorUsuario(idUsuario)

        response.status(result.status_code)
        response.json(result)
    }
)

module.exports = router