// Import no .env
require('dotenv').config()

// IMPORT DAS DEPENDENCIAS
const express = require('express')
const cors = require('cors')

// Criando um objeto do EXPRESS para criar a API
const app = express()

// Configurando o CORS
const corsOptions = {
    origin: '*',
    methods: 'GET, POST, PUT, DELETE, OPTIONS',
    allowedHeaders: ['Content-type', 'Authorization']
}

// Aplicar as config do CORS no APP (EXPRESS)
app.use(cors(corsOptions))

const roleRouter = require('./routes/role.router.js')
app.use('/v1/healthSystem/medtime/role', cors(), roleRouter)

const permissoesRouter = require('./routes/permissoes.router.js')
app.use('/v1/healthSystem/medtime/permissoes', cors(), permissoesRouter)

const doencaCronicaRouter = require('./routes/doenca_cronica.router.js')
app.use('/v1/healthSystem/medtime/doenca_cronica', cors(), doencaCronicaRouter)

const contatoEmergenciaRouter = require('./routes/contato_emergencia.router.js')
app.use('/v1/healthSystem/medtime/contato_emergencia', cors(), contatoEmergenciaRouter)

const tipoIntervaloRouter = require('./routes/tipo_intervalo.router.js')
app.use('/v1/healthSystem/medtime/tipo_intervalo', cors(), tipoIntervaloRouter)

// FAZER O START DA API
app.listen(8080, function() {
    console.log('API aguardando novas requisições...')
})