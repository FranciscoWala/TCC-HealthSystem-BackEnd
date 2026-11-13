
/************************************************
    Objetivo: Arquivo responsável pela ROTA
    Data: 13/11/2026
    Autor: Kayque Brenno Ferreira Almeida
    Versão: 1.0
*************************************************/

const express = require('express')
const bodyParser = require('body-parser')

const router = express.Router()
const bodyParserJSON = bodyParser.json()

const verificacaoEmailController = require('../controllers/codigo_verificacao/controller_verificacao_email.js')
const redefinicaoSenhaController = require('../controllers/codigo_verificacao/controller_redefinicao_senha.js')
const limitarSolicitacoesEmail = require('../utils/limitar_tentativas/limitarSolicitacoesEmail.js')
const limitarSolicitacoesPorEmail = require('../utils/limitar_tentativas/limitarSolicitacoesPorEmail.js')
const limitarTentativasCadastro = require('../utils/limitar_tentativas/limitarTentativasCadastro.js')

// ========== GERAR CÓDIGO DE VERIFICAÇÃO DE E-MAIL ==========
router.post('/gerar', bodyParserJSON, limitarSolicitacoesEmail, limitarSolicitacoesPorEmail, async function (request, response) {
    let email = request.body.email

    let result = await verificacaoEmailController.gerarCodigoVerificacaoEmail(email)

    response.status(result.status_code)
    response.json(result)
})

// ========== GERAR CÓDIGO DE REDEFINIÇÃO DE SENHA ==========
router.post('/redefinir_senha/gerar', bodyParserJSON, limitarSolicitacoesEmail, limitarSolicitacoesPorEmail, async function (request, response) {
    let email = request.body.email

    let result = await redefinicaoSenhaController.gerarCodigoRedefinicaoSenha(email)

    response.status(result.status_code)
    response.json(result)
})

// ========== REDEFINIR SENHA ==========
router.post('/redefinir_senha', bodyParserJSON, limitarTentativasCadastro, async function (request, response) {
    let email = request.body.email
    let codigo = request.body.codigo
    let novaSenha = request.body.nova_senha

    let result = await redefinicaoSenhaController.redefinirSenha(email, codigo, novaSenha)

    response.status(result.status_code)
    response.json(result)
})

module.exports = router
