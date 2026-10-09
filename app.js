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

// FAZER O START DA API
app.listen(8080, function() {
    console.log('API aguardando novas requisições...')
})