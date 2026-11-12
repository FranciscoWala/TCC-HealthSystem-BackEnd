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
    methods: 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
    allowedHeaders: ['Content-type', 'Authorization']
}

// Aplicar as config do CORS no APP (EXPRESS)
app.use(cors(corsOptions))

const roleRouter = require('./routes/role.router.js')
app.use('/v1/healthSystem/medtime/role', cors(), roleRouter)

const estoqueRouter = require('./routes/estoque.router.js')
app.use('/v1/healthSystem/medtime/estoque', cors(), estoqueRouter)

const tipoIntervaloRouter = require('./routes/tipo_intervalo.router.js')
app.use('/v1/healthSystem/medtime/tipo_intervalo', cors(), tipoIntervaloRouter)

const tipoDosagemRouter = require('./routes/tipo_dosagem.router.js')
app.use('/v1/healthSystem/medtime/tipo_dosagem', cors(), tipoDosagemRouter)

const unidadeMedidaRouter = require('./routes/unidade_medida.router.js')
app.use('/v1/healthSystem/medtime/unidade_medida', cors(), unidadeMedidaRouter)

const historicoMedicamentoRouter = require('./routes/historico_medicamento.router.js')
app.use('/v1/healthSystem/medtime/historico_medicamento', cors(), historicoMedicamentoRouter)

const receitaMedicaRouter = require('./routes/receita_medica.router.js')
app.use('/v1/healthSystem/medtime/receita_medica', cors(), receitaMedicaRouter)

const usuarioRouter = require('./routes/usuario.router.js')
app.use('/v1/healthSystem/medtime/usuario', cors(), usuarioRouter)

const agendaMedicamentoRouter = require('./routes/agenda_medicamentos.router.js')
app.use('/v1/healthSystem/medtime/agenda_medicamento', cors(), agendaMedicamentoRouter)

const cadastroMedicamentoUsuarioRouter = require('./routes/cadastro_medicamento_usuario.router.js')
app.use('/v1/healthSystem/medtime/cadastro_medicamento', cors(), cadastroMedicamentoUsuarioRouter)

const excluirMedicamentoUsuarioRouter = require('./routes/excluir_medicamento_usuario.router.js')
app.use('/v1/healthSystem/medtime/excluir_medicamento', cors(), excluirMedicamentoUsuarioRouter)

const editarMedicamentoUsuarioRouter = require('./routes/editar_medicamento_usuario.router.js')
app.use('/v1/healthSystem/medtime/editar_medicamento', cors(), editarMedicamentoUsuarioRouter)

const routerUsuarioGoogle = require('./routes/usuario_google.router.js')
app.use('/v1/healthSystem/medtime/usuario/google', routerUsuarioGoogle)

const codigoVinculoRouter = require('./routes/codigo_vinculo.router.js')
app.use('/v1/healthSystem/medtime/codigo_vinculo', cors(), codigoVinculoRouter)

const vinculoPacienteRouter = require('./routes/vinculo_paciente.router.js')
app.use('/v1/healthSystem/medtime/vinculo_paciente', cors(), vinculoPacienteRouter)

// FAZER O START DA API
app.listen(8080, function() {
    console.log('API aguardando novas requisições...')
})