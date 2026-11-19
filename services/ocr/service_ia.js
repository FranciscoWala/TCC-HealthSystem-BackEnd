/*******************************************************************************************
 * Objetivo: Realizar a interpretação do texto extraído pelo OCR utilizando IA
 * Autor: Kayque Brenno Ferreira Almeida
 * Data: 16/11/2026
 * Versão: 1.0
********************************************************************************************/

const { GoogleGenAI } = require('@google/genai')

const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY
})

const interpretarReceitaService = async function (texto, catalogos) {
    try {
        if (!texto || !catalogos)
            return false

        const resposta = await ai.models.generateContent({
            model: 'gemini-3.5-flash-lite',

            contents: `
Você é responsável por interpretar receitas médicas para o aplicativo MedTime,
utilizado também por pessoas idosas.

Sua tarefa é identificar os medicamentos, extrair as informações da receita
e relacionar os tipos de dosagem, unidades de medida e intervalos aos IDs
disponibilizados pelo sistema.

O texto foi obtido por OCR e pode conter erros de reconhecimento,
palavras incompletas, abreviações e informações ilegíveis.

REGRAS OBRIGATÓRIAS:

1. Extraia somente informações relacionadas aos medicamentos.

2. Nunca invente medicamentos, concentrações, doses, frequências,
   quantidades ou durações.

3. Se uma informação não puder ser identificada com segurança,
   retorne null no campo correspondente.

4. Utilize exclusivamente os IDs existentes nos catálogos fornecidos.

5. Nunca invente IDs ou utilize IDs que não estejam nas listas.

6. Identifique o tipo de dosagem correspondente à apresentação
   descrita na receita.

7. Você pode corrigir erros evidentes de OCR na apresentação,
   como "cumprimido" para "comprimido", quando o contexto
   permitir identificar a correspondência com segurança.

8. Não presuma que um medicamento existe somente em uma
   apresentação. Utilize as informações presentes na receita.

9. Identifique a concentração do medicamento separando
   o valor numérico da unidade de medida.
   Exemplo: "500 mg" corresponde à concentração 500
   e à unidade de medida mg.

10. Não confunda concentração com quantidade administrada.
    Exemplo: "Amoxilina 500 mg, tomar 1 comprimido":
    concentracao = 500
    dosagem = 1

11. Identifique a unidade de medida utilizada na administração.
    Exemplos:
    - 1 comprimido = unidade correspondente a "un"
    - 2 cápsulas = unidade correspondente a "un"
    - 5 mL = unidade correspondente a "ml"
    - 10 gotas = unidade correspondente a "gt"

12. Utilize o ID da unidade de medida correspondente,
    somente quando a equivalência estiver clara.

13. Identifique a frequência e o tipo de intervalo separadamente.

14. Quando a receita informar "a cada 8 horas":
    frequencia = 8
    id_tipo_intervalo = ID correspondente a "hora".

15. Quando a receita informar "a cada 2 dias":
    frequencia = 2
    id_tipo_intervalo = ID correspondente a "dia".

16. Quando houver uma frequência diária claramente equivalente
    a intervalos regulares, você pode normalizá-la:
    - uma vez ao dia = 1 dia
    - duas vezes ao dia = 12 horas
    - três vezes ao dia = 8 horas
    - quatro vezes ao dia = 6 horas

17. Expressões como "pela manhã" ou "à noite" não indicam
    um horário exato. Não invente horários de administração.

18. Expressões como "pela manhã e à noite" indicam dois
    períodos do dia, mas não garantem intervalos exatos
    de 12 horas. Não converta automaticamente essa expressão
    em uma frequência de 12 horas.

19. Se a receita informar apenas "se necessário",
    "se houver dor" ou outra condição sem intervalo,
    retorne null para frequencia e id_tipo_intervalo.

20. Se houver um intervalo explícito acompanhado de condição,
    mantenha o intervalo informado.
    Exemplo: "a cada 6 horas se necessário".

21. Identifique a quantidade total de medicamento prescrita
    para dispensação, quando estiver explicitamente informada.

    Exemplos:
    - "21 comprimidos" = quantidade_prescrita 21
    - "30 cápsulas" = quantidade_prescrita 30
    - "1 frasco" = quantidade_prescrita null,
      caso não seja possível identificar seu conteúdo
      na unidade de estoque utilizada pelo sistema.

22. Não confunda a quantidade total prescrita com a
    quantidade administrada em cada dose.

    Exemplo:
    "Amoxilina 500 mg - 21 comprimidos.
     Tomar 1 comprimido a cada 8 horas."

    concentracao = 500
    dosagem = 1
    quantidade_prescrita = 21

23. A quantidade_prescrita deve ser extraída somente
    quando estiver explicitamente informada na receita.

    Nunca calcule a quantidade prescrita utilizando
    a frequência ou a duração do tratamento.

    Nunca considere quantidade_prescrita como
    quantidade_em_estoque.

24. A dosagem deve representar a quantidade administrada
    por vez, utilizando a unidade correspondente.

25. Se a receita informar "1 a 2 comprimidos",
    não escolha arbitrariamente uma quantidade.
    Retorne null para dosagem.

26. Não altere nomes de medicamentos apenas por semelhança
    com nomes conhecidos. Preserve o nome identificável
    na receita.

27. Identifique informações complementares presentes
    na receita, como via de administração, condições
    de uso e duração expressamente prescrita.

    Preserve essas orientações no campo descricao,
    sem criar campos adicionais ou inventar informações.

28. Não presuma que uma apresentação seja injetável,
    oral ou tópica apenas pelo nome do medicamento.

29. Uma receita pode conter vários medicamentos.
    Identifique todos os medicamentos reconhecíveis.

30. Ignore informações administrativas, como nome do
    paciente, endereço, CRM, hospital e prontuário.

31. Quando não existir um registro correspondente
    nos catálogos, retorne null para o ID.

32. Se houver duas ou mais correspondências plausíveis
    para uma informação, retorne null para o ID.

33. A segurança do paciente tem prioridade sobre o
    preenchimento automático. Em caso de dúvida,
    não complete informações clínicas por suposição.

CATÁLOGOS DISPONÍVEIS NO MEDTIME:

Tipos de dosagem:
${JSON.stringify(catalogos.tipos_dosagem)}

Unidades de medida:
${JSON.stringify(catalogos.unidades_medida)}

Tipos de intervalo:
${JSON.stringify(catalogos.tipos_intervalo)}

Utilize os nomes, as siglas e os IDs desses catálogos
para identificar as correspondências.

O MedTime utiliza programações contínuas de medicamentos.

Não crie campos específicos para duração do tratamento,
como duracao_dias ou data_fim.

Se houver uma duração expressamente prescrita,
preserve essa informação somente em descricao.

Identifique somente a frequência e o tipo de intervalo
informados na receita.

Não invente horários ou datas de início.

Não transforme expressões como "por 7 dias" em
frequência ou data de término.

TEXTO EXTRAÍDO DA RECEITA:

${texto}
            `,

            config: {
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
                                        type: 'string',
                                        nullable: true
                                    },

                                    concentracao: {
                                        type: 'number',
                                        nullable: true
                                    },

                                    id_unidade_medida_embalagem: {
                                        type: 'integer',
                                        nullable: true
                                    },

                                    id_tipo_dosagem: {
                                        type: 'integer',
                                        nullable: true
                                    },

                                    dosagem: {
                                        type: 'number',
                                        nullable: true
                                    },

                                    id_unidade_medida: {
                                        type: 'integer',
                                        nullable: true
                                    },

                                    frequencia: {
                                        type: 'number',
                                        nullable: true
                                    },

                                    id_tipo_intervalo: {
                                        type: 'integer',
                                        nullable: true
                                    },

                                    quantidade_prescrita: {
                                        type: 'number',
                                        nullable: true
                                    },

                                    descricao: {
                                        type: 'string',
                                        nullable: true
                                    }
                                },

                                required: [
                                    'medicamento',
                                    'concentracao',
                                    'id_unidade_medida_embalagem',
                                    'id_tipo_dosagem',
                                    'dosagem',
                                    'id_unidade_medida',
                                    'frequencia',
                                    'id_tipo_intervalo',
                                    'quantidade_prescrita',
                                    'descricao'
                                ]
                            }
                        }
                    },

                    required: [
                        'medicamentos'
                    ]
                }
            }
        })

        let medicamentos = JSON.parse(resposta.text)

        if (medicamentos && Array.isArray(medicamentos.medicamentos))
            return medicamentos
        else
            return false

    } catch (error) {
        console.log(error)
        return false
    }
}

module.exports = {
    interpretarReceitaService
}