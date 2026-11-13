require('dotenv').config()

const enviarEmail = require('./utils/enviar_email/enviarEmail.js')

const testarEnvioEmail = async function () {
    let resultado = await enviarEmail.enviarEmail(
        'kayquebrenno321@gmail.com',
        'Teste de envio - MedTime',
        'Olá! Este é um teste de envio de e-mail realizado pelo MedTime.'
    )

    if (resultado)
        console.log('E-mail enviado com sucesso!')
    else
        console.log('Erro ao enviar e-mail.')
}

testarEnvioEmail()