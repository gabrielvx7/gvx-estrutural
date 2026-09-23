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

    // Eventos dos botões de + e -
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
function criarToggleComplexidade() {
    const btnToggle = document.getElementById('btnAtivarComplexidade');
    const containerComplexidades = document.getElementById('containerComplexidades');

    if (btnToggle && containerComplexidades) {
        // Garante que o container comece oculto
        containerComplexidades.style.display = 'none';

        const novoBtnToggle = btnToggle.cloneNode(true);
        btnToggle.parentNode.replaceChild(novoBtnToggle, btnToggle);

        document.getElementById('btnAtivarComplexidade').addEventListener('click', () => {
            const estaVisivel = containerComplexidades.style.display === 'block';
            
            if (estaVisivel) {
                containerComplexidades.style.display = 'none';
                document.getElementById('btnAtivarComplexidade').innerText = "Ativar Complexidade";
            } else {
                containerComplexidades.style.display = 'block';
                document.getElementById('btnAtivarComplexidade').innerText = "Ocultar Complexidade";
            }
        });
    }
}

// --- HISTÓRICO DE ORÇAMENTOS ---
function salvarNoHistorico(orcamento) {
    let historico = JSON.parse(localStorage.getItem('gvx_historico_orcamentos')) || [];
    historico.unshift(orcamento); // Adiciona no início
    localStorage.setItem('gvx_historico_orcamentos', JSON.stringify(historico));
}

function inicializarExemplosHistorico() {
    // Espaço reservado caso queira inicializar dados estáticos no histórico
}

// --- FUNÇÃO DE GERAR IMAGEM A4 ---
async function gerarImagemA4Especifica(orcamento) {
    // Substitua ou ajuste conforme a sua lógica existente de geração de imagem/PDF
    console.log("Gerando imagem A4 para o orçamento:", orcamento);
    // Exemplo simulado de exportação/download
    alert("Baixando imagem A4 do orçamento de " + orcamento.cliente + "...");
}

// --- EVENT LISTENERS DOS INPUTS DE CÁLCULO ---
const areaInput = document.getElementById('areaConstruida');
const precoMetroInput = document.getElementById('precoMetro');

if (areaInput) areaInput.addEventListener('input', calcularOrcamento);
if (precoMetroInput) precoMetroInput.addEventListener('input', calcularOrcamento);

// --- BOTÃO PRINCIPAL: CONCLUIR ORÇAMENTO ---
const btnAcaoPrincipal = document.getElementById('btnGerarPdf');
const btnHistorico = document.getElementById('btnHistorico') || { click: () => {} }; // Referência de fallback para aba de histórico

if (btnAcaoPrincipal) {
    btnAcaoPrincipal.innerText = "Concluir Orçamento";
    
    // Limpa ouvintes anteriores para evitar duplicidade ou ações diretas indesejadas
    const novoBtnAcao = btnAcaoPrincipal.cloneNode(true);
    btnAcaoPrincipal.parentNode.replaceChild(novoBtnAcao, btnAcaoPrincipal);

    document.getElementById('btnGerarPdf').addEventListener('click', () => {
        const cliente = document.getElementById('cliente').value || 'Cliente não informado';
        const numOrcamento = document.getElementById('numOrcamento').value || '';
        const data = document.getElementById('dataOrcamento').value || '';
        const descricao = document.getElementById('descricaoObra').value || '';
        const area = document.getElementById('areaConstruida').value || '';
        const precoMetro = document.getElementById('precoMetro').value || '';
        const notaFiscal = document.getElementById('notaFiscal').value || '';
        
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

        // 1. SALVA NO HISTÓRICO PRIMEIRO
        salvarNoHistorico(orcamentoSalvo);

        // 2. ABRE O MODAL PERGUNTANDO SE QUER BAIXAR OU IR PARA O HISTÓRICO
        const modalDownload = document.createElement('div');
        modalDownload.style.cssText = 'position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0, 0, 0, 0.5); display: flex; align-items: center; justify-content: center; z-index: 1000;';
        modalDownload.innerHTML = `
            <div style="background: white; padding: 24px; border-radius: 12px; width: 320px; box-shadow: 0 10px 25px rgba(0,0,0,0.2); display: flex; flex-direction: column; gap: 12px; text-align: center;">
                <h3 style="font-size: 15px; font-weight: bold; color: #0b192c; margin: 0;">Orçamento Concluído!</h3>
                <p style="font-size: 13px; color: #64748b; margin: 0;">Salvo no histórico. Deseja efetuar o download da imagem A4 agora?</p>
                <button id="btnSimDownload" style="background: #d4af37; color: #0f172a; border: none; padding: 10px; border-radius: 8px; font-size: 12px; font-weight: bold; cursor: pointer;">Sim, Baixar</button>
                <button id="btnNaoDownload" style="background: #f1f5f9; color: #334155; border: none; padding: 8px; border-radius: 8px; font-size: 12px; font-weight: bold; cursor: pointer;">Não, ir para Histórico</button>
            </div>
        `;
        document.body.appendChild(modalDownload);

        // Ação do botão "Sim, Baixar"
        document.getElementById('btnSimDownload').addEventListener('click', async () => {
            document.body.removeChild(modalDownload);
            await gerarImagemA4Especifica(orcamentoSalvo);
            btnHistorico.click(); 
        });

        // Ação do botão "Não, ir para Histórico"
        document.getElementById('btnNaoDownload').addEventListener('click', () => {
            document.body.removeChild(modalDownload);
            btnHistorico.click(); 
        });
    });
}

// --- INICIALIZAÇÃO GERAL ---
criarToggleComplexidade();
inicializarExemplosHistorico();
renderizarComplexidades();
calcularOrcamento();

// --- SERVICE WORKER ---
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('./sw.js')
            .then(() => console.log('Service Worker registado com sucesso!'))
            .catch(err => console.log('Erro ao registar Service Worker:', err));
    });
}
