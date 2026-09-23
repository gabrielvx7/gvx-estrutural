// --- VARIÁVEIS E DADOS GLOBAIS ---
let itensComplexidades = [
    { nome: "Projeto Estrutural", qtd: 0, taxa: 0.10 },
    { nome: "Projeto Hidrossanitário", qtd: 0, taxa: 0.08 },
    { nome: "Projeto Elétrico", qtd: 0, taxa: 0.08 },
    { nome: "Projeto de Fundações", qtd: 0, taxa: 0.07 }
];

// --- FUNÇÃO DE CÁLCULO DO ORÇAMENTO ---
function calcularOrcamento() {
    const areaEl = document.getElementById('areaConstruida');
    const precoMetroEl = document.getElementById('precoMetro');
    const resPrecoFinal = document.getElementById('resPrecoFinal');

    if (!areaEl || !precoMetroEl || !resPrecoFinal) return;

    const area = parseFloat(areaEl.value) || 0;
    const precoMetro = parseFloat(precoMetroEl.value) || 0;

    let subtotal = area * precoMetro;
    let adicionalComplexidade = 0;

    itensComplexidades.forEach(item => {
        adicionalComplexidade += subtotal * (item.taxa * item.qtd);
    });

    const totalFinal = subtotal + adicionalComplexidade;

    resPrecoFinal.innerText = totalFinal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

// --- RENDERIZAR COMPLEXIDADES NA TELA ---
function renderizarComplexidades() {
    const container = document.getElementById('listaComplexidades');
    if (!container) return;

    container.innerHTML = '';
    itensComplexidades.forEach((item, index) => {
        const div = document.createElement('div');
        div.style.cssText = 'display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; font-size: 14px;';
        div.innerHTML = `
            <span>${item.nome} (${(item.taxa * 100).toFixed(0)}%)</span>
            <div style="display: flex; gap: 8px; align-items: center;">
                <button type="button" class="btn-menos" data-index="${index}" style="padding: 2px 8px; cursor: pointer;">-</button>
                <span id="qtd-item-${index}" style="font-weight: bold; min-width: 20px; text-align: center;">${item.qtd}</span>
                <button type="button" class="btn-mais" data-index="${index}" style="padding: 2px 8px; cursor: pointer;">+</button>
            </div>
        `;
        container.appendChild(div);
    });

    container.querySelectorAll('.btn-mais').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const idx = e.target.getAttribute('data-index');
            itensComplexidades[idx].qtd++;
            renderizarComplexidades();
            calcularOrcamento();
        });
    });

    container.querySelectorAll('.btn-menos').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const idx = e.target.getAttribute('data-index');
            if (itensComplexidades[idx].qtd > 0) {
                itensComplexidades[idx].qtd--;
                renderizarComplexidades();
                calcularOrcamento();
            }
        });
    });
}

// --- TOGGLE / BOTÃO DE ATIVAR COMPLEXIDADE ---
function configurarToggleComplexidade() {
    const btnToggle = document.getElementById('btnAtivarComplexidade');
    const containerComplexidades = document.getElementById('containerComplexidades');
    const iconeSeta = document.getElementById('iconeSetaComplexidade');

    if (btnToggle && containerComplexidades) {
        const novoBtnToggle = btnToggle.cloneNode(true);
        btnToggle.parentNode.replaceChild(novoBtnToggle, btnToggle);

        document.getElementById('btnAtivarComplexidade').addEventListener('click', () => {
            const containerAtual = document.getElementById('containerComplexidades');
            const setaAtual = document.getElementById('iconeSetaComplexidade');
            const estaVisivel = containerAtual.style.display === 'block';
            
            if (estaVisivel) {
                containerAtual.style.display = 'none';
                if (setaAtual) setaAtual.innerText = '▼';
            } else {
                containerAtual.style.display = 'block';
                if (setaAtual) setaAtual.innerText = '▲';
            }
        });
    }
}

// --- CONTROLE DE ABAS (NOVO <-> HISTÓRICO) ---
const tabNovo = document.getElementById('tabNovo');
const tabHistorico = document.getElementById('tabHistorico');
const secaoNovo = document.getElementById('secaoNovo');
const secaoHistorico = document.getElementById('secaoHistorico');

function mudarAba(destino) {
    if (!tabNovo || !tabHistorico || !secaoNovo || !secaoHistorico) return;

    if (destino === 'novo') {
        tabNovo.classList.add('active');
        tabHistorico.classList.remove('active');
        secaoNovo.classList.remove('hidden');
        secaoHistorico.classList.add('hidden');
    } else if (destino === 'historico') {
        tabHistorico.classList.add('active');
        tabNovo.classList.remove('active');
        secaoHistorico.classList.remove('hidden');
        secaoNovo.classList.add('hidden');
        renderizarHistoricoNaTela();
    }
}

if (tabNovo) tabNovo.addEventListener('click', () => mudarAba('novo'));
if (tabHistorico) tabHistorico.addEventListener('click', () => mudarAba('historico'));

// --- TELA INICIAL (SPLASH) ---
const telaInicio = document.getElementById('telaInicio');
const appContainer = document.getElementById('appContainer');
const btnIrNovo = document.getElementById('btnIrNovo');
const btnIrHistorico = document.getElementById('btnIrHistorico');
const btnVoltarInicio = document.getElementById('btnVoltarInicio');

if (btnIrNovo) {
    btnIrNovo.addEventListener('click', () => {
        telaInicio.classList.add('hidden');
        appContainer.classList.remove('hidden');
        mudarAba('novo');
    });
}

if (btnIrHistorico) {
    btnIrHistorico.addEventListener('click', () => {
        telaInicio.classList.add('hidden');
        appContainer.classList.remove('hidden');
        mudarAba('historico');
    });
}

if (btnVoltarInicio) {
    btnVoltarInicio.addEventListener('click', () => {
        appContainer.classList.add('hidden');
        telaInicio.classList.remove('hidden');
    });
}

// --- HISTÓRICO DE ORÇAMENTOS ---
function salvarNoHistorico(orcamento) {
    let historico = JSON.parse(localStorage.getItem('gvx_historico_orcamentos')) || [];
    historico.unshift(orcamento);
    localStorage.setItem('gvx_historico_orcamentos', JSON.stringify(historico));
}

function renderizarHistoricoNaTela() {
    const listaHistoricoEl = document.getElementById('listaHistorico');
    if (!listaHistoricoEl) return;

    let historico = JSON.parse(localStorage.getItem('gvx_historico_orcamentos')) || [];
    
    if (historico.length === 0) {
        listaHistoricoEl.innerHTML = '<p style="font-size: 13px; color: #64748b; text-align: center; padding: 20px;">Nenhum orçamento emitido ainda.</p>';
        return;
    }

    listaHistoricoEl.innerHTML = '';
    historico.forEach((item) => {
        const div = document.createElement('div');
        div.style.cssText = 'background: white; padding: 14px; border-radius: 8px; border: 1px solid #e2e8f0; margin-bottom: 10px; box-shadow: 0 1px 3px rgba(0,0,0,0.05);';
        div.innerHTML = `
            <div style="display: flex; justify-content: space-between; font-weight: bold; font-size: 14px; color: #0b192c; margin-bottom: 4px;">
                <span>Orçamento: ${item.numOrcamento}</span>
                <span style="color: #d4af37;">${item.valorTotal}</span>
            </div>
            <div style="font-size: 12px; color: #475569; margin-bottom: 2px;"><b>Cliente:</b> ${item.cliente}</div>
            <div style="font-size: 12px; color: #475569; margin-bottom: 2px;"><b>Obra:</b> ${item.descricao || 'Não informada'}</div>
            <div style="font-size: 11px; color: #94a3b8;">Data: ${item.data || 'Não informada'}</div>
        `;
        listaHistoricoEl.appendChild(div);
    });
}

// --- EVENTOS DOS INPUTS ---
const areaInput = document.getElementById('areaConstruida');
const precoMetroInput = document.getElementById('precoMetro');

if (areaInput) areaInput.addEventListener('input', calcularOrcamento);
if (precoMetroInput) precoMetroInput.addEventListener('input', calcularOrcamento);

// --- BOTÃO PRINCIPAL: CONCLUIR ORÇAMENTO (ENVIA DIRETAMENTE PARA O HISTÓRICO) ---
const btnAcaoPrincipal = document.getElementById('btnGerarPdf');

if (btnAcaoPrincipal) {
    btnAcaoPrincipal.innerText = "Concluir Orçamento";
    
    const novoBtnAcao = btnAcaoPrincipal.cloneNode(true);
    btnAcaoPrincipal.parentNode.replaceChild(novoBtnAcao, btnAcaoPrincipal);

    document.getElementById('btnGerarPdf').addEventListener('click', () => {
        const cliente = document.getElementById('cliente').value || 'Cliente não informado';
        const numOrcamento = document.getElementById('numOrcamento').value || '001/2026';
        const data = document.getElementById('dataOrcamento').value || new Date().toISOString().split('T')[0];
        const descricao = document.getElementById('descricaoObra').value || '';
        const area = document.getElementById('areaConstruida').value || '0';
        const precoMetro = document.getElementById('precoMetro').value || '0';
        const notaFiscal = document.getElementById('notaFiscal').value || '0';
        
        const precoFinalEl = document.getElementById('resPrecoFinal');
        const precoFinal = precoFinalEl ? precoFinalEl.innerText : 'R$ 0,00';

        let qtdsArray = [];
        itensComplexidades.forEach(item => {
            qtdsArray.push(item.qtd);
        });

        const orcamentoSalvo = {
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

        // 1. Salva no histórico local
        salvarNoHistorico(orcamentoSalvo);

        // 2. Redireciona imediatamente para a aba de histórico
        mudarAba('historico');
    });
}

// --- INICIALIZAÇÃO GERAL ---
configurarToggleComplexidade();
renderizarComplexidades();
calcularOrcamento();

const inputData = document.getElementById('dataOrcamento');
if (inputData && !inputData.value) {
    inputData.value = new Date().toISOString().split('T')[0];
}

// --- SERVICE WORKER ---
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('./sw.js')
            .then(() => console.log('Service Worker registado com sucesso!'))
            .catch(err => console.log('Erro ao registar Service Worker:', err));
    });
}
