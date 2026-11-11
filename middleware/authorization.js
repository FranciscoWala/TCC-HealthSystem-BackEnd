const rolePermissoesDAO = require('../models/DAO/role_permissoes/role_permissoes.js')
const receitaMedicaDAO = require('../models/DAO/vinculo_paciente/vinculo_paciente.js')

function verficarPermissao(permissao) {

    return async function (request, response, next) {

        try {
            const roleUsuario = request.user.role

            const possuiPermissao = await temPermissao(roleUsuario, permissao)

            if (!possuiPermissao) {
                return response.status(403).json(
                    {
                        message: "USUÁRIO NÃO POSSUI PERMISSÃO"
                    }
                )
            }

            return next()
        } catch (error) {
            console.log(error)
            return response.status(500).json({ message: "Erro interno no servidor" })
        }
    }
}

function verificarRelacao() {

    return async function (request, response, next) {
        try {
            const idPaciente = request.params.idUsuario ?? request.params.id_usuario
            const idCuidador = request.user.id

            if (String(idPaciente) === String(idCuidador))
                return next()

            const possuiRelacao = await possuiRelacionamento(idPaciente, idCuidador)

            if (!possuiRelacao) {
                return response.status(404).json({
                    message: "INFORMAÇÕES NÃO ENCONTRADAS"
                })
            }

            return next()

        } catch (error) {
            console.log(error)
            return response.status(500).json({
                message: "Erro interno no servidor"
            })
        }
    }
}

async function possuiRelacionamento(idPaciente, idCuidador) {
    try {

        let relacao = await buscarVinculoByIDCuidador(idPaciente, idCuidador)

        if (relacao && relacao.length > 0) 
            return true
        else
            return false

    } catch (error) {
        console.log(error);
        return false
    }
}

async function temPermissao(roleUsuario, permissao) {
    try {
        let permissoes = await buscarPermissoesByRole(roleUsuario)

        if (permissoes.includes(permissao))
            return true;
        else
            return false

    } catch (error) {
        console.log(error)
        return false
    }
}


async function buscarPermissoesByRole(usuarioRole) {
    let permissoes = await rolePermissoesDAO.selectPermissoesByRole(usuarioRole)

    if (
        permissoes
        && typeof permissoes.permissoes === "string"
    ) {
        permissoes = permissoes.permissoes
            .split(',')
            .map(permissao => permissao.trim());
    }

    return permissoes
}

async function buscarVinculoByIDCuidador(idPaciente, idCuidador) {
    try {
        return await receitaMedicaDAO
                    .selectVinculoPacienteByIDPacienteAndIDCuidador(idPaciente, idCuidador)

    } catch (error) {
        console.log(error)
        throw error
    }
}


module.exports = {
    verficarPermissao,
    verificarRelacao
}