// --- DADOS GLOBAIS DE COMPLEXIDADE (Oficiais da Planilha) ---
let itensComplexidades = [
    { nome: "BALANÇO (2 à 4m)", qtd: 0, taxa: 0.10 },
    { nome: "BALANÇO (>4m)", qtd: 0, taxa: 0.20 },
    { nome: "VIGA DE TRANSIÇÃO (2 - 4m)", qtd: 0, taxa: 0.10 },
    { nome: "VIGA DE TRANSIÇÃO (4 - 6 m)", qtd: 0, taxa: 0.15 },
    { nome: "VIGA DE TRANSIÇÃO (>6m)", qtd: 0, taxa: 0.20 },
    { nome: "VIGA VÃO (6 - 9m)", qtd: 0, taxa: 0.10 },
    { nome: "VIGA VÃO (>9m)", qtd: 0, taxa: 0.15 },
    { nome: "ESCADA MODERNA", qtd: 0, taxa: 0.07 },
    { nome: "TERRENO DESNÍVEL (3 - 6m)", qtd: 0, taxa: 0.10 },
    { nome: "TERRENO DESNÍVEL (>6m)", qtd: 0, taxa: 0.15 },
    { nome: "FUNDAÇÃO PROFUNDA", qtd: 0, taxa: 0.15 },
    { nome: "FUNDAÇÃO EXCÊNTRICA", qtd: 0, taxa: 0.10 },
    { nome: "PISCINA NA COBERTURA", qtd: 0, taxa: 0.20 },
    { nome: "Detalhe a mais", qtd: 0, taxa: 0.10 }
];

// --- CÁLCULO DO ORÇAMENTO ---
function calcularOrcamento() {
    const areaEl = document.getElementById('areaConstruida');
    const precoMetroEl = document.getElementById('precoMetro');
    const notaFiscalEl = document.getElementById('notaFiscal');
    const resPrecoFinal = document.getElementById('resPrecoFinal');

    if (!areaEl || !precoMetroEl || !resPrecoFinal) return;

    const area = parseFloat(areaEl.value) || 0;
    const precoMetro = parseFloat(precoMetroEl.value) || 0;
    const notaFiscal = notaFiscalEl ? (parseFloat(notaFiscalEl.value) || 0) / 100 : 0;

    let subtotal = area * precoMetro;
    let adicionalComplexidade = 0;

    itensComplexidades.forEach(item => {
        adicionalComplexidade += subtotal * (item.taxa * item.qtd);
    });

    let totalComAcrecimo = subtotal + adicionalComplexidade;
    let valorNotaFiscal = totalComAcrecimo * notaFiscal;
    const totalFinal = totalComAcrecimo + valorNotaFiscal;

    resPrecoFinal.innerText = totalFinal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

// --- RENDERIZAR COMPLEXIDADES ---
function renderizarComplexidades() {
    const container = document.getElementById('listaComplexidades');
    if (!container) return;

    container.innerHTML = '';
    itensComplexidades.forEach((item, index) => {
        const div = document.createElement('div');
        div.style.cssText = 'display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; font-size: 13px; border-bottom: 1px solid #e2e8f0; padding-bottom: 6px;';
        div.innerHTML = `
            <span style="color: #334155; font-weight: 500;">${item.nome} (${(item.taxa * 100).toFixed(0)}%)</span>
            <div style="display: flex; gap: 8px; align-items: center;">
                <button type="button" class="btn-menos" data-index="${index}" style="padding: 2px 8px; cursor: pointer; background: #e2e8f0; border: none; border-radius: 4px; font-weight: bold;">-</button>
                <span id="qtd-item-${index}" style="font-weight: bold; min-width: 20px; text-align: center; color: #0b192c;">${item.qtd}</span>
                <button type="button" class="btn-mais" data-index="${index}" style="padding: 2px 8px; cursor: pointer; background: #e2e8f0; border: none; border-radius: 4px; font-weight: bold;">+</button>
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

// --- TOGGLE / BOTÃO DE ATIVAR COMPLEXIDADE (CORRIGIDO) ---
function configurarToggleComplexidade() {
    const btnToggle = document.getElementById('btnAtivarComplexidade');
    const containerComplexidades = document.getElementById('containerComplexidades');
    const iconeSeta = document.getElementById('iconeSetaComplexidade');

    if (btnToggle && containerComplexidades) {
        btnToggle.addEventListener('click', () => {
            const estaOculto = containerComplexidades.classList.contains('hidden');
            if (estaOculto) {
                containerComplexidades.classList.remove('hidden');
                if (iconeSeta) iconeSeta.innerText = '▲';
            } else {
                containerComplexidades.classList.add('hidden');
                if (iconeSeta) iconeSeta.innerText = '▼';
            }
        });
    }
}

// --- CONTROLE DE ABAS ---
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

// --- TELA INICIAL ---
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

// --- HISTÓRICO ---
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
    historico.forEach((item, index) => {
        const div = document.createElement('div');
        div.style.cssText = 'background: white; padding: 14px; border-radius: 8px; border: 1px solid #e2e8f0; margin-bottom: 10px; box-shadow: 0 1px 3px rgba(0,0,0,0.05);';
        div.innerHTML = `
            <div style="display: flex; justify-content: space-between; font-weight: bold; font-size: 14px; color: #0b192c; margin-bottom: 4px;">
                <span>Orçamento: ${item.numOrcamento}</span>
                <span style="color: #d4af37;">${item.valorTotal}</span>
            </div>
            <div style="font-size: 12px; color: #475569; margin-bottom: 2px;"><b>Cliente:</b> ${item.cliente}</div>
            <div style="font-size: 12px; color: #475569; margin-bottom: 2px;"><b>Obra:</b> ${item.descricao || 'Não informada'}</div>
            <div style="font-size: 11px; color: #94a3b8; margin-bottom: 8px;">Data: ${item.data || 'Não informada'}</div>
            <button type="button" class="btn-baixar-historico" data-index="${index}" style="background: #0b192c; color: #d4af37; border: none; padding: 6px 12px; border-radius: 6px; font-size: 11px; font-weight: bold; cursor: pointer;">📥 Baixar Orçamento (A4)</button>
        `;
        listaHistoricoEl.appendChild(div);
    });

    listaHistoricoEl.querySelectorAll('.btn-baixar-historico').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const idx = parseInt(e.target.getAttribute('data-index'), 10);
            gerarImagemA4(historico[idx]);
        });
    });
}

// --- GERADOR DE IMAGEM A4 (GARANTIDO) ---
function gerarImagemA4(dados) {
    const canvas = document.getElementById('canvasOrcamento');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    // Fundo Branco A4
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Cabeçalho institucional
    ctx.fillStyle = '#0b192c';
    ctx.fillRect(80, 80, canvas.width - 160, 160);

    ctx.fillStyle = '#d4af37';
    ctx.font = 'bold 36px sans-serif';
    ctx.fillText('GVX ENGENHARIA', 120, 150);

    ctx.fillStyle = '#ffffff';
    ctx.font = '20px sans-serif';
    ctx.fillText('Projetos Estruturais e Construção Civil', 120, 190);

    ctx.textAlign = 'right';
    ctx.fillText(`Orçamento: ${dados.numOrcamento}`, canvas.width - 120, 150);
    ctx.fillText(`Data: ${dados.data}`, canvas.width - 120, 190);
    ctx.textAlign = 'left';

    // Informações do Cliente
    let yPos = 300;
    ctx.fillStyle = '#0b192c';
    ctx.font = 'bold 22px sans-serif';
    ctx.fillText('DADOS DO CLIENTE E DA OBRA', 80, yPos);

    yPos += 30;
    ctx.strokeStyle = '#cbd5e1';
    ctx.lineWidth = 2;
    ctx.strokeRect(80, yPos, canvas.width - 160, 110);

    ctx.font = '18px sans-serif';
    ctx.fillStyle = '#334155';
    ctx.fillText(`Cliente: ${dados.cliente}`, 110, yPos + 45);
    ctx.fillText(`Obra: ${dados.descricao || 'Não informada'}`, 110, yPos + 80);

    // Parâmetros da Obra
    yPos += 150;
    ctx.fillStyle = '#0b192c';
    ctx.font = 'bold 22px sans-serif';
    ctx.fillText('PARÂMETROS E VALORES', 80, yPos);

    yPos += 30;
    ctx.strokeRect(80, yPos, canvas.width - 160, 120);

    ctx.font = '18px sans-serif';
    ctx.fillStyle = '#334155';
    ctx.fillText(`Área Construída: ${dados.area} m²`, 110, yPos + 45);
    ctx.fillText(`Preço por m²: R$ ${dados.precoMetro} | Nota Fiscal: ${dados.notaFiscal}%`, 110, yPos + 85);

    // Complexidades selecionadas
    yPos += 160;
    ctx.fillStyle = '#0b192c';
    ctx.font = 'bold 22px sans-serif';
    ctx.fillText('ITENS DE COMPLEXIDADE', 80, yPos);

    yPos += 30;
    
    let complexidadesAtivas = (dados.complexidades || []).filter(c => c.qtd > 0);
    let alturaBoxComplex = Math.max(100, (complexidadesAtivas.length * 35) + 40);
    ctx.strokeRect(80, yPos, canvas.width - 160, alturaBoxComplex);

    let posYItem = yPos + 40;
    if (complexidadesAtivas.length > 0) {
        complexidadesAtivas.forEach((item) => {
            ctx.font = '16px sans-serif';
            ctx.fillStyle = '#334155';
            ctx.fillText(`• ${item.nome} (Qtd: ${item.qtd}) — Acréscimo: ${(item.taxa * 100)}% cada`, 110, posYItem);
            posYItem += 35;
        });
    } else {
        ctx.font = '16px italic sans-serif';
        ctx.fillStyle = '#94a3b8';
        ctx.fillText('Nenhum item de complexidade ativado.', 110, yPos + 50);
    }

    // Rodapé / Valor Total
    yPos += alturaBoxComplex + 40;
    ctx.fillStyle = '#0b192c';
    ctx.fillRect(80, yPos, canvas.width - 160, 100);

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 22px sans-serif';
    ctx.fillText('VALOR TOTAL DO PROJETO:', 120, yPos + 60);

    ctx.fillStyle = '#d4af37';
    ctx.font = 'bold 32px sans-serif';
    ctx.textAlign = 'right';
    ctx.fillText(dados.valorTotal, canvas.width - 120, yPos + 65);
    ctx.textAlign = 'left';

    // Disparar Download Automático da Imagem A4
    const link = document.createElement('a');
    const nomeLimpo = (dados.cliente || 'Orcamento').replace(/[^a-zA-Z0-9]/g, '_');
    link.download = `Orcamento_${nomeLimpo}.png`;
    link.href = canvas.toDataURL('image/png');
    
    // Simula clique seguro para navegadores mobile e desktop
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

// --- EVENTOS DOS INPUTS ---
const areaInput = document.getElementById('areaConstruida');
const precoMetroInput = document.getElementById('precoMetro');
const notaFiscalInput = document.getElementById('notaFiscal');

if (areaInput) areaInput.addEventListener('input', calcularOrcamento);
if (precoMetroInput) precoMetroInput.addEventListener('input', calcularOrcamento);
if (notaFiscalInput) notaFiscalInput.addEventListener('input', calcularOrcamento);

// --- BOTÃO CONCLUIR ORÇAMENTO ---
const btnConcluirOrcamento = document.getElementById('btnConcluirOrcamento');

if (btnConcluirOrcamento) {
    btnConcluirOrcamento.addEventListener('click', () => {
        const cliente = document.getElementById('cliente').value || 'Cliente não informado';
        const numOrcamento = document.getElementById('numOrcamento').value || '001/2026';
        const data = document.getElementById('dataOrcamento').value || new Date().toISOString().split('T')[0];
        const descricao = document.getElementById('descricaoObra').value || '';
        const area = document.getElementById('areaConstruida').value || '0';
        const precoMetro = document.getElementById('precoMetro').value || '0';
        const notaFiscal = document.getElementById('notaFiscal').value || '0';
        
        const precoFinalEl = document.getElementById('resPrecoFinal');
        const precoFinal = precoFinalEl ? precoFinalEl.innerText : 'R$ 0,00';

        let complexidadesSalvas = itensComplexidades.map(item => ({
            nome: item.nome,
            qtd: item.qtd,
            taxa: item.taxa
        }));

        const orcamentoSalvo = {
            numOrcamento,
            data,
            cliente,
            descricao,
            area,
            precoMetro,
            notaFiscal,
            complexidades: complexidadesSalvas,
            valorTotal: precoFinal
        };

        salvarNoHistorico(orcamentoSalvo);
        mudarAba('historico');
    });
}

// --- INICIALIZAÇÃO ---
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
