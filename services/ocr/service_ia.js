/*******************************************************************************************
- Objetivo: Realizar a interpretação da receita médica utilizando IA no formato do cadastro
- Autor: Kayque Brenno Ferreira Almeida
- Data: 16/11/2026
- Versão: 2.2
********************************************************************************************/

const { GoogleGenAI } = require('@google/genai')

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY
})

const aguardar = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

let cacheModelosDisponiveis = null

function isCotaDiariaEsgotada(erro) {
    const mensagem = JSON.stringify(erro || '')
    return mensagem.includes('PerDay') || mensagem.includes('GenerateRequestsPerDay')
}

async function obterModelosDisponiveis(aiClient) {
    if (cacheModelosDisponiveis && cacheModelosDisponiveis.length > 0) {
        return cacheModelosDisponiveis
    }

    const preferidos = [
        process.env.GEMINI_MODEL,
        process.env.GEMINI_FALLBACK_MODEL,
        'gemini-3.8-flash'
    ].filter(Boolean)

    try {
        const pager = await aiClient.models.list()
        const encontrados = []

        for await (const modelo of pager) {
            const nomeLimpo = String(modelo.name || '').replace(/^models\//, '')
            const acoes = modelo.supportedActions || modelo.supportedGenerationMethods || []
            const suportaGeracao = acoes.length === 0 || acoes.includes('generateContent')
            const especializadoNaoTexto = /(embedding|imagen|veo|tts|aqa|lyria|robotics|computer-use|deep-research)/i.test(nomeLimpo)

            if (nomeLimpo.startsWith('gemini-') && suportaGeracao && !especializadoNaoTexto) {
                encontrados.push(nomeLimpo)
            }
        }

        const ordenados = [
            ...preferidos.filter((p) => encontrados.includes(p)),
            ...encontrados
                .filter((n) => !preferidos.includes(n) && /(flash|pro)/i.test(n))
                .sort()
                .reverse()
        ]

        if (ordenados.length > 0) {
            cacheModelosDisponiveis = ordenados
            console.log('Modelos Gemini disponíveis nesta chave:', cacheModelosDisponiveis)
            return cacheModelosDisponiveis
        }
    } catch (erro) {
        console.warn('Falha ao listar modelos Gemini:', erro.message)
    }

    return preferidos
}

async function gerarConteudoComFallback(aiClient, params) {
    const modelos = await obterModelosDisponiveis(aiClient)
    let ultimoErro = null

    for (const modeloAtual of modelos) {
        for (let tentativa = 1; tentativa <= 2; tentativa++) {
            try {
                return await aiClient.models.generateContent({
                    ...params,
                    model: modeloAtual
                })
            } catch (erro) {
                ultimoErro = erro
                const status = erro?.status || erro?.error?.code

                if (status === 404 || (status === 429 && isCotaDiariaEsgotada(erro))) {
                    console.warn(`Modelo ${modeloAtual} indisponível ou sem cota diária (HTTP ${status}). Trocando de modelo...`)
                    break
                }

                if ((status === 503 || status === 429) && tentativa < 2) {
                    const tempoEspera = 2000 + Math.floor(Math.random() * 500)
                    console.warn(`Gemini (${modeloAtual}) ocupado (HTTP ${status}). Nova tentativa em ${tempoEspera}ms...`)
                    await aguardar(tempoEspera)
                    continue
                }

                break
            }
        }
    }

    throw ultimoErro
}

const interpretarReceitaService = async function (imagem, textoOcr, catalogos) {
    try {
        if (!imagem || !imagem.buffer || !catalogos)
            return false

        const contextoOcr = textoOcr
            ? `\nTEXTO AUXILIAR EXTRAÍDO POR OCR TRADICIONAL (pode conter falhas, priorize a leitura visual da imagem):\n${textoOcr}\n`
            : '\nNenhuma transcrição auxiliar disponível. Leia diretamente a imagem da receita.\n'

        const prompt = `
Você é responsável por interpretar receitas médicas (impressas ou manuscritas) para o aplicativo MedTime,
utilizado também por pessoas idosas.

Sua tarefa é analisar a imagem da receita, identificar os medicamentos, extrair as informações prescritas
e montar cada item exatamente na estrutura JSON de cadastro do sistema, relacionando os IDs dos catálogos fornecidos.

REGRAS ESPECÍFICAS PARA RECEITAS MANUSCRITAS:
- Analise cuidadosamente a caligrafia médica, considerando abreviações clínicas comuns no Brasil:
  - Vias: "VO" (via oral), "SL" (sublingual), "IM", "EV", "tópico".
  - Formas: "cp" / "comp" (comprimido), "caps" (cápsula), "gts" (gotas), "fr" (frasco), "cx" (caixa), "amp" (ampola), "env" (envelope).
  - Posologia: "8/8h" (frequencia = 8, intervalo = hora), "12/12h" (12 horas), "6/6h" (6 horas), "1x/dia" ou "1x ao dia" (1 dia), "2x/dia" (12 horas), "3x/dia" (8 horas).
- Se uma palavra manuscrita estiver borrada, ilegível ou ambígua (ex.: dúvida entre dois medicamentos diferentes), NÃO adivinhe: retorne null no campo correspondente.

REGRAS OBRIGATÓRIAS:
1. Extraia somente informações relacionadas aos medicamentos.
2. Nunca invente medicamentos, concentrações, doses, frequências ou durações.
3. Se uma informação não puder ser identificada com segurança, retorne null no campo correspondente.
4. Utilize exclusivamente os IDs existentes nos catálogos fornecidos. Nunca invente IDs.
5. Em "medicamento":
   - "nome": nome do princípio ativo ou comercial (ou null).
   - "imagem": sempre null.
   - "concentracao": valor numérico da concentração (ex.: "500 mg" -> 500).
   - "id_unidade_medida_embalagem": ID correspondente à unidade da concentração (ex.: "mg").
   - "id_tipo_dosagem": ID correspondente à forma farmacêutica (ex.: Comprimido, Gotas, Cápsula).
6. Em "estoque":
   - "quantidade_em_estoque": sempre null (será informado pelo usuário no aplicativo).
7. Em "receita_medica":
   - "dosagem": quantidade tomada por vez (não confunda com concentração; ex.: "Amoxicilina 500 mg, tomar 1 comprimido" -> concentracao = 500, dosagem = 1). Se informar "1 a 2 comprimidos", retorne null.
   - "id_unidade_medida": ID correspondente à unidade da dose administrada (comprimido/cápsula -> ID de "un", mL -> ID de "ml", gotas -> ID de "gt").
   - "descricao": orientações complementares (via, duração como "por 7 dias", condições de uso) ou null se não houver.
8. Em "programacao_medicamento":
   - "frequencia": intervalo numérico entre doses.
   - "id_tipo_intervalo": ID correspondente ao intervalo (ex.: hora, dia). Expressões vagas como "pela manhã", "à noite" ou "se necessário" sem intervalo exato devem retornar null em frequencia e id_tipo_intervalo.
   - "data_hora_inicio": sempre null (será escolhido pelo usuário no aplicativo).
9. Ignore dados administrativos (paciente, endereço, CRM, hospital, data).
10. A segurança do paciente tem prioridade sobre o preenchimento automático. Em caso de dúvida, retorne null.

CATÁLOGOS DISPONÍVEIS NO MEDTIME:
Tipos de dosagem: ${JSON.stringify(catalogos.tipos_dosagem)}
Unidades de medida: ${JSON.stringify(catalogos.unidades_medida)}
Tipos de intervalo: ${JSON.stringify(catalogos.tipos_intervalo)}
${contextoOcr}
`

        const resposta = await gerarConteudoComFallback(ai, {
            contents: [
                {
                    inlineData: {
                        data: imagem.buffer.toString('base64'),
                        mimeType: imagem.mimetype
                    }
                },
                prompt
            ],
            config: {
                temperature: 0.1,
                responseMimeType: 'application/json',
                responseSchema: {
                    type: 'object',
                    properties: {
                        medicamentos: {
                            type: 'array',
                            items: {
                                type: 'object',
                                properties: {
                                    medicamento: {
                                        type: 'object',
                                        properties: {
                                            nome: { type: 'string', nullable: true },
                                            imagem: { type: 'string', nullable: true },
                                            concentracao: { type: 'number', nullable: true },
                                            id_unidade_medida_embalagem: { type: 'integer', nullable: true },
                                            id_tipo_dosagem: { type: 'integer', nullable: true }
                                        },
                                        required: [
                                            'nome',
                                            'imagem',
                                            'concentracao',
                                            'id_unidade_medida_embalagem',
                                            'id_tipo_dosagem'
                                        ]
                                    },
                                    estoque: {
                                        type: 'object',
                                        properties: {
                                            quantidade_em_estoque: { type: 'integer', nullable: true }
                                        },
                                        required: ['quantidade_em_estoque']
                                    },
                                    receita_medica: {
                                        type: 'object',
                                        properties: {
                                            dosagem: { type: 'number', nullable: true },
                                            id_unidade_medida: { type: 'integer', nullable: true },
                                            descricao: { type: 'string', nullable: true }
                                        },
                                        required: [
                                            'dosagem',
                                            'id_unidade_medida',
                                            'descricao'
                                        ]
                                    },
                                    programacao_medicamento: {
                                        type: 'object',
                                        properties: {
                                            frequencia: { type: 'number', nullable: true },
                                            id_tipo_intervalo: { type: 'integer', nullable: true },
                                            data_hora_inicio: { type: 'string', nullable: true }
                                        },
                                        required: [
                                            'frequencia',
                                            'id_tipo_intervalo',
                                            'data_hora_inicio'
                                        ]
                                    }
                                },
                                required: [
                                    'medicamento',
                                    'estoque',
                                    'receita_medica',
                                    'programacao_medicamento'
                                ]
                            }
                        }
                    },
                    required: ['medicamentos']
                }
            }
        })

        if (!resposta || !resposta.text)
            return false

        let medicamentos = JSON.parse(resposta.text)

        if (medicamentos && Array.isArray(medicamentos.medicamentos))
            return medicamentos
        else
            return false

    } catch (error) {
        console.log('Erro no interpretarReceitaService:', error)
        return false
    }
}

module.exports = {
    interpretarReceitaService
}