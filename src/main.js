// O CSS é carregado pelo index.html.
// html2canvas é carregado pelo CDN no index.html e fica disponível em window.html2canvas.
const html2canvas = window.html2canvas;
const CHAVE_HISTORICO = 'gvx_historico_orcamentos';

document.getElementById('dataOrcamento').valueAsDate = new Date();

const itensComplexidades = [
    { id: 'balanco1', nome: 'BALANÇO (2 à 4m)', taxa: 0.10, qtd: 0 },
    { id: 'balanco2', nome: 'BALANÇO (>4m)', taxa: 0.20, qtd: 0 },
    { id: 'transicao1', nome: 'VIGA DE TRANSIÇÃO (2 - 4m)', taxa: 0.10, qtd: 0 },
    { id: 'transicao2', nome: 'VIGA DE TRANSIÇÃO (4 - 6m)', taxa: 0.15, qtd: 0 },
    { id: 'transicao3', nome: 'VIGA DE TRANSIÇÃO (>6m)', taxa: 0.20, qtd: 0 },
    { id: 'vigaVao1', nome: 'VIGA VÃO (6 - 9m)', taxa: 0.10, qtd: 0 },
    { id: 'vigaVao2', nome: 'VIGA VÃO (>9m)', taxa: 0.15, qtd: 0 },
    { id: 'escada', nome: 'ESCADA MODERNA', taxa: 0.07, qtd: 0 },
    { id: 'desnivel1', nome: 'TERRENO DESNÍVEL (3 - 6m)', taxa: 0.10, qtd: 0 },
    { id: 'desnivel2', nome: 'TERRENO DESNÍVEL (>6m)', taxa: 0.15, qtd: 0 },
    { id: 'fundProf', nome: 'FUNDAÇÃO PROFUNDA', taxa: 0.15, qtd: 0 },
    { id: 'fundExc', nome: 'FUNDAÇÃO EXCENTRICA', taxa: 0.10, qtd: 0 },
    { id: 'piscina', nome: 'PISCINA NA COBERTURA', taxa: 0.20, qtd: 0 },
    { id: 'detalheExtra', nome: 'Detalhe a mais', taxa: 0.10, qtd: 0 }
];

// --- CONTROLE DE TELAS E ABAS ---
const telaInicio = document.getElementById('telaInicio');
const appContainer = document.getElementById('appContainer');
const btnIrNovo = document.getElementById('btnIrNovo');
const btnIrHistorico = document.getElementById('btnIrHistorico');
const btnVoltarInicio = document.getElementById('btnVoltarInicio');

const btnNovo = document.getElementById('tabNovo');
const btnHistorico = document.getElementById('tabHistorico');
const secaoNovo = document.getElementById('secaoNovo');
const secaoHistorico = document.getElementById('secaoHistorico');

btnIrNovo.addEventListener('click', () => {
    telaInicio.classList.add('hidden');
    appContainer.classList.remove('hidden');
    btnNovo.click();
});

btnIrHistorico.addEventListener('click', () => {
    telaInicio.classList.add('hidden');
    appContainer.classList.remove('hidden');
    btnHistorico.click();
});

btnVoltarInicio.addEventListener('click', () => {
    appContainer.classList.add('hidden');
    telaInicio.classList.remove('hidden');
});

btnNovo.addEventListener('click', () => {
    btnNovo.classList.add('active');
    btnHistorico.classList.remove('active');
    secaoNovo.classList.remove('hidden');
    secaoHistorico.classList.add('hidden');
});

btnHistorico.addEventListener('click', () => {
    btnHistorico.classList.add('active');
    btnNovo.classList.remove('active');
    secaoHistorico.classList.remove('hidden');
    secaoNovo.classList.add('hidden');
    renderizarHistorico();
});

function renderizarComplexidades() {
    const container = document.getElementById('listaComplexidades');
    if (!container) return;
    container.innerHTML = '';

    itensComplexidades.forEach((item, index) => {
        const div = document.createElement('div');
        div.className = 'complex-item';
        div.innerHTML = `
            <div>
                <p>${item.nome}</p>
                <p>Acréscimo: ${(item.taxa * 100).toFixed(0)}%</p>
            </div>
            <div class="counter-box">
                <button data-index="${index}" data-delta="-1" class="btn-cnt btn-qtd">-</button>
                <span id="qtd_${index}" style="width: 24px; text-align: center; font-size: 12px; font-weight: bold;">${item.qtd}</span>
                <button data-index="${index}" data-delta="1" class="btn-cnt btn-qtd" style="color: #0b192c; background: #e0f2fe;">+</button>
            </div>
        `;
        container.appendChild(div);
    });

    document.querySelectorAll('.btn-qtd').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const idx = parseInt(e.currentTarget.getAttribute('data-index'));
            const delta = parseInt(e.currentTarget.getAttribute('data-delta'));
            alterarQtd(idx, delta);
        });
    });
}

function alterarQtd(index, delta) {
    itensComplexidades[index].qtd += delta;
    if (itensComplexidades[index].qtd < 0) itensComplexidades[index].qtd = 0;
    const spanQtd = document.getElementById(`qtd_${index}`);
    if (spanQtd) spanQtd.innerText = itensComplexidades[index].qtd;
    calcularOrcamento();
}

function formatarMoeda(valor) {
    return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

function calcularOrcamento() {
    const area = parseFloat(document.getElementById('areaConstruida').value) || 0;
    const precoM2 = parseFloat(document.getElementById('precoMetro').value) || 0;
    const totalBase = area * precoM2;

    let totalAcrescimoReais = 0;
    itensComplexidades.forEach(item => {
        if (item.qtd > 0) {
            totalAcrescimoReais += totalBase * item.taxa * item.qtd;
        }
    });

    const totalComAcrescimo = totalBase + totalAcrescimoReais;
    const percNota = parseFloat(document.getElementById('notaFiscal').value) || 0;
    const valorNota = totalComAcrescimo * (percNota / 100);
    const precoFinal = totalComAcrescimo + valorNota;

    const elPrecoFinal = document.getElementById('resPrecoFinal');
    if (elPrecoFinal) elPrecoFinal.innerText = formatarMoeda(precoFinal);

    return precoFinal;
}

document.getElementById('areaConstruida').addEventListener('input', calcularOrcamento);
document.getElementById('precoMetro').addEventListener('input', calcularOrcamento);
document.getElementById('notaFiscal').addEventListener('input', calcularOrcamento);

function lerHistorico() {
    const dados = localStorage.getItem(CHAVE_HISTORICO);
    if (!dados) return [];

    try {
        const historico = JSON.parse(dados);
        return Array.isArray(historico) ? historico : [];
    } catch (error) {
        console.warn('Histórico inválido. Um novo histórico será criado.', error);
        localStorage.removeItem(CHAVE_HISTORICO);
        return [];
    }
}

function inicializarExemplosHistorico() {
    const historicoAtual = lerHistorico();
    if (historicoAtual.length > 0) return;

    const exemplos = [
        {
            numOrcamento: '001/2026',
            data: '2026-06-01',
            cliente: 'Francisco Carlos de Sousa',
            descricao: 'Residência Unifamiliar - 2 Pavimentos',
            area: 180,
            precoMetro: 25,
            notaFiscal: 0,
            complexidades: [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0],
            valorTotal: 'R$ 5.062,50'
        },
        {
            numOrcamento: '002/2026',
            data: '2026-06-15',
            cliente: 'Maria das Graças Ximenes',
            descricao: 'Edifício Comercial - 3 Pavimentos',
            area: 320,
            precoMetro: 30,
            notaFiscal: 5,
            complexidades: [0, 1, 1, 0, 0, 0, 1, 1, 0, 0, 1, 0, 0, 0],
            valorTotal: 'R$ 13.345,20'
        }
    ];

    localStorage.setItem(CHAVE_HISTORICO, JSON.stringify(exemplos));
}

function salvarNoHistorico(orcamentoObj) {
    const historico = lerHistorico();
    const indexExistente = historico.findIndex(item => item.numOrcamento === orcamentoObj.numOrcamento);

    if (indexExistente >= 0) {
        historico[indexExistente] = orcamentoObj;
    } else {
        historico.unshift(orcamentoObj);
    }

    localStorage.setItem(CHAVE_HISTORICO, JSON.stringify(historico));
}

function renderizarHistorico() {
    const container = document.getElementById('listaHistorico');
    if (!container) return;

    const historico = lerHistorico();
    container.innerHTML = '';

    historico.forEach((item, index) => {
        const div = document.createElement('div');
        div.className = 'history-card';
        div.innerHTML = `
            <div>
                <b>Nº ${item.numOrcamento} - ${item.cliente}</b>
                <p>${item.descricao || 'Sem descrição'} • ${item.data ? item.data.split('-').reverse().join('/') : ''}</p>
                <b style="color: #0b192c; display: block; margin-top: 4px;">${item.valorTotal}</b>
            </div>
            <button data-index="${index}" class="btn-load btn-abrir">Abrir</button>
        `;
        container.appendChild(div);
    });

    document.querySelectorAll('.btn-abrir').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const idx = parseInt(e.currentTarget.getAttribute('data-index'));
            abrirMenuOpcoes(historico[idx]);
        });
    });
}

function abrirMenuOpcoes(item) {
    const modal = document.createElement('div');
    modal.style.position = 'fixed';
    modal.style.top = '0';
    modal.style.left = '0';
    modal.style.width = '100%';
    modal.style.height = '100%';
    modal.style.background = 'rgba(0, 0, 0, 0.5)';
    modal.style.display = 'flex';
    modal.style.alignItems = 'center';
    modal.style.justifyContent = 'center';
    modal.style.zIndex = '1000';

    modal.innerHTML = `
        <div style="background: white; padding: 24px; border-radius: 12px; width: 320px; box-shadow: 0 10px 25px rgba(0,0,0,0.2); display: flex; flex-direction: column; gap: 12px;">
            <h3 style="font-size: 14px; font-weight: bold; color: #0b192c; margin-bottom: 4px;">Orçamento Nº ${item.numOrcamento}</h3>
            <p style="font-size: 12px; color: #64748b; margin-bottom: 12px;">Escolha a ação desejada para este orçamento:</p>
            <button id="btnAtualizar" style="background: #0b192c; color: white; border: none; padding: 10px; border-radius: 8px; font-size: 12px; font-weight: bold; cursor: pointer;">Atualizar Orçamento</button>
            <button id="btnGerarImg" style="background: #d4af37; color: #0f172a; border: none; padding: 10px; border-radius: 8px; font-size: 12px; font-weight: bold; cursor: pointer;">Gerar Imagem A4</button>
            <button id="btnCancelar" style="background: #f1f5f9; color: #334155; border: none; padding: 8px; border-radius: 8px; font-size: 12px; font-weight: bold; cursor: pointer; margin-top: 4px;">Cancelar</button>
        </div>
    `;

    document.body.appendChild(modal);

    document.getElementById('btnAtualizar').addEventListener('click', () => {
        carregarOrcamento(item);
        document.body.removeChild(modal);
    });

    document.getElementById('btnGerarImg').addEventListener('click', () => {
        document.body.removeChild(modal);
        gerarImagemA4Especifica(item);
    });

    document.getElementById('btnCancelar').addEventListener('click', () => {
        document.body.removeChild(modal);
    });
}

function carregarOrcamento(item) {
    document.getElementById('numOrcamento').value = item.numOrcamento;
    document.getElementById('dataOrcamento').value = item.data;
    document.getElementById('cliente').value = item.cliente;
    document.getElementById('descricaoObra').value = item.descricao;
    document.getElementById('areaConstruida').value = item.area;
    document.getElementById('precoMetro').value = item.precoMetro;
    document.getElementById('notaFiscal').value = item.notaFiscal;

    itensComplexidades.forEach((comp, i) => {
        comp.qtd = (item.complexidades && item.complexidades[i]) ? item.complexidades[i] : 0;
    });

    renderizarComplexidades();
    calcularOrcamento();
    btnNovo.click();
}

function escaparHtml(valor) {
    return String(valor ?? '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

function formatarNomeArquivo(valor) {
    return String(valor || 'Cliente')
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/[^a-zA-Z0-9]+/g, '_')
        .replace(/^_+|_+$/g, '') || 'Cliente';
}

async function gerarImagemA4Especifica(item) {
    if (typeof html2canvas !== 'function') {
        console.error('html2canvas não foi carregado.');
        alert('Não foi possível gerar a Imagem A4. Recarregue a página e tente novamente.');
        return;
    }

    let itensHtml = '';

    itensComplexidades.forEach((comp, i) => {
        const qtd = (item.complexidades && item.complexidades[i]) ? item.complexidades[i] : 0;

        if (qtd > 0) {
            itensHtml += `
                <tr>
                    <td style="padding: 12px 16px; border-bottom: 1px solid #e2e8f0; color: #334155; font-weight: 500; font-size: 14px;">${escaparHtml(comp.nome)}</td>
                    <td style="padding: 12px 16px; border-bottom: 1px solid #e2e8f0; text-align: center; color: #334155; font-weight: 700; font-size: 14px;">${qtd}</td>
                    <td style="padding: 12px 16px; border-bottom: 1px solid #e2e8f0; text-align: right; color: #0b192c; font-weight: 700; font-size: 14px;">${(comp.taxa * 100).toFixed(0)}%</td>
                </tr>
            `;
        }
    });

    const elemento = document.createElement('div');

    // Folha A4 em proporção real. O html2canvas amplia 4x na exportação.
    Object.assign(elemento.style, {
        width: '794px',
        height: '1123px',
        position: 'fixed',
        left: '-10000px',
        top: '0',
        zIndex: '-1',
        background: '#ffffff',
        color: '#0b192c',
        fontFamily: 'Inter, Arial, sans-serif',
        boxSizing: 'border-box',
        overflow: 'hidden'
    });

    elemento.innerHTML = `
        <div style="position: relative; width: 100%; height: 100%; background: #ffffff; box-sizing: border-box;">

            <!-- CABEÇALHO DO MODELO A4 -->
            <div style="position: absolute; top: 48px; left: 70px; width: 654px; height: 116px; display: flex; align-items: flex-start;">
                <img
                    src="./logo-cabecalho.png"
                    alt="Gabriel Vasconcelos - Projetos Estruturais"
                    crossorigin="anonymous"
                    style="display: block; width: 330px; height: 117px; object-fit: contain; object-position: left top;"
                >
            </div>

            <!-- TÍTULO E IDENTIFICAÇÃO -->
            <div style="position: absolute; top: 165px; left: 70px; width: 654px; height: 74px; border-bottom: 2px solid #0b192c; box-sizing: border-box; display: flex; align-items: flex-end; justify-content: space-between; padding-bottom: 9px;">
                <h2 style="margin: 0; color: #0b192c; font-size: 16px; line-height: 20px; font-weight: 800; text-transform: uppercase; white-space: nowrap;">
                    ORÇAMENTO DE PROJETO ESTRUTURAL
                </h2>

                <div style="text-align: right; color: #475569; font-size: 13px; line-height: 20px; white-space: nowrap;">
                    <div><strong style="color: #334155;">Orçamento Nº:</strong> ${escaparHtml(item.numOrcamento || '')}</div>
                    <div><strong style="color: #334155;">Data:</strong> ${item.data ? item.data.split('-').reverse().join('/') : ''}</div>
                </div>
            </div>

            <!-- DADOS DO CLIENTE -->
            <div style="position: absolute; top: 263px; left: 70px; width: 654px; min-height: 78px; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px; padding: 15px 18px; box-sizing: border-box; color: #475569; font-size: 14px; line-height: 25px;">
                <div><strong style="color: #334155;">Cliente:</strong> ${escaparHtml(item.cliente || 'Cliente não informado')}</div>
                <div><strong style="color: #334155;">Descrição da Obra:</strong> ${escaparHtml(item.descricao || 'Sem descrição')}</div>
            </div>

            <!-- TABELA DE COMPLEXIDADE -->
            <div style="position: absolute; top: 363px; left: 70px; width: 654px;">
                <table style="width: 100%; border-collapse: collapse; table-layout: fixed;">
                    <thead>
                        <tr style="background: #0b192c; color: #ffffff;">
                            <th style="width: 66%; padding: 12px 16px; text-align: left; font-size: 14px; font-weight: 800;">Fator de Complexidade</th>
                            <th style="width: 12%; padding: 12px 8px; text-align: center; font-size: 14px; font-weight: 800;">Qtd</th>
                            <th style="width: 22%; padding: 12px 16px; text-align: right; font-size: 14px; font-weight: 800;">Acréscimo</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${itensHtml || `
                            <tr>
                                <td colspan="3" style="padding: 30px 12px; text-align: center; color: #64748b; font-size: 14px; border-bottom: 1px solid #e2e8f0;">
                                    Nenhum fator de complexidade adicional selecionado.
                                </td>
                            </tr>
                        `}
                    </tbody>
                </table>
            </div>

            <!-- VALOR TOTAL -->
            <div style="position: absolute; top: 489px; left: 70px; width: 654px; height: 97px; background: #f8fafc; border: 2px solid #0b192c; border-radius: 12px; box-sizing: border-box; display: flex; flex-direction: column; align-items: flex-end; justify-content: center; padding: 14px 24px;">
                <div style="font-size: 14px; line-height: 20px; color: #475569; font-weight: 700; text-transform: uppercase;">
                    VALOR TOTAL DO PROJETO:
                </div>
                <div style="margin-top: 3px; font-size: 26px; line-height: 31px; color: #0b192c; font-weight: 900;">
                    ${escaparHtml(item.valorTotal || 'R$ 0,00')}
                </div>
            </div>

            <!-- RODAPÉ OFICIAL DO MODELO -->
            <div style="position: absolute; left: 70px; bottom: 0; width: 654px; height: 145px; overflow: hidden; display: flex; align-items: flex-end; justify-content: center;">
                <img
                    src="./roda-pe.png"
                    alt="Rodapé GVX Engenharia"
                    crossorigin="anonymous"
                    style="display: block; width: 654px; height: 141px; object-fit: contain; object-position: center bottom;"
                >
            </div>
        </div>
    `;

    document.body.appendChild(elemento);

    const imagens = Array.from(elemento.querySelectorAll('img'));

    // Aguarda o carregamento das imagens antes da captura.
    const imagensCarregadas = await Promise.all(imagens.map(img => new Promise(resolve => {
        if (img.complete && img.naturalWidth > 0) {
            resolve(true);
            return;
        }

        img.onload = () => resolve(true);
        img.onerror = () => resolve(false);
    })));

    if (imagensCarregadas.some(carregou => !carregou)) {
        if (document.body.contains(elemento)) {
            document.body.removeChild(elemento);
        }

        alert('Não foi possível carregar logo-cabecalho.png ou roda-pe.png. Verifique se os dois arquivos estão na pasta principal do projeto.');
        return;
    }

    // Pequeno atraso para garantir que fontes e imagens estejam renderizadas.
    await new Promise(resolve => setTimeout(resolve, 120));

    try {
        const canvas = await html2canvas(elemento, {
            scale: 4,
            useCORS: true,
            allowTaint: false,
            logging: false,
            backgroundColor: '#ffffff',
            imageTimeout: 15000,
            width: 794,
            height: 1123,
            windowWidth: 794,
            windowHeight: 1123
        });

        document.body.removeChild(elemento);

        const link = document.createElement('a');
        link.download = `Orcamento_${formatarNomeArquivo(item.cliente)}.png`;
        link.href = canvas.toDataURL('image/png', 1.0);
        link.click();
    } catch (error) {
        console.error('Erro ao gerar imagem:', error);

        if (document.body.contains(elemento)) {
            document.body.removeChild(elemento);
        }

        alert('Não foi possível gerar a Imagem A4. Tente novamente.');
    }
}

function obterOrcamentoAtual() {
    const cliente = document.getElementById('cliente').value.trim() || 'Cliente não informado';
    const numOrcamento = document.getElementById('numOrcamento').value.trim();
    const data = document.getElementById('dataOrcamento').value;
    const descricao = document.getElementById('descricaoObra').value.trim();
    const area = document.getElementById('areaConstruida').value;
    const precoMetro = document.getElementById('precoMetro').value;
    const notaFiscal = document.getElementById('notaFiscal').value;

    const precoFinalEl = document.getElementById('resPrecoFinal');
    const precoFinal = precoFinalEl ? precoFinalEl.innerText : 'R$ 0,00';
    const qtdsArray = itensComplexidades.map(item => item.qtd);

    return {
        numOrcamento,
        data,
        cliente,
        descricao,
        area,
        precoMetro,
        notaFiscal,
        complexidades: qtdsArray,
        valorTotal: precoFinal
    };
}

function salvarOrcamentoAtual() {
    const orcamento = obterOrcamentoAtual();
    salvarNoHistorico(orcamento);
    btnHistorico.click();
}

document.getElementById('btnSalvarOrcamento').addEventListener('click', salvarOrcamentoAtual);

renderizarComplexidades();
calcularOrcamento();
inicializarExemplosHistorico();
