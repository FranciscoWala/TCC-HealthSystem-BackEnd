/************************************************ 
    Objetivo: Arquivo responsável pela ROTA
    data: 25/10/2026
    Autor: Kayque Brenno Ferreira Almeida
    Versão: 1.0
*************************************************/

const express = require('express')
const bodyParser = require('body-parser')

// Permitindo a utilização do JSON nas requisições
const bodyParserJSON = bodyParser.json()

const router = express.Router()

const usuarioController = require('../controllers/usuario/usuario.js')
const autenticarLogin = require('../middleware/autenticarLogin.js')
const verificarToken = require('../middleware/auth.js')
const authorization = require('../middleware/authorization.js')
const limitarTentativasCadastro = require('../utils/limitar_tentativas/limitarTentativasCadastro.js')

//                          ENDPOINTS USUARIO
router.post('/login', bodyParserJSON, autenticarLogin.autenticarLogin)

router.post('/', limitarTentativasCadastro, bodyParserJSON, async function (request, response) {
    let dados = request.body
    let contentType = request.headers['content-type']

    let result = await usuarioController.inserirNovoUsuario(dados, contentType)

    response.status(result.status_code)
    response.json(result)
})

router.put('/:id', verificarToken.verificarToken,
    authorization.verficarPermissao('EDITAR_PERFIL'),bodyParserJSON,
    async function (request, response) {
        
        let id = request.params.id
        let dados = request.body
        let contentType = request.headers['content-type']

        if (Number(request.user.id) != Number(id))
            return response.status(403).json({
                message: 'USUÁRIO NÃO AUTORIZADO'
            })

        let result = await usuarioController.atualizarUsuario(dados, id, contentType)

        response.status(result.status_code)
        response.json(result)
    }
)

module.exports = router