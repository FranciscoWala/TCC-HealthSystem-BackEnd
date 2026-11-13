/*************************************************************************************************************************
 * Objetivo: Arquivo responsável pelo envio de e-mails do MedTime
 * Autor: Kayque Brenno Ferreira Almeida
 * Data: 12/11/2026
 * Versão: 1.0
**************************************************************************************************************************/

const nodemailer = require('nodemailer')

const enviarEmail = async function (destinatario, assunto, mensagem) {
    try {
        let transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASSWORD
            }
        })

        let resultado = await transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: destinatario,
            subject: assunto,
            text: mensagem
        })

        return resultado

    } catch (error) {
        console.log(error)
        return false
    }
}

module.exports = {
    enviarEmail
}