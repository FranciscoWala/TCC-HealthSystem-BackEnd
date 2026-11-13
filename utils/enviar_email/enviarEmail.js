/*************************************************************************************************************************
 * Objetivo: Arquivo responsável pelo envio de e-mails do MedTime
 * Autor: Kayque Brenno Ferreira Almeida
 * Data: 12/11/2026
 * Versão: 1.2
**************************************************************************************************************************/

const nodemailer = require('nodemailer')
const fs = require('fs')
const path = require('path')

const transporter = nodemailer.createTransport({
    service: 'gmail',
    pool: true,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
    }
})

const enviarEmail = async function (destinatario, assunto, mensagem, template = null) {
    try {
        let configuracaoEmail = {
            from: `"MedTime" <${process.env.EMAIL_USER}>`,
            to: destinatario,
            subject: assunto,
            text: mensagem
        }

        if (template) {
            let caminhoTemplate = path.join(__dirname, 'templates', `${template}.html`)
            let html = fs.readFileSync(caminhoTemplate, 'utf8')
            html = html.replace('{{codigo}}', mensagem)
            configuracaoEmail.html = html
            configuracaoEmail.text = `Seu código MedTime é ${mensagem}. Ele expira em 10 minutos. Não compartilhe este código.`
        }

        let resultado = await transporter.sendMail(configuracaoEmail)

        return resultado

    } catch (error) {
        console.log(error)
        return false
    }
}

module.exports = {
    enviarEmail
}