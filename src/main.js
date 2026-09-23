// ============================================================
// GVX ENGENHARIA - SISTEMA DE ORÇAMENTOS
// ============================================================
// Histórico salvo em localStorage.
// Imagem A4 gerada com html2canvas.
// ============================================================


const html2canvas = window.html2canvas;

const CHAVE_HISTORICO =
    'gvx_historico_orcamentos';


// ============================================================
// FATORES DE COMPLEXIDADE
// ============================================================

const itensComplexidades = [

    {
        id: 'balanco1',
        nome: 'BALANÇO (2 à 4m)',
        taxa: 0.10,
        qtd: 0
    },

    {
        id: 'balanco2',
        nome: 'BALANÇO (>4m)',
        taxa: 0.20,
        qtd: 0
    },

    {
        id: 'transicao1',
        nome: 'VIGA DE TRANSIÇÃO (2 - 4m)',
        taxa: 0.10,
        qtd: 0
    },

    {
        id: 'transicao2',
        nome: 'VIGA DE TRANSIÇÃO (4 - 6m)',
        taxa: 0.15,
        qtd: 0
    },

    {
        id: 'transicao3',
        nome: 'VIGA DE TRANSIÇÃO (>6m)',
        taxa: 0.20,
        qtd: 0
    },

    {
        id: 'vigaVao1',
        nome: 'VIGA VÃO (6 - 9m)',
        taxa: 0.10,
        qtd: 0
    },

    {
        id: 'vigaVao2',
        nome: 'VIGA VÃO (>9m)',
        taxa: 0.15,
        qtd: 0
    },

    {
        id: 'escada',
        nome: 'ESCADA MODERNA',
        taxa: 0.07,
        qtd: 0
    },

    {
        id: 'desnivel1',
        nome: 'TERRENO DESNÍVEL (3 - 6m)',
        taxa: 0.10,
        qtd: 0
    },

    {
        id: 'desnivel2',
        nome: 'TERRENO DESNÍVEL (>6m)',
        taxa: 0.15,
        qtd: 0
    },

    {
        id: 'fundProf',
        nome: 'FUNDAÇÃO PROFUNDA',
        taxa: 0.15,
        qtd: 0
    },

    {
        id: 'fundExc',
        nome: 'FUNDAÇÃO EXCENTRICA',
        taxa: 0.10,
        qtd: 0
    },

    {
        id: 'piscina',
        nome: 'PISCINA NA COBERTURA',
        taxa: 0.20,
        qtd: 0
    },

    {
        id: 'detalheExtra',
        nome: 'Detalhe a mais',
        taxa: 0.10,
        qtd: 0
    }

];


// ============================================================
// ELEMENTOS
// ============================================================

const telaInicio =
    document.getElementById('telaInicio');

const appContainer =
    document.getElementById('appContainer');

const btnIrNovo =
    document.getElementById('btnIrNovo');

const btnIrHistorico =
    document.getElementById('btnIrHistorico');

const btnVoltarInicio =
    document.getElementById('btnVoltarInicio');

const btnNovo =
    document.getElementById('tabNovo');

const btnHistorico =
    document.getElementById('tabHistorico');

const secaoNovo =
    document.getElementById('secaoNovo');

const secaoHistorico =
    document.getElementById('secaoHistorico');

const campoData =
    document.getElementById('dataOrcamento');


if (campoData) {

    campoData.valueAsDate =
        new Date();

}


// ============================================================
// NAVEGAÇÃO
// ============================================================

btnIrNovo?.addEventListener(
    'click',
    () => {

        telaInicio.classList.add(
            'hidden'
        );

        appContainer.classList.remove(
            'hidden'
        );

        btnNovo?.click();

    }
);


btnIrHistorico?.addEventListener(
    'click',
    () => {

        telaInicio.classList.add(
            'hidden'
        );

        appContainer.classList.remove(
            'hidden'
        );

        btnHistorico?.click();

    }
);


btnVoltarInicio?.addEventListener(
    'click',
    () => {

        appContainer.classList.add(
            'hidden'
        );

        telaInicio.classList.remove(
            'hidden'
        );

    }
);


btnNovo?.addEventListener(
    'click',
    () => {

        btnNovo.classList.add(
            'active'
        );

        btnHistorico.classList.remove(
            'active'
        );

        secaoNovo.classList.remove(
            'hidden'
        );

        secaoHistorico.classList.add(
            'hidden'
        );

    }
);


btnHistorico?.addEventListener(
    'click',
    () => {

        btnHistorico.classList.add(
            'active'
        );

        btnNovo.classList.remove(
            'active'
        );

        secaoHistorico.classList.remove(
            'hidden'
        );

        secaoNovo.classList.add(
            'hidden'
        );

        renderizarHistorico();

    }
);


// ============================================================
// RENDERIZAR COMPLEXIDADES
// ============================================================

function renderizarComplexidades() {

    const container =
        document.getElementById(
            'listaComplexidades'
        );


    if (!container) {

        console.warn(
            'Elemento #listaComplexidades não encontrado.'
        );

        return;
    }


    container.innerHTML = '';


    itensComplexidades.forEach(
        (item, index) => {

            const div =
                document.createElement(
                    'div'
                );


            div.className =
                'complex-item';


            div.innerHTML = `

                <div class="complex-info">

                    <p>
                        ${escaparHtml(item.nome)}
                    </p>

                    <span>
                        Acréscimo:
                        ${(item.taxa * 100).toFixed(0)}%
                    </span>

                </div>


                <div class="counter-box">

                    <button
                        type="button"
                        data-index="${index}"
                        data-delta="-1"
                        class="btn-cnt btn-qtd"
                        aria-label="Diminuir quantidade"
                    >
                        −
                    </button>


                    <span
                        id="qtd_${index}"
                        class="qtd-value"
                    >
                        ${item.qtd}
                    </span>


                    <button
                        type="button"
                        data-index="${index}"
                        data-delta="1"
                        class="btn-cnt btn-qtd btn-plus"
                        aria-label="Aumentar quantidade"
                    >
                        +
                    </button>

                </div>

            `;


            container.appendChild(
                div
            );

        }
    );


    container
        .querySelectorAll('.btn-qtd')
        .forEach(
            button => {

                button.addEventListener(
                    'click',
                    () => {

                        const index =
                            Number(
                                button.dataset.index
                            );

                        const delta =
                            Number(
                                button.dataset.delta
                            );

                        alterarQtd(
                            index,
                            delta
                        );

                    }
                );

            }
        );

}


// ============================================================
// ALTERAR QUANTIDADE
// ============================================================

function alterarQtd(
    index,
    delta
) {

    if (!itensComplexidades[index]) {

        return;
    }


    itensComplexidades[index].qtd +=
        delta;


    if (
        itensComplexidades[index].qtd <
        0
    ) {

        itensComplexidades[index].qtd =
            0;
    }


    const spanQtd =
        document.getElementById(
            `qtd_${index}`
        );


    if (spanQtd) {

        spanQtd.textContent =
            itensComplexidades[index].qtd;
    }


    calcularOrcamento();

}


// ============================================================
// FORMATAÇÃO DE MOEDA
// ============================================================

function formatarMoeda(
    valor
) {

    return Number(
        valor || 0
    ).toLocaleString(
        'pt-BR',
        {
            style: 'currency',
            currency: 'BRL'
        }
    );

}


// ============================================================
// CÁLCULO
// ============================================================

function calcularOrcamento() {

    const area =
        parseFloat(
            document.getElementById(
                'areaConstruida'
            )?.value
        ) || 0;


    const precoM2 =
        parseFloat(
            document.getElementById(
                'precoMetro'
            )?.value
        ) || 0;


    const percNota =
        parseFloat(
            document.getElementById(
                'notaFiscal'
            )?.value
        ) || 0;


    // Valor base

    const totalBase =
        area *
        precoM2;


    // Acréscimos

    let totalAcrescimoReais =
        0;


    itensComplexidades.forEach(
        item => {

            if (item.qtd > 0) {

                totalAcrescimoReais +=
                    totalBase *
                    item.taxa *
                    item.qtd;

            }

        }
    );


    // Total com acréscimos

    const totalComAcrescimo =
        totalBase +
        totalAcrescimoReais;


    // Nota fiscal

    const valorNota =
        totalComAcrescimo *
        (
            percNota / 100
        );


    // Valor final

    const precoFinal =
        totalComAcrescimo +
        valorNota;


    const resultado =
        document.getElementById(
            'resPrecoFinal'
        );


    if (resultado) {

        resultado.textContent =
            formatarMoeda(
                precoFinal
            );

    }


    return precoFinal;

}


// ============================================================
// ATUALIZAÇÃO AUTOMÁTICA DO CÁLCULO
// ============================================================

document
    .getElementById(
        'areaConstruida'
    )
    ?.addEventListener(
        'input',
        calcularOrcamento
    );


document
    .getElementById(
        'precoMetro'
    )
    ?.addEventListener(
        'input',
        calcularOrcamento
    );


document
    .getElementById(
        'notaFiscal'
    )
    ?.addEventListener(
        'input',
        calcularOrcamento
    );


// ============================================================
// HISTÓRICO
// ============================================================

function lerHistorico() {

    const dados =
        localStorage.getItem(
            CHAVE_HISTORICO
        );


    if (!dados) {

        return [];
    }


    try {

        const historico =
            JSON.parse(
                dados
            );


        return Array.isArray(
            historico
        )
            ? historico
            : [];

    } catch (error) {

        console.warn(
            'Histórico inválido. Um novo histórico será criado.',
            error
        );


        localStorage.removeItem(
            CHAVE_HISTORICO
        );


        return [];

    }

}


// ============================================================
// SALVAR HISTÓRICO
// ============================================================

function salvarHistorico(
    historico
) {

    localStorage.setItem(
        CHAVE_HISTORICO,
        JSON.stringify(
            historico
        )
    );

}


// ============================================================
// EXEMPLOS
// ============================================================

function inicializarExemplosHistorico() {

    if (
        lerHistorico().length >
        0
    ) {

        return;
    }


    const exemplos = [

        {

            numOrcamento:
                '001/2026',

            data:
                '2026-06-01',

            cliente:
                'Francisco Carlos de Sousa',

            descricao:
                'Residência Unifamiliar - 2 Pavimentos',

            area:
                180,

            precoMetro:
                25,

            notaFiscal:
                0,

            complexidades: [
                1,
                0,
                0,
                0,
                0,
                1,
                0,
                0,
                0,
                0,
                0,
                0,
                0,
                0
            ],

            valorTotal:
                'R$ 5.062,50'

        },


        {

            numOrcamento:
                '002/2026',

            data:
                '2026-06-15',

            cliente:
                'Maria das Graças Ximenes',

            descricao:
                'Edifício Comercial - 3 Pavimentos',

            area:
                320,

            precoMetro:
                30,

            notaFiscal:
                5,

            complexidades: [
                0,
                1,
                1,
                0,
                0,
                0,
                1,
                1,
                0,
                0,
                1,
                0,
                0,
                0
            ],

            valorTotal:
                'R$ 13.345,20'

        }

    ];


    salvarHistorico(
        exemplos
    );

}


// ============================================================
// SALVAR NO HISTÓRICO
// ============================================================

function salvarNoHistorico(
    orcamentoObj
) {

    const historico =
        lerHistorico();


    const indexExistente =
        historico.findIndex(
            item =>
                item.numOrcamento ===
                orcamentoObj.numOrcamento
        );


    if (
        indexExistente >= 0
    ) {

        historico[
            indexExistente
        ] =
            orcamentoObj;

    } else {

        historico.unshift(
            orcamentoObj
        );

    }


    salvarHistorico(
        historico
    );

}


// ============================================================
// RENDERIZAR HISTÓRICO
// ============================================================

function renderizarHistorico() {

    const container =
        document.getElementById(
            'listaHistorico'
        );


    if (!container) {

        return;
    }


    const historico =
        lerHistorico();


    container.innerHTML =
        '';


    if (
        historico.length ===
        0
    ) {

        container.innerHTML = `

            <div class="history-empty">

                Nenhum orçamento salvo.

            </div>

        `;

        return;
    }


    historico.forEach(
        (
            item,
            index
        ) => {

            const div =
                document.createElement(
                    'div'
                );


            div.className =
                'history-card';


            div.innerHTML = `

                <div class="history-info">

                    <b>

                        Nº
                        ${escaparHtml(
                            item.numOrcamento
                        )}

                        -

                        ${escaparHtml(
                            item.cliente
                        )}

                    </b>


                    <p>

                        ${escaparHtml(
                            item.descricao ||
                            'Sem descrição'
                        )}

                        •

                        ${
                            item.data
                                ? item.data
                                    .split('-')
                                    .reverse()
                                    .join('/')
                                : ''
                        }

                    </p>


                    <strong>

                        ${escaparHtml(
                            item.valorTotal ||
                            'R$ 0,00'
                        )}

                    </strong>

                </div>


                <button
                    type="button"
                    data-index="${index}"
                    class="btn-load btn-abrir"
                >

                    Abrir

                </button>

            `;


            container.appendChild(
                div
            );

        }
    );


    container
        .querySelectorAll(
            '.btn-abrir'
        )
        .forEach(
            button => {

                button.addEventListener(
                    'click',
                    () => {

                        const index =
                            Number(
                                button.dataset.index
                            );


                        const historicoAtual =
                            lerHistorico();


                        const item =
                            historicoAtual[
                                index
                            ];


                        if (item) {

                            abrirMenuOpcoes(
                                item
                            );

                        }

                    }
                );

            }
        );

}


// ============================================================
// MENU DE AÇÕES
// ============================================================

function abrirMenuOpcoes(
    item
) {

    const modal =
        document.createElement(
            'div'
        );


    modal.className =
        'modal-overlay';


    modal.innerHTML = `

        <div
            class="modal-card"
            role="dialog"
            aria-modal="true"
            aria-labelledby="modalTitulo"
        >

            <h3 id="modalTitulo">

                Orçamento Nº
                ${escaparHtml(
                    item.numOrcamento
                )}

            </h3>


            <p>

                Escolha a ação desejada
                para este orçamento:

            </p>


            <button
                type="button"
                id="btnAtualizar"
                class="modal-btn modal-primary"
            >

                Atualizar Orçamento

            </button>


            <button
                type="button"
                id="btnBaixar"
                class="modal-btn modal-gold"
            >

                Baixar Orçamento

            </button>


            <button
                type="button"
                id="btnExcluir"
                class="modal-btn modal-danger"
            >

                Excluir Orçamento

            </button>


            <button
                type="button"
                id="btnCancelar"
                class="modal-btn modal-cancel"
            >

                Cancelar

            </button>

        </div>

    `;


    document.body.appendChild(
        modal
    );


    // ATUALIZAR

    modal
        .querySelector(
            '#btnAtualizar'
        )
        .addEventListener(
            'click',
            () => {

                carregarOrcamento(
                    item
                );

                modal.remove();

            }
        );


    // BAIXAR IMAGEM A4

    modal
        .querySelector(
            '#btnBaixar'
        )
        .addEventListener(
            'click',
            async () => {

                modal.remove();

                await gerarImagemA4Especifica(
                    item
                );

            }
        );


    // EXCLUIR

    modal
        .querySelector(
            '#btnExcluir'
        )
        .addEventListener(
            'click',
            () => {

                excluirOrcamento(
                    item
                );

                modal.remove();

            }
        );


    // CANCELAR

    modal
        .querySelector(
            '#btnCancelar'
        )
        .addEventListener(
            'click',
            () => {

                modal.remove();

            }
        );


    // CLIQUE FORA

    modal.addEventListener(
        'click',
        event => {

            if (
                event.target ===
                modal
            ) {

                modal.remove();

            }

        }
    );

}


// ============================================================
// EXCLUIR ORÇAMENTO
// ============================================================

function excluirOrcamento(
    item
) {

    const confirmou =
        window.confirm(

            `Excluir o orçamento Nº ${item.numOrcamento}?\n\nEsta ação não poderá ser desfeita.`

        );


    if (!confirmou) {

        return;
    }


    const historico =
        lerHistorico().filter(
            registro =>
                registro.numOrcamento !==
                item.numOrcamento
        );


    salvarHistorico(
        historico
    );


    renderizarHistorico();

}


// ============================================================
// CARREGAR ORÇAMENTO
// ============================================================

function carregarOrcamento(
    item
) {

    const numOrcamento =
        document.getElementById(
            'numOrcamento'
        );


    const dataOrcamento =
        document.getElementById(
            'dataOrcamento'
        );


    const cliente =
        document.getElementById(
            'cliente'
        );


    const descricaoObra =
        document.getElementById(
            'descricaoObra'
        );


    const areaConstruida =
        document.getElementById(
            'areaConstruida'
        );


    const precoMetro =
        document.getElementById(
            'precoMetro'
        );


    const notaFiscal =
        document.getElementById(
            'notaFiscal'
        );


    if (numOrcamento) {

        numOrcamento.value =
            item.numOrcamento ||
            '';

    }


    if (dataOrcamento) {

        dataOrcamento.value =
            item.data ||
            '';

    }


    if (cliente) {

        cliente.value =
            item.cliente ||
            '';

    }


    if (descricaoObra) {

        descricaoObra.value =
            item.descricao ||
            '';

    }


    if (areaConstruida) {

        areaConstruida.value =
            item.area ??
            '';

    }


    if (precoMetro) {

        precoMetro.value =
            item.precoMetro ??
            '';

    }


    if (notaFiscal) {

        notaFiscal.value =
            item.notaFiscal ??
            0;

    }


    itensComplexidades.forEach(
        (
            comp,
            index
        ) => {

            comp.qtd =
                Number(
                    item
                        .complexidades?.[
                            index
                        ] ||
                    0
                );

        }
    );


    renderizarComplexidades();

    calcularOrcamento();


    btnNovo?.click();

}


// ============================================================
// OBTER ORÇAMENTO ATUAL
// ============================================================

function obterOrcamentoAtual() {

    return {

        numOrcamento:

            document
                .getElementById(
                    'numOrcamento'
                )
                ?.value
                .trim() ||
            '',


        data:

            document
                .getElementById(
                    'dataOrcamento'
                )
                ?.value ||
            '',


        cliente:

            document
                .getElementById(
                    'cliente'
                )
                ?.value
                .trim() ||
            'Cliente não informado',


        descricao:

            document
                .getElementById(
                    'descricaoObra'
                )
                ?.value
                .trim() ||
            '',


        area:

            document
                .getElementById(
                    'areaConstruida'
                )
                ?.value ||
            '',


        precoMetro:

            document
                .getElementById(
                    'precoMetro'
                )
                ?.value ||
            '',


        notaFiscal:

            document
                .getElementById(
                    'notaFiscal'
                )
                ?.value ||
            '',


        complexidades:

            itensComplexidades.map(
                item =>
                    item.qtd
            ),


        valorTotal:

            document
                .getElementById(
                    'resPrecoFinal'
                )
                ?.textContent ||
            'R$ 0,00'

    };

}


// ============================================================
// SALVAR ORÇAMENTO
// ============================================================

function salvarOrcamentoAtual() {

    const orcamento =
        obterOrcamentoAtual();


    if (
        !orcamento.numOrcamento
    ) {

        alert(
            'Informe o número do orçamento antes de salvar.'
        );

        return;
    }


    salvarNoHistorico(
        orcamento
    );


    renderizarHistorico();


    btnHistorico?.click();

}


document
    .getElementById(
        'btnSalvarOrcamento'
    )
    ?.addEventListener(
        'click',
        salvarOrcamentoAtual
    );


// ============================================================
// ESCAPAR HTML
// ============================================================

function escaparHtml(
    valor
) {

    return String(
        valor ?? ''
    )
        .replace(
            /&/g,
            '&amp;'
        )
        .replace(
            /</g,
            '&lt;'
        )
        .replace(
            />/g,
            '&gt;'
        )
        .replace(
            /"/g,
            '&quot;'
        )
        .replace(
            /'/g,
            '&#039;'
        );

}


// ============================================================
// NOME DO ARQUIVO
// ============================================================

function formatarNomeArquivo(
    valor
) {

    return String(
        valor ||
        'Cliente'
    )
        .normalize(
            'NFD'
        )
        .replace(
            /[\u0300-\u036f]/g,
            ''
        )
        .replace(
            /[^a-zA-Z0-9]+/g,
            '_'
        )
        .replace(
            /^_+|_+$/g,
            ''
        ) ||
        'Cliente';

}


// ============================================================
// ESPERAR IMAGENS
// ============================================================

async function esperarImagens(
    elemento
) {

    const imagens =
        Array.from(
            elemento.querySelectorAll(
                'img'
            )
        );


    await Promise.all(

        imagens.map(
            img => {

                if (
                    img.complete &&
                    img.naturalWidth >
                        0
                ) {

                    return Promise.resolve();

                }


                return new Promise(
                    resolve => {

                        img.addEventListener(
                            'load',
                            resolve,
                            {
                                once: true
                            }
                        );


                        img.addEventListener(
                            'error',
                            resolve,
                            {
                                once: true
                            }
                        );

                    }
                );

            }
        )

    );

}


// ============================================================
// GERAR IMAGEM A4
// ============================================================

async function gerarImagemA4Especifica(
    item
) {

    if (
        typeof html2canvas !==
        'function'
    ) {

        alert(
            'A ferramenta de geração da Imagem A4 não foi carregada. Recarregue a página.'
        );

        return;
    }


    let itensHtml =
        '';


    itensComplexidades.forEach(
        (
            comp,
            index
        ) => {

            const qtd =
                Number(
                    item
                        .complexidades?.[
                            index
                        ] ||
                    0
                );


            if (
                qtd > 0
            ) {

                itensHtml += `

                    <tr>

                        <td
                            style="
                                padding: 12px 16px;
                                border-bottom: 1px solid #e2e8f0;
                                color: #334155;
                                font-weight: 500;
                                font-size: 14px;
                            "
                        >

                            ${escaparHtml(
                                comp.nome
                            )}

                        </td>


                        <td
                            style="
                                padding: 12px 16px;
                                border-bottom: 1px solid #e2e8f0;
                                text-align: center;
                                color: #334155;
                                font-weight: 600;
                                font-size: 14px;
                            "
                        >

                            ${qtd}

                        </td>


                        <td
                            style="
                                padding: 12px 16px;
                                border-bottom: 1px solid #e2e8f0;
                                text-align: right;
                                color: #0b192c;
                                font-weight: bold;
                                font-size: 14px;
                            "
                        >

                            ${(comp.taxa * 100).toFixed(0)}%

                        </td>

                    </tr>

                `;

            }

        }
    );


    const elemento =
        document.createElement(
            'div'
        );


    Object.assign(
        elemento.style,
        {

            width:
                '794px',

            height:
                '1123px',

            position:
                'absolute',

            left:
                '-99999px',

            top:
                '0',

            fontFamily:
                'Inter, Arial, sans-serif',

            boxSizing:
                'border-box',

            backgroundColor:
                '#ffffff',

            padding:
                '55px 70px 35px',

            display:
                'flex',

            flexDirection:
                'column',

            justifyContent:
                'space-between'

        }
    );


    elemento.innerHTML = `

        <div>

            <div
                style="
                    height: 135px;
                    display: flex;
                    align-items: flex-start;
                    margin-bottom: 25px;
                "
            >

                <img
                    src="./logo-cabecalho.png"
                    alt="GVX Engenharia - Projetos Estruturais"
                    style="
                        width: 360px;
                        height: 135px;
                        object-fit: contain;
                        object-position: left top;
                        display: block;
                    "
                >

            </div>


            <div
                style="
                    display: flex;
                    justify-content: space-between;
                    align-items: flex-end;
                    border-bottom: 2px solid #0b192c;
                    padding-bottom: 7px;
                    margin-bottom: 20px;
                "
            >

                <h2
                    style="
                        margin: 0;
                        color: #0b192c;
                        font-size: 16px;
                        font-weight: 800;
                        text-transform: uppercase;
                    "
                >

                    Orçamento de Projeto Estrutural

                </h2>


                <div
                    style="
                        text-align: right;
                        font-size: 13px;
                        color: #475569;
                        line-height: 1.35;
                        white-space: nowrap;
                    "
                >

                    <strong>
                        Orçamento Nº:
                    </strong>

                    ${escaparHtml(
                        item.numOrcamento
                    )}

                    <br>

                    <strong>
                        Data:
                    </strong>

                    ${
                        item.data
                            ? item.data
                                .split('-')
                                .reverse()
                                .join('/')
                            : ''
                    }

                </div>

            </div>


            <div
                style="
                    background: #f8fafc;
                    border: 1px solid #e2e8f0;
                    border-radius: 10px;
                    padding: 14px 18px;
                    margin-bottom: 20px;
                    font-size: 14px;
                    color: #475569;
                "
            >

                <p
                    style="
                        margin: 0 0 7px 0;
                    "
                >

                    <strong
                        style="
                            color: #334155;
                        "
                    >
                        Cliente:
                    </strong>

                    ${escaparHtml(
                        item.cliente ||
                        'Cliente não informado'
                    )}

                </p>


                <p
                    style="
                        margin: 0;
                    "
                >

                    <strong
                        style="
                            color: #334155;
                        "
                    >
                        Descrição da Obra:
                    </strong>

                    ${escaparHtml(
                        item.descricao ||
                        'Sem descrição'
                    )}

                </p>

            </div>


            <table
                style="
                    width: 100%;
                    border-collapse: collapse;
                    margin-bottom: 20px;
                "
            >

                <thead>

                    <tr
                        style="
                            background: #0b192c;
                            color: white;
                        "
                    >

                        <th
                            style="
                                padding: 12px 16px;
                                text-align: left;
                                font-size: 14px;
                            "
                        >
                            Fator de Complexidade
                        </th>


                        <th
                            style="
                                padding: 12px 16px;
                                text-align: center;
                                font-size: 14px;
                            "
                        >
                            Qtd
                        </th>


                        <th
                            style="
                                padding: 12px 16px;
                                text-align: right;
                                font-size: 14px;
                            "
                        >
                            Acréscimo
                        </th>

                    </tr>

                </thead>


                <tbody>

                    ${
                        itensHtml ||
                        `

                            <tr>

                                <td
                                    colspan="3"
                                    style="
                                        padding: 20px;
                                        text-align: center;
                                        color: #64748b;
                                        font-size: 14px;
                                    "
                                >

                                    Nenhum fator de complexidade adicional selecionado.

                                </td>

                            </tr>

                        `
                    }

                </tbody>

            </table>


            <div
                style="
                    background: #f8fafc;
                    border: 2px solid #0b192c;
                    padding: 16px 24px;
                    border-radius: 12px;
                    text-align: right;
                "
            >

                <p
                    style="
                        margin: 0;
                        font-size: 14px;
                        color: #475569;
                        font-weight: 600;
                        text-transform: uppercase;
                    "
                >

                    Valor Total do Projeto:

                </p>


                <p
                    style="
                        margin: 4px 0 0 0;
                        font-size: 26px;
                        color: #0b192c;
                        font-weight: 800;
                    "
                >

                    ${escaparHtml(
                        item.valorTotal ||
                        'R$ 0,00'
                    )}

                </p>

            </div>

        </div>


        <div
            style="
                width: 100%;
                height: 75px;
                display: flex;
                align-items: flex-end;
                justify-content: center;
            "
        >

            <img
                src="./roda-pe.png"
                alt="Rodapé GVX Engenharia"
                style="
                    width: 100%;
                    height: 75px;
                    object-fit: contain;
                    object-position: center bottom;
                    display: block;
                "
            >

        </div>

    `;


    document.body.appendChild(
        elemento
    );


    try {

        await esperarImagens(
            elemento
        );


        const canvas =
            await html2canvas(
                elemento,
                {

                    scale: 4,

                    useCORS: true,

                    allowTaint: false,

                    logging: false,

                    backgroundColor:
                        '#ffffff',

                    imageTimeout:
                        15000

                }
            );


        elemento.remove();


        const link =
            document.createElement(
                'a'
            );


        link.download =
            `Orcamento_${formatarNomeArquivo(
                item.cliente
            )}.png`;


        link.href =
            canvas.toDataURL(
                'image/png',
                1.0
            );


        link.click();


    } catch (error) {

        console.error(
            'Erro ao gerar Imagem A4:',
            error
        );


        elemento.remove();


        alert(
            'Não foi possível gerar a Imagem A4. Verifique se logo-cabecalho.png e roda-pe.png estão na pasta principal do projeto.'
        );

    }

}


// ============================================================
// INICIALIZAÇÃO
// ============================================================

inicializarExemplosHistorico();

renderizarComplexidades();

calcularOrcamento();
