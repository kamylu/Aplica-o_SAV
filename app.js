/* ============================================
   SAV — LOGICA OPERACIONAL DE SISTEMAS E DEMO
   ============================================ */

let selectedSlotElement = null;
let currentAnimalIdEmExibicao = null;
let filtroClinicoAtual = "Todos";
let dadosTemporariosRegisto = {};

const racaDicionario = {
    "Cão": ["Labrador Retriever", "Pastor Alemão", "Golden Retriever", "Cocker Spaniel", "Beagle", "Boxer", "Serra da Estrela", "Rafeiro Comum"],
    "Gato": ["Persa", "Siamês", "Maine Coon", "Europeu Comum", "Ragdoll", "Bengal", "Angorá"],
    "Furão": ["Albino Standard", "Sable", "Silver", "Champagne", "Chocolate"]
};

/* Horários por clínica — mais slots e indisponíveis */
const horariosPorClinica = {
    "Hospital Central SAV": ["08:00","08:30","09:00","09:45","10:30","11:00","11:45","12:30","14:00","14:30","15:15","16:00","16:30","17:00","17:45","18:15"],
    "SAV Aveiro Sul":       ["09:00","09:30","10:00","10:45","11:30","12:00","14:00","14:30","15:00","15:45","16:15","17:00","17:30","18:00"]
};

/* Quais índices ficam indisponíveis para cada clínica num dado dia (baseado no dia do mês) */
function calcularIndisponiveisClinica(clinica, diaMes) {
    const total = horariosPorClinica[clinica].length;
    const seed = diaMes * (clinica === "Hospital Central SAV" ? 3 : 7);
    const indisponiveis = new Set();
    // 3-4 slots indisponíveis por dia
    [seed % total, (seed + 2) % total, (seed + 5) % total, (seed + 9) % total].forEach(i => indisponiveis.add(i));
    return indisponiveis;
}

window.addEventListener('DOMContentLoaded', () => {
    inicializarDadosDemonstracao();
    verificarSessaoAtiva();
    configurarDataMinima();
});

function inicializarDadosDemonstracao() {
    /* Garante que a conta demo existe, mas sem apagar contas criadas pelo utilizador */
    const tutoresExistentes = JSON.parse(localStorage.getItem('sav_tutores') || "[]");
    const demoJaExiste = tutoresExistentes.find(x => x.email === 'carlos.silva@gmail.com');
    if (!demoJaExiste) {
        tutoresExistentes.unshift({ email: 'carlos.silva@gmail.com', nome: 'Carlos Silva', nif: '245678901', pin: '1234' });
        localStorage.setItem('sav_tutores', JSON.stringify(tutoresExistentes));
    }

    /* Consulta pré-agendada */
    if (!localStorage.getItem('sav_consultas_agendadas')) {
        const consultasIniciais = [
            { id: "c1", animalNome: "Luna",  clinica: "Hospital Central SAV", data: "2026-06-15", hora: "10:30" },
            { id: "c2", animalNome: "Thor",  clinica: "SAV Aveiro Sul",       data: "2026-06-22", hora: "14:30" }
        ];
        localStorage.setItem('sav_consultas_agendadas', JSON.stringify(consultasIniciais));
    }

    /* Inicializa animais demo apenas se a conta demo não tiver animais */
    const animaisExistentes = JSON.parse(localStorage.getItem('sav_animais_por_tutor') || "{}");
    if (!animaisExistentes['carlos.silva@gmail.com'] || animaisExistentes['carlos.silva@gmail.com'].length === 0) {
        const animaisIniciais = {
            "carlos.silva@gmail.com": [
                /* ── ANIMAL 1: LUNA (Gato) ── */
                {
                    id: "900999111",
                    nome: "Luna",
                    especie: "Gato",
                    raca: "Siamês",
                    idade: 3,
                    peso: 4.1,
                    sangue: "Grupo A",
                    foto: "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=150",
                    alergias: "Nenhuma identificada",
                    dieta: "Ração Light Control",
                    historico: [
                        {
                            tipo: "Vacina",
                            ato: "Tríplice Felina (PVR) — Dose de Reforço Anual",
                            data: "12/01/2026",
                            vet: "Dra. Cristina Santos",
                            clinica: "Hospital Central SAV",
                            decorrer: false,
                            proxima: "12/01/2027"
                        },
                        {
                            tipo: "Vacina",
                            ato: "Leucose Felina (FeLV) — 1.ª Dose",
                            data: "15/10/2025",
                            vet: "Dra. Cristina Santos",
                            clinica: "Hospital Central SAV",
                            decorrer: false,
                            proxima: "15/10/2026"
                        },
                        {
                            tipo: "Tratamento",
                            ato: "Desparasitação Interna (Milbemax) — Trimestral",
                            data: "12/01/2026",
                            vet: "Dra. Cristina Santos",
                            clinica: "Hospital Central SAV",
                            decorrer: false,
                            proxima: "12/04/2026"
                        },
                        {
                            tipo: "Exame",
                            ato: "Análises de Sangue Bioquímicas Completas",
                            data: "15/02/2026",
                            vet: "Dr. Ricardo Cruz",
                            clinica: "SAV Aveiro Sul"
                        },
                        {
                            tipo: "Exame",
                            ato: "Ecografia Abdominal de Rotina",
                            data: "15/02/2026",
                            vet: "Dr. Ricardo Cruz",
                            clinica: "SAV Aveiro Sul"
                        },
                        {
                            tipo: "Diagnóstico",
                            ato: "Gengivite Crónica Ligeira — em monitorização semestral",
                            data: "15/02/2026",
                            vet: "Dr. Ricardo Cruz",
                            clinica: "SAV Aveiro Sul"
                        },
                        {
                            tipo: "Tratamento",
                            ato: "Gel Antissético Dentário Stomaidin — Aplicação Noturna",
                            data: "16/02/2026",
                            vet: "Dr. Ricardo Cruz",
                            clinica: "SAV Aveiro Sul",
                            decorrer: true,
                            proxima: "Aplicar todas as noites até 05/06/2026"
                        },
                        {
                            tipo: "Tratamento",
                            ato: "Desparasitação Externa (Advantage) — Pipeta Mensal",
                            data: "01/05/2026",
                            vet: "Dra. Cristina Santos",
                            clinica: "Hospital Central SAV",
                            decorrer: true,
                            proxima: "Repetir em 01/06/2026"
                        }
                    ]
                },

                /* ── ANIMAL 2: THOR (Cão) ── */
                {
                    id: "900888222",
                    nome: "Thor",
                    especie: "Cão",
                    raca: "Labrador Retriever",
                    idade: 5,
                    peso: 34.2,
                    sangue: "DEA 1.1 Positivo",
                    foto: "https://images.unsplash.com/photo-1552053831-71594a27632d?w=150",
                    alergias: "Picadas de Vespa e Marisco",
                    dieta: "Dieta Rica em Proteína Orijen (Articulações)",
                    historico: [
                        {
                            tipo: "Vacina",
                            ato: "Vacina Antirrábica Obrigatória — Dose Anual",
                            data: "01/03/2026",
                            vet: "Dra. Cristina Santos",
                            clinica: "Hospital Central SAV",
                            decorrer: false,
                            proxima: "01/03/2027"
                        },
                        {
                            tipo: "Vacina",
                            ato: "Polivalente Canina (DHPPiL) — Reforço Trienal",
                            data: "01/03/2026",
                            vet: "Dra. Cristina Santos",
                            clinica: "Hospital Central SAV",
                            decorrer: false,
                            proxima: "01/03/2029"
                        },
                        {
                            tipo: "Vacina",
                            ato: "Leishmaniose — 1.ª Dose do Ciclo",
                            data: "10/05/2026",
                            vet: "Dra. Cristina Santos",
                            clinica: "Hospital Central SAV",
                            decorrer: true,
                            proxima: "Reforço agendado para 31/05/2026"
                        },
                        {
                            tipo: "Cirurgia",
                            ato: "Remoção de Quisto Benigno Dorsal (Lipoma)",
                            data: "10/04/2025",
                            vet: "Dr. André Lima",
                            clinica: "Hospital Central SAV"
                        },
                        {
                            tipo: "Exame",
                            ato: "Radiografia da Anca Direita — Despiste de Displasia",
                            data: "10/04/2025",
                            vet: "Dr. André Lima",
                            clinica: "Hospital Central SAV"
                        },
                        {
                            tipo: "Exame",
                            ato: "Análises Pré-Operatórias (Hemograma + Bioquímica)",
                            data: "09/04/2025",
                            vet: "Dr. André Lima",
                            clinica: "Hospital Central SAV"
                        },
                        {
                            tipo: "Diagnóstico",
                            ato: "Tendência a Displasia Coxofemural Ligeira — controlo semestral",
                            data: "11/04/2025",
                            vet: "Dr. André Lima",
                            clinica: "Hospital Central SAV"
                        },
                        {
                            tipo: "Tratamento",
                            ato: "Suplemento Articular Cosequin DS — Comprimido Diário",
                            data: "11/04/2025",
                            vet: "Dr. André Lima",
                            clinica: "Hospital Central SAV",
                            decorrer: true,
                            proxima: "Contínuo — reavaliar em Novembro 2026"
                        },
                        {
                            tipo: "Tratamento",
                            ato: "Desparasitação Externa (Bravecto) — Comprimido Trimestral",
                            data: "10/05/2026",
                            vet: "Dra. Cristina Santos",
                            clinica: "Hospital Central SAV",
                            decorrer: false,
                            proxima: "10/08/2026"
                        }
                    ]
                },

                /* ── ANIMAL 3: NICO (Furão) ── */
                {
                    id: "900777333",
                    nome: "Nico",
                    especie: "Furão",
                    raca: "Sable",
                    idade: 1,
                    peso: 1.1,
                    sangue: "Desconhecido (Não testado)",
                    foto: "https://images.unsplash.com/photo-1615089675654-20b12bc0b784?w=150",
                    alergias: "Frango fresco e Glúten",
                    dieta: "Ração Mustelídeos Ferret Nature High Protein",
                    historico: [
                        {
                            tipo: "Vacina",
                            ato: "Vacina da Esgana Canina (Mustelídeos) — 1.ª Dose",
                            data: "15/05/2026",
                            vet: "Dr. Ricardo Cruz",
                            clinica: "SAV Aveiro Sul",
                            decorrer: false,
                            proxima: "15/05/2027"
                        },
                        {
                            tipo: "Vacina",
                            ato: "Raiva (Mustelídeos) — 1.ª Dose",
                            data: "15/05/2026",
                            vet: "Dr. Ricardo Cruz",
                            clinica: "SAV Aveiro Sul",
                            decorrer: false,
                            proxima: "15/05/2027"
                        },
                        {
                            tipo: "Exame",
                            ato: "Ecografia Abdominal de Controlo Pós-Adoção",
                            data: "10/05/2026",
                            vet: "Dr. Ricardo Cruz",
                            clinica: "SAV Aveiro Sul"
                        },
                        {
                            tipo: "Exame",
                            ato: "Análises de Rotina (Hemograma Completo)",
                            data: "10/05/2026",
                            vet: "Dr. Ricardo Cruz",
                            clinica: "SAV Aveiro Sul"
                        },
                        {
                            tipo: "Diagnóstico",
                            ato: "Animal saudável — sem patologias identificadas na admissão",
                            data: "10/05/2026",
                            vet: "Dr. Ricardo Cruz",
                            clinica: "SAV Aveiro Sul"
                        },
                        {
                            tipo: "Tratamento",
                            ato: "Desparasitação Interna + Externa Provisória (Panacur + Stronghold)",
                            data: "15/05/2026",
                            vet: "Dr. Ricardo Cruz",
                            clinica: "SAV Aveiro Sul",
                            decorrer: false,
                            proxima: "Repetir em 15/08/2026"
                        }
                    ]
                }
            ]
        };
        /* Merge: mantém animais de outras contas, só adiciona os demo */
        const animaisAtualizado = JSON.parse(localStorage.getItem('sav_animais_por_tutor') || "{}");
        animaisAtualizado['carlos.silva@gmail.com'] = animaisIniciais['carlos.silva@gmail.com'];
        localStorage.setItem('sav_animais_por_tutor', JSON.stringify(animaisAtualizado));
    }

    /* Base SIAC para novos registos */
    const baseSIAC = {
        "900222000": { nome: "Max", especie: "Cão", raca: "Golden Retriever", nifDono: "245678901", peso: 31.2, restricoes: "Nenhuma" }
    };
    localStorage.setItem('siac_database', JSON.stringify(baseSIAC));
}

function atualizarOpcoesRacas() {
    const especie = document.getElementById('animal-especie-input').value;
    const racaSelect = document.getElementById('animal-raca-input');
    racaSelect.innerHTML = "";
    if (!especie) { racaSelect.innerHTML = '<option value="">Escolha a espécie...</option>'; return; }
    racaDicionario[especie].forEach(r => {
        let o = document.createElement('option'); o.value = r; o.innerText = r; racaSelect.appendChild(o);
    });
}

/* ============================================
   REGISTO DE ANIMAL
   ============================================ */
function processarRegistoAnimalSIAC() {
    const chip = document.getElementById('animal-chip-input').value.trim();
    const nome = document.getElementById('animal-nome-input').value.trim();
    const idade = document.getElementById('animal-idade-input').value.trim();
    const especie = document.getElementById('animal-especie-input').value;
    const raca = document.getElementById('animal-raca-input').value;
    const peso = document.getElementById('animal-peso-input').value.trim();

    if (chip.length !== 9 || isNaN(chip)) { showToast("O microchip tem de conter 9 dígitos.", "error"); return; }
    if (!nome || !idade || !especie || !raca || !peso) { showToast("Preencha todos os campos obrigatórios.", "error"); return; }

    document.getElementById('siac-form-content').classList.add('hidden');
    document.getElementById('siac-loading-view').classList.remove('hidden');

    setTimeout(() => {
        const tutor = JSON.parse(localStorage.getItem('sav_sessao_ativa'));
        const animaisPorTutor = JSON.parse(localStorage.getItem('sav_animais_por_tutor') || "{}");
        const meusAnimais = animaisPorTutor[tutor.email.toLowerCase()] || [];

        const novo = {
            id: chip, nome, especie, raca, idade: parseInt(idade), peso: parseFloat(peso),
            sangue: "A analisar via Clínica", alergias: "Nenhuma registada", dieta: "Normal",
            foto: "https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=150",
            historico: [{ tipo: "Diagnóstico", ato: "Registo Automático via SIAC Nacional", data: "Hoje", vet: "Sistema SAV", clinica: "Sincronizado" }]
        };

        meusAnimais.push(novo);
        animaisPorTutor[tutor.email.toLowerCase()] = meusAnimais;
        localStorage.setItem('sav_animais_por_tutor', JSON.stringify(animaisPorTutor));

        document.getElementById('siac-loading-view').classList.add('hidden');
        document.getElementById('siac-form-content').classList.remove('hidden');
        showToast("Animal validado com sucesso na SIAC!", "success");
        mudarSubTela('home');
        renderizerListaAnimais();
    }, 2000);
}

/* ============================================
   GESTÃO DO PERFIL DO ANIMAL
   ============================================ */
function renderizerListaAnimais() {
    const container = document.getElementById('lista-animais-container');
    const tutor = JSON.parse(localStorage.getItem('sav_sessao_ativa'));
    if (!tutor) return;

    const animaisPorTutor = JSON.parse(localStorage.getItem('sav_animais_por_tutor') || "{}");
    const meusAnimais = animaisPorTutor[tutor.email.toLowerCase()] || [];
    container.innerHTML = "";

    if (meusAnimais.length === 0) {
        container.innerHTML = `<p style='text-align:center; padding:20px; color:var(--text-muted);'>Nenhum animal na conta. Adicione o primeiro!</p>`;
        return;
    }

    meusAnimais.forEach(a => {
        const div = document.createElement('div');
        div.className = "card-animal animate-fade";
        div.onclick = () => abrirEdicaoAnimal(a.id);
        div.innerHTML = `
            <img src="${a.foto}" style="width:55px; height:55px; border-radius:50%; object-fit:cover;">
            <div style="flex:1;">
                <h3 style="margin:0;">${a.nome} <span style="font-size:0.75rem; background:var(--brand-yellow-pastel); padding:2px 6px; border-radius:10px; color:var(--brand-yellow);">Editar</span></h3>
                <p style="font-size:0.8rem; color:var(--text-muted);">${a.especie} • ${a.raca} | Chip: ${a.id}</p>
            </div>
            <i class="fa-solid fa-chevron-right" style="color:var(--brand-yellow)"></i>
        `;
        container.appendChild(div);
    });
}

function abrirEdicaoAnimal(id) {
    currentAnimalIdEmExibicao = id;
    const tutor = JSON.parse(localStorage.getItem('sav_sessao_ativa'));
    const animaisPorTutor = JSON.parse(localStorage.getItem('sav_animais_por_tutor') || "{}");
    const a = animaisPorTutor[tutor.email.toLowerCase()].find(x => x.id === id);

    document.getElementById('edit-titulo-nome').innerText = a.nome;
    document.getElementById('edit-titulo-meta').innerText = `${a.especie} • ${a.raca} • Chip ${a.id}`;
    document.getElementById('edit-foto-preview').innerHTML = `<img src="${a.foto}" style="width:100%; height:100%; object-fit:cover;">`;
    document.getElementById('edit-peso').value = a.peso;
    document.getElementById('edit-idade').value = a.idade;
    document.getElementById('edit-foto').value = a.foto;
    document.getElementById('edit-alergias').value = a.alergias;
    document.getElementById('edit-dieta').value = a.dieta;
    document.getElementById('edit-sangue').value = a.sangue;

    mudarSubTela('perfil-animal');
}

function salvarInformacaoNaoClinica() {
    const tutor = JSON.parse(localStorage.getItem('sav_sessao_ativa'));
    const animaisPorTutor = JSON.parse(localStorage.getItem('sav_animais_por_tutor') || "{}");
    const meusAnimais = animaisPorTutor[tutor.email.toLowerCase()] || [];
    const idx = meusAnimais.findIndex(x => x.id === currentAnimalIdEmExibicao);

    if (idx !== -1) {
        meusAnimais[idx].peso = parseFloat(document.getElementById('edit-peso').value);
        meusAnimais[idx].idade = parseInt(document.getElementById('edit-idade').value);
        meusAnimais[idx].foto = document.getElementById('edit-foto').value || "https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=150";
        meusAnimais[idx].alergias = document.getElementById('edit-alergias').value;
        meusAnimais[idx].dieta = document.getElementById('edit-dieta').value;

        animaisPorTutor[tutor.email.toLowerCase()] = meusAnimais;
        localStorage.setItem('sav_animais_por_tutor', JSON.stringify(animaisPorTutor));
        showToast("Dados atualizados com sucesso!", "success");
        mudarSubTela('home');
        renderizerListaAnimais();
    }
}

/* ============================================
   RESUMO DE SAÚDE SELETIVO (COM FILTROS)
   ============================================ */
function popularSeletorAnimaisResumo() {
    const sel = document.getElementById('resumo-select-animal');
    const tutor = JSON.parse(localStorage.getItem('sav_sessao_ativa'));
    const animaisPorTutor = JSON.parse(localStorage.getItem('sav_animais_por_tutor') || "{}");
    const meusAnimais = animaisPorTutor[tutor.email.toLowerCase()] || [];

    sel.innerHTML = meusAnimais.map(a => `<option value="${a.id}">${a.nome} (${a.especie})</option>`).join('');
    filtrarHistoricoClinico();
}

function mudarFiltroClinico(tipo, btn) {
    filtroClinicoAtual = tipo;
    document.querySelectorAll('.filter-tab').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    filtrarHistoricoClinico();
}

/* Relatórios clínicos detalhados — enriquecimento por tipo de ato */
const relatoriosClinicosEnriquecidos = {
    "Tríplice Felina (PVR) — Dose de Reforço Anual": {
        medico: "Dra. Cristina Santos",
        especialidade: "Clínica Geral e Medicina Preventiva Felina",
        relatorio: "Vacinação de reforço anual realizada sem intercorrências. Animal apresentou boa tolerância ao imunobiológico PVR (Panleucopénia, Rinotraqueíte, Calicivírus). Sem reações adversas imediatas. Microchip confirmado e ativo.",
        dieta: "Manter ração light control com hidratação reforçada. Evitar trocas alimentares abruptas. Suplementar com ómega-3 se possível.",
        fisioterapia: "Não aplicável.",
        recomendacoes: "Observar durante 48h pós-vacina. Em caso de edema no local ou letargia prolongada, contactar a clínica. Próxima dose obrigatória em 12/01/2027."
    },
    "Leucose Felina (FeLV) — 1.ª Dose": {
        medico: "Dra. Cristina Santos",
        especialidade: "Imunologia Veterinária Felina",
        relatorio: "Primeira dose da vacina contra leucose felina administrada. Animal seronegativo confirmado para FeLV antes da imunização. Protocolo de duas doses com intervalo de 3-4 semanas.",
        dieta: "Reforçar alimentação imunológica: fontes de vitamina E e C naturais (vegetais como abóbora triturada como suplemento). Hidratação constante.",
        fisioterapia: "Não aplicável.",
        recomendacoes: "Manter o animal em ambiente interior para redução de exposição ao vírus. Agendar 2.ª dose de reforço conforme indicado. Teste FeLV anual recomendado."
    },
    "Desparasitação Interna (Milbemax) — Trimestral": {
        medico: "Dra. Cristina Santos",
        especialidade: "Parasitologia Veterinária",
        relatorio: "Administração oral de Milbemax (milbemicina + praziquantel) realizada com sucesso. Peso registado para cálculo de dose correto. Animal colaborante durante a administração.",
        dieta: "Alimentação normal. Pode-se administrar com pequena quantidade de comida se o animal demonstrar resistência à toma oral.",
        fisioterapia: "Não aplicável.",
        recomendacoes: "Repetir a cada 3 meses. Combinar com desparasitação externa para proteção total. Não administrar a fêmeas gestantes sem aconselhamento prévio."
    },
    "Análises de Sangue Bioquímicas Completas": {
        medico: "Dr. Ricardo Cruz",
        especialidade: "Medicina Interna e Diagnóstico Laboratorial",
        relatorio: "Hemograma e painel bioquímico completo realizados. Valores dentro dos parâmetros normais para a espécie e idade. Ligeiro aumento de fosfatase alcalina sem significado clínico aparente. Rins e fígado com função normal.",
        dieta: "Manutenção da dieta atual. Considerar redução de fósforo na dieta a longo prazo como prevenção renal.",
        fisioterapia: "Não aplicável.",
        recomendacoes: "Repetir análises em 6 meses para monitorização do valor de fosfatase alcalina. Se surgir polidipsia ou poliúria, antecipar reavaliação."
    },
    "Ecografia Abdominal de Rotina": {
        medico: "Dr. Ricardo Cruz",
        especialidade: "Imagiologia e Diagnóstico por Imagem",
        relatorio: "Ecografia abdominal realizada com transdutor linear 7.5 MHz. Órgãos abdominais de morfologia e ecogenicidade normais. Bexiga sem sedimento ou cálculos. Baço e fígado homogéneos. Sem efusão livre.",
        dieta: "Alimentação normal. Evitar refeições abundantes antes de eventuais exames futuros (jejum de 6h recomendado para próximas ecografias).",
        fisioterapia: "Não aplicável.",
        recomendacoes: "Próximo controlo ecográfico em 12 meses. Se surgirem vómitos frequentes, distensão abdominal ou dor à palpação, consultar urgência."
    },
    "Gengivite Crónica Ligeira — em monitorização semestral": {
        medico: "Dr. Ricardo Cruz",
        especialidade: "Estomatologia e Odontologia Veterinária",
        relatorio: "Observação da cavidade oral evidenciou gengivite marginal ligeira nos molares superiores bilaterais. Sem mobilidade dentária. Tártaro moderado. Halitose presente. Indicado início de higiene oral regular e gel antissético.",
        dieta: "Recomendar snacks dentários naturais (ex: palitos dentários para gatos). Evitar comida húmida como refeição única — alternar com ração seca para abrasão natural.",
        fisioterapia: "Não aplicável.",
        recomendacoes: "Aplicar gel Stomaidin diariamente à noite. Reavaliar em 6 meses. Se agravamento com ulceração ou recusa alimentar, agendar destartarização sob anestesia."
    },
    "Gel Antissético Dentário Stomaidin — Aplicação Noturna": {
        medico: "Dr. Ricardo Cruz",
        especialidade: "Estomatologia Veterinária",
        relatorio: "Tratamento complementar à gengivite diagnosticada. Gel Stomaidin com clorexidina a 0,05% indicado para aplicação noturna sobre a gengiva após refeição. Sem efeitos adversos relatados até à data.",
        dieta: "Não administrar comida ou água durante 30 minutos após a aplicação do gel. Preferir refeição sólida antes da aplicação.",
        fisioterapia: "Massagem gengival suave com o dedo durante a aplicação favorece a absorção e estimula a circulação local.",
        recomendacoes: "Manter aplicação diária até 05/06/2026. Guardar o gel em local fresco. Se irritação oral ou hipersalivação excessiva, suspender e contactar a clínica."
    },
    "Desparasitação Externa (Advantage) — Pipeta Mensal": {
        medico: "Dra. Cristina Santos",
        especialidade: "Parasitologia Veterinária",
        relatorio: "Pipeta Advantage (imidacloprid) aplicada na nuca entre as omoplatas. Indicada para controlo de pulgas e piolhos. Produto de uso tópico, não sistémico.",
        dieta: "Alimentação normal. Não dar banho nos 2 dias antes nem nos 2 dias depois da aplicação.",
        fisioterapia: "Não aplicável.",
        recomendacoes: "Repetir mensalmente. Evitar contacto com o local de aplicação nas primeiras 24h. Não usar em animais doentes, debilitados ou com feridas cutâneas."
    },
    "Vacina Antirrábica Obrigatória — Dose Anual": {
        medico: "Dra. Cristina Santos",
        especialidade: "Medicina Preventiva e Saúde Pública Veterinária",
        relatorio: "Vacinação antirrábica obrigatória por lei em Portugal realizada com vacina inativada. Registo no SIAC Nacional atualizado. Certificado de vacinação emitido. Animal calmo durante o procedimento.",
        dieta: "Alimentação normal. Hidratação adequada favorece resposta imunológica.",
        fisioterapia: "Não aplicável.",
        recomendacoes: "Certificado válido por 1 ano. Obrigatório para viajar dentro da UE e para licença municipal do animal. Guardar documento em local seguro. Próxima dose em 01/03/2027."
    },
    "Polivalente Canina (DHPPiL) — Reforço Trienal": {
        medico: "Dra. Cristina Santos",
        especialidade: "Imunologia e Medicina Preventiva Canina",
        relatorio: "Vacina polivalente DHPPiL (Esgana, Hepatite, Parvovirose, Parainfluenza, Leptospirose) administrada como reforço trienal. Título de anticorpos prévio adequado. Boa resposta imune esperada.",
        dieta: "Alimentação equilibrada com proteína de qualidade. Evitar mudanças alimentares na semana pós-vacinação.",
        fisioterapia: "Não aplicável.",
        recomendacoes: "Evitar exposição a locais com muitos cães (parques, canis) nas 72h seguintes. Monitorizar prostração ou febre ligeira nos primeiros 2 dias — normal e autolimitante."
    },
    "Leishmaniose — 1.ª Dose do Ciclo": {
        medico: "Dra. Cristina Santos",
        especialidade: "Doenças Infecciosas e Parasitárias Caninas",
        relatorio: "Primeira dose do ciclo de vacinação contra Leishmania infantum (CaniLeish). Teste ELISA pré-vacinal negativo confirmado. Animal elegível para vacinação. Reação local mínima esperada.",
        dieta: "Dieta imunoestimulante recomendada: antioxidantes (vitamina E, beta-glucanos). Evitar stress alimentar.",
        fisioterapia: "Não aplicável.",
        recomendacoes: "Reforço agendado para 31/05/2026. Após ciclo completo (3 doses), reforço anual. Combinar obrigatoriamente com repelente (Scalibor ou equivalente). Inspecionar o animal após passeios em zonas arborizadas ou rurais."
    },
    "Remoção de Quisto Benigno Dorsal (Lipoma)": {
        medico: "Dr. André Lima",
        especialidade: "Cirurgia de Tecidos Moles",
        relatorio: "Excisão cirúrgica de lipoma subcutâneo dorsal de 3,2 cm com margem limpa. Anestesia geral inalatória com manutenção segura. Sutura intradérmica absorvível. Histopatologia enviada para confirmação benigna — resultado positivo.",
        dieta: "Refeição leve nas primeiras 24h pós-cirurgia. Evitar ração seca em grandes quantidades no dia da cirurgia. Manter hidratação.",
        fisioterapia: "Restrição de atividade física intensa durante 10 dias. Sem saltos ou corridas. Passeios curtos com trela.",
        recomendacoes: "Limpeza da sutura com clorexidina 2x/dia. Usar colar isabelino para prevenir lamber. Remoção de pontos (se não absorvíveis) em 10-14 dias. Monitorizar sinais de infeção: rubor, calor, exsudado."
    },
    "Radiografia da Anca Direita — Despiste de Displasia": {
        medico: "Dr. André Lima",
        especialidade: "Ortopedia Veterinária e Imagiologia",
        relatorio: "Radiografia em projeção ventrodorsal da pelve realizada sob sedação ligeira. Ângulo de Norberg de 95° (ligeiramente abaixo do limite de 105° ideal). Margem acetabular com ligeiro achatamento. Compatível com displasia grau leve (grau B/C OFA).",
        dieta: "Dieta de controlo de peso rigorosa. Cada kg extra aumenta significativamente a sobrecarga articular. Suplementação com colagénio tipo II e omega-3 EPA/DHA.",
        fisioterapia: "Hidroterapia em tapete subaquático 2x/semana recomendada. Exercício de baixo impacto (natação, caminhadas curtas regulares). Evitar superfícies escorregadias em casa.",
        recomendacoes: "Repetir radiografia em 6 meses para avaliação de progressão. Manter suplemento articular Cosequin DS. Contactar ortopedista se claudicação aguda ou recusa de apoio."
    },
    "Análises Pré-Operatórias (Hemograma + Bioquímica)": {
        medico: "Dr. André Lima",
        especialidade: "Anestesiologia e Medicina Interna",
        relatorio: "Painel pré-anestésico completo realizado no dia anterior à cirurgia. Todos os parâmetros dentro dos valores de referência. Risco anestésico ASA I (animal saudável). Clearance cirúrgica concedida.",
        dieta: "Jejum de 8h pré-cirurgia cumprido. Retorno alimentar progressivo após recuperação anestésica.",
        fisioterapia: "Não aplicável.",
        recomendacoes: "Manter controlo laboratorial semestral dada a tendência articular identificada. Alertar veterinário para qualquer alteração de peso, apetite ou comportamento."
    },
    "Tendência a Displasia Coxofemural Ligeira — controlo semestral": {
        medico: "Dr. André Lima",
        especialidade: "Ortopedia e Reabilitação Veterinária",
        relatorio: "Diagnóstico confirmado após radiografia e exame ortopédico. Displasia grau leve com possível progressão. Dor à manipulação da anca direita em extensão forçada. Sem atrofia muscular aparente.",
        dieta: "Dieta de controlo de peso obrigatória (risco de agravamento com sobrepeso). Suplementos: glucosamina 500mg/dia, condroitina 400mg/dia, EPA/DHA 180mg/dia.",
        fisioterapia: "Programa de fisioterapia ativa: 15 min de caminhada 2x/dia em superfície regular. Exercícios de proprioceção (almofadas de equilíbrio). Hidroterapia recomendada 1-2x/semana. Massagem dos músculos glúteos 5 min/dia.",
        recomendacoes: "Reavaliar semestralmente com radiografia e teste de Ortolani. Cirurgia (DPO ou TPO) pode ser considerada em jovens com grau C ou superior. Manter ambiente doméstico adaptado: rampas em vez de escadas, cama ortopédica."
    },
    "Suplemento Articular Cosequin DS — Comprimido Diário": {
        medico: "Dr. André Lima",
        especialidade: "Ortopedia e Medicina Física Veterinária",
        relatorio: "Suplemento Cosequin DS (glucosamina HCl 500mg + condroitina sulfato 400mg) prescrito como parte do protocolo de gestão conservadora da displasia. Administração oral diária com comida.",
        dieta: "Administrar sempre com refeição para melhor tolerância gástrica. Dieta low-carb de suporte articular recomendada. Evitar trocas frequentes de ração.",
        fisioterapia: "Complementar o suplemento com exercício regular de baixo impacto. O efeito do suplemento é potenciado pela mobilização articular controlada.",
        recomendacoes: "Administração contínua a longo prazo. Reavaliar eficácia em Novembro 2026. Em caso de vómito persistente após a toma, reduzir para dose inicial durante 1 semana."
    },
    "Desparasitação Externa (Bravecto) — Comprimido Trimestral": {
        medico: "Dra. Cristina Santos",
        especialidade: "Parasitologia Veterinária",
        relatorio: "Comprimido mastigável Bravecto (fluralaner 1000mg para cão de 20-40kg) administrado com refeição. Proteção sistémica contra pulgas e carraças durante 12 semanas. Animal aceitou bem o comprimido.",
        dieta: "Administrar sempre com uma refeição completa para maximizar absorção e minimizar desconforto gastrointestinal.",
        fisioterapia: "Não aplicável.",
        recomendacoes: "Próxima dose em 10/08/2026. Manter registo atualizado. Inspecionar o animal após passeios em zonas rurais. Eficaz contra Ixodes ricinus (transmissor de Borrelia). Não usar em cães com historial de convulsões."
    },
    "Vacina da Esgana Canina (Mustelídeos) — 1.ª Dose": {
        medico: "Dr. Ricardo Cruz",
        especialidade: "Medicina de Animais Exóticos e Mustelídeos",
        relatorio: "Vacinação anti-esgana adaptada para mustelídeos administrada com sucesso. Furão com boa condição corporal (escore 3/5). Reação ao local da injeção mínima. Animal vígil e reativo após o procedimento.",
        dieta: "Dieta rica em proteína animal (mínimo 35% proteína bruta). Furões são carnívoros estritos — evitar cereais e frutas. Ração específica para mustelídeos ou alimentação BARF adaptada.",
        fisioterapia: "Não aplicável. Estimulação ambiental e enriquecimento comportamental são prioritários nesta fase de desenvolvimento.",
        recomendacoes: "Reforço anual obrigatório. Observar 30 minutos pós-vacina na clínica. Reações anafiláticas, embora raras, são mais frequentes em furões do que noutras espécies."
    },
    "Raiva (Mustelídeos) — 1.ª Dose": {
        medico: "Dr. Ricardo Cruz",
        especialidade: "Medicina Preventiva e Saúde Pública — Animais Exóticos",
        relatorio: "Vacina antirrábica inativada para mustelídeos administrada. Furão registado com microchip ativo. Certificado veterinário emitido. Obrigatório em Portugal para furões de companhia.",
        dieta: "Alimentação proteica normal. Manter hidratação constante com água fresca.",
        fisioterapia: "Não aplicável.",
        recomendacoes: "Reforço anual. Certificado válido para viagens intra-UE. Atualizar registo no SIAC. Monitorizar prostração leve nas 24h seguintes — normal e autolimitante."
    },
    "Ecografia Abdominal de Controlo Pós-Adoção": {
        medico: "Dr. Ricardo Cruz",
        especialidade: "Imagiologia de Animais Exóticos",
        relatorio: "Ecografia abdominal de rotina pós-adoção em furão jovem. Órgãos internos de dimensões e ecogenicidade normais para a idade. Baço ligeiramente aumentado — achado comum e não patológico em furões jovens. Sem massas suspeitas.",
        dieta: "Dieta específica para furões. Evitar snacks com açúcar (risco de insulinoma — patologia frequente nesta espécie). Fracionar em 3-4 refeições diárias.",
        fisioterapia: "Não aplicável.",
        recomendacoes: "Repetir ecografia em 12 meses. Monitorizar sinais de insulinoma: fraqueza, sialorreia, confusão ou colapso — urgência médica nestes casos."
    },
    "Análises de Rotina (Hemograma Completo)": {
        medico: "Dr. Ricardo Cruz",
        especialidade: "Diagnóstico Laboratorial — Medicina Exótica",
        relatorio: "Hemograma completo com valores dentro dos parâmetros de referência para furão jovem. Linfocitose discreta sem significado patológico nesta fase etária. Ausência de sinais de inflamação sistémica ou anemia.",
        dieta: "Manutenção da dieta atual de alta proteína. Suplementar com taurina se a ração não especificar inclusão.",
        fisioterapia: "Não aplicável.",
        recomendacoes: "Controlo laboratorial anual recomendado a partir dos 2 anos (maior risco de neoplasias adrenais e insulinoma em furões adultos)."
    },
    "Animal saudável — sem patologias identificadas na admissão": {
        medico: "Dr. Ricardo Cruz",
        especialidade: "Medicina Preventiva de Animais Exóticos",
        relatorio: "Exame físico completo realizado na admissão do animal. Sem alterações detetadas. Mucosas rosadas, tempo de repleção capilar normal, condição corporal adequada, pelagem brilhante e sem ectoparasitas visíveis.",
        dieta: "Iniciar com ração de qualidade para mustelídeos. Introduzir novos alimentos gradualmente. Água fresca disponível 24h. Evitar laticínios, frutas açucaradas e vegetais fibrosos.",
        fisioterapia: "Não aplicável. Enriquecimento ambiental com túneis, redes de dormir e brinquedos de mordida recomendados para o desenvolvimento comportamental.",
        recomendacoes: "Consulta de bem-estar em 3 meses. Esterilização recomendada entre os 6-12 meses para redução do risco de aplasia medular (fêmeas) e comportamentos agressivos (machos)."
    },
    "Desparasitação Interna + Externa Provisória (Panacur + Stronghold)": {
        medico: "Dr. Ricardo Cruz",
        especialidade: "Parasitologia Veterinária — Animais Exóticos",
        relatorio: "Protocolo de desparasitação pós-adoção com fenbendazol oral (Panacur) 5 dias e selamectina tópica (Stronghold) dose única. Cobertura abrangente para nemátodes, giárdia e sarnas. Animal tolerou bem os dois produtos.",
        dieta: "Administrar Panacur misturado com comida húmida. Não dar banho nos 2 dias após aplicação do Stronghold.",
        fisioterapia: "Não aplicável.",
        recomendacoes: "Repetir Stronghold em 15/08/2026. Repetir Panacur se surgir diarreia ou perda de peso. Quarentena recomendada nas primeiras semanas em casas com outros animais."
    }
};

/* Gera dados de relatório para entradas não mapeadas */
function gerarRelatorioGenerico(h) {
    return {
        medico: h.vet,
        especialidade: "Medicina Veterinária Geral",
        relatorio: `Ato clínico realizado sem intercorrências. ${h.ato}. Procedimento efetuado na ${h.clinica} sob supervisão médica competente.`,
        dieta: "Manter alimentação habitual do animal. Qualquer alteração de dieta deve ser feita gradualmente e sob recomendação veterinária.",
        fisioterapia: "Não especificada para este ato. Consultar o médico responsável caso existam dúvidas sobre mobilidade ou reabilitação.",
        recomendacoes: "Monitorizar o animal nas horas/dias seguintes ao procedimento e contactar a clínica em caso de comportamento anormal."
    };
}

function abrirRelatorioClinico(h) {
    const dados = relatoriosClinicosEnriquecidos[h.ato] || gerarRelatorioGenerico(h);
    const statusHtml = (h.tipo === "Vacina" || h.tipo === "Tratamento") && h.proxima ? `
        <div style="background:${h.decorrer ? 'var(--brand-yellow-pastel)' : 'var(--green-light)'}; border-radius:10px; padding:12px; margin-bottom:14px;">
            <p style="font-weight:700; color:${h.decorrer ? 'var(--brand-yellow)' : 'var(--green)'}; margin:0 0 4px;">
                ● ${h.decorrer ? 'A Decorrer' : 'Concluído / Em Dia'}
            </p>
            <p style="font-size:0.83rem; color:var(--text); margin:0;"><i class="fa-solid fa-clock"></i> ${h.proxima}</p>
        </div>
    ` : '';

    const tipoIcones = { "Vacina": "fa-syringe", "Tratamento": "fa-pills", "Exame": "fa-microscope", "Diagnóstico": "fa-stethoscope", "Cirurgia": "fa-scalpel" };
    const icone = tipoIcones[h.tipo] || "fa-file-medical";

    document.getElementById('relatorio-overlay').innerHTML = `
        <div class="relatorio-card animate-fade">
            <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:16px;">
                <div style="display:flex; align-items:center; gap:12px;">
                    <div style="width:44px; height:44px; background:var(--brand-yellow); border-radius:50%; display:flex; align-items:center; justify-content:center;">
                        <i class="fa-solid ${icone}" style="color:#FFF; font-size:1.1rem;"></i>
                    </div>
                    <div>
                        <span class="badge" style="background:var(--brand-yellow-pastel); color:var(--text); margin-bottom:4px;">${h.tipo}</span>
                        <p style="font-size:0.78rem; color:var(--text-muted); margin:0;">${h.data} · ${h.clinica}</p>
                    </div>
                </div>
                <button onclick="fecharRelatorio()" style="background:var(--bg-tutor); border:1px solid var(--border); color:var(--text); border-radius:8px; padding:6px 10px; font-size:0.85rem; font-weight:600;">✕</button>
            </div>

            <h3 style="margin-bottom:16px; line-height:1.4;">${h.ato}</h3>
            ${statusHtml}

            <div class="relatorio-secao">
                <div class="relatorio-secao-header"><i class="fa-solid fa-user-doctor"></i> Médico Responsável</div>
                <p><strong>${dados.medico}</strong></p>
                <p style="font-size:0.82rem; color:var(--text-muted);">${dados.especialidade}</p>
            </div>

            <div class="relatorio-secao">
                <div class="relatorio-secao-header"><i class="fa-solid fa-file-lines"></i> Relatório Clínico</div>
                <p style="font-size:0.88rem; line-height:1.6; color:var(--text);">${dados.relatorio}</p>
            </div>

            <div class="relatorio-secao">
                <div class="relatorio-secao-header"><i class="fa-solid fa-bowl-food"></i> Recomendações de Dieta</div>
                <p style="font-size:0.88rem; line-height:1.6; color:var(--text);">${dados.dieta}</p>
            </div>

            <div class="relatorio-secao">
                <div class="relatorio-secao-header"><i class="fa-solid fa-person-running"></i> Fisioterapia e Reabilitação</div>
                <p style="font-size:0.88rem; line-height:1.6; color:var(--text);">${dados.fisioterapia}</p>
            </div>

            <div class="relatorio-secao" style="border:none; margin-bottom:0; padding-bottom:0;">
                <div class="relatorio-secao-header"><i class="fa-solid fa-circle-info"></i> Recomendações do Médico</div>
                <p style="font-size:0.88rem; line-height:1.6; color:var(--text);">${dados.recomendacoes}</p>
            </div>

            <button onclick="fecharRelatorio()" class="btn-block btn-primary" style="margin-top:20px;">Fechar Relatório</button>
        </div>
    `;
    document.getElementById('relatorio-overlay').classList.remove('hidden');
}

function fecharRelatorio() {
    document.getElementById('relatorio-overlay').classList.add('hidden');
}

function filtrarHistoricoClinico() {
    const id = document.getElementById('resumo-select-animal').value;
    const container = document.getElementById('historico-clinico-filtrado-container');
    container.innerHTML = "";
    if (!id) return;

    const tutor = JSON.parse(localStorage.getItem('sav_sessao_ativa'));
    const animaisPorTutor = JSON.parse(localStorage.getItem('sav_animais_por_tutor') || "{}");
    const animal = animaisPorTutor[tutor.email.toLowerCase()].find(x => x.id === id);

    let listaFiltrada = animal.historico;
    if (filtroClinicoAtual === "A Decorrer") {
        listaFiltrada = animal.historico.filter(h => h.decorrer === true);
    } else if (filtroClinicoAtual !== "Todos") {
        listaFiltrada = animal.historico.filter(h => h.tipo === filtroClinicoAtual);
    }

    if (listaFiltrada.length === 0) {
        container.innerHTML = `<p style='color:var(--text-muted); font-size:0.9rem; padding:10px;'>Nenhum registo clínico desta categoria para o animal.</p>`;
        return;
    }

    listaFiltrada.forEach(h => {
        const card = document.createElement('div');
        card.className = "clinical-widget clinical-item-clickable";
        card.style.marginBottom = "10px";
        card.style.cursor = "pointer";
        card.onclick = () => abrirRelatorioClinico(h);

        let extras = "";
        if (h.tipo === "Vacina" || h.tipo === "Tratamento") {
            const statusColor = h.decorrer ? "var(--brand-yellow)" : "var(--green)";
            const statusText = h.decorrer ? "A Decorrer" : "Concluído / Em Dia";
            extras = `
                <div style="margin-top:8px; font-size:0.85rem;">
                    <span style="color:${statusColor}; font-weight:700;">● Estado: ${statusText}</span><br>
                    ${h.proxima ? `<span style="color:var(--primary-pastel); font-weight:600;"><i class="fa-solid fa-clock"></i> ${h.proxima}</span>` : ''}
                </div>
            `;
        }

        card.innerHTML = `
            <div style="display:flex; justify-content:space-between; align-items:center;">
                <span class="badge badge-done" style="background:var(--brand-yellow-pastel); color:var(--text);">${h.tipo}</span>
                <div style="display:flex; align-items:center; gap:8px;">
                    <span style="font-size:0.8rem; color:var(--text-muted);">${h.data}</span>
                    <span style="font-size:0.75rem; color:var(--brand-yellow); font-weight:600; border:1px solid var(--brand-yellow); border-radius:8px; padding:2px 7px;">Ver Relatório</span>
                </div>
            </div>
            <h4 style="margin:6px 0;">${h.ato}</h4>
            <p style="font-size:0.82rem; color:var(--text-muted);"><i class="fa-solid fa-user-doctor"></i> ${h.vet} | <i class="fa-solid fa-hospital"></i> ${h.clinica}</p>
            ${extras}
        `;
        container.appendChild(card);
    });
}

/* ============================================
   AGENDA & MARCAÇÕES DINÂMICAS
   ============================================ */
function gerarHorariosCalendario() {
    const c = document.getElementById('slots-horarios-dinamicos');
    const dataDigitada = document.getElementById('marcar-data-input').value;
    const clinicaSelecionada = document.getElementById('marcar-select-clinica').value;
    c.innerHTML = "";
    selectedSlotElement = null;

    if (!dataDigitada) {
        c.innerHTML = "<p style='color:var(--text-muted); font-size:0.85rem;'>Selecione um dia acima para carregar a disponibilidade.</p>";
        return;
    }

    const diaMes = new Date(dataDigitada).getDate();
    const horarios = horariosPorClinica[clinicaSelecionada] || horariosPorClinica["Hospital Central SAV"];
    const indisponiveis = calcularIndisponiveisClinica(clinicaSelecionada, diaMes);

    horarios.forEach((h, index) => {
        const d = document.createElement('div');
        d.className = "slot-card";
        const isIndisponivel = indisponiveis.has(index);

        if (isIndisponivel) {
            d.innerHTML = `<span>${h}</span><small style="display:block; font-size:0.7rem; font-weight:400; margin-top:2px;">Ocupado</small>`;
            d.style.background = "#F4F5F7";
            d.style.color = "var(--text-muted)";
            d.style.cursor = "not-allowed";
            d.setAttribute('data-livre', 'false');
        } else {
            d.innerText = h;
            d.setAttribute('data-livre', 'true');
            d.onclick = () => {
                if (selectedSlotElement) selectedSlotElement.classList.remove('selected');
                selectedSlotElement = d;
                d.classList.add('selected');
            };
        }
        d.setAttribute('data-hora', h);
        c.appendChild(d);
    });
}

function confirmarMarcacaoConsulta() {
    const data = document.getElementById('marcar-data-input').value;
    const aId = document.getElementById('marcar-select-animal').value;
    const clinica = document.getElementById('marcar-select-clinica').value;

    if (!aId || !data || !selectedSlotElement) {
        showToast("Preencha todos os campos e selecione um horário.", "error");
        return;
    }

    const hora = selectedSlotElement.getAttribute('data-hora');
    const tutor = JSON.parse(localStorage.getItem('sav_sessao_ativa'));
    const animaisPorTutor = JSON.parse(localStorage.getItem('sav_animais_por_tutor') || "{}");
    const animal = animaisPorTutor[tutor.email.toLowerCase()].find(x => x.id === aId);

    /* Mostrar ecrã de loading/confirmação */
    mostrarEcraCargaMarcacao(animal.nome, clinica, data, hora, () => {
        const consultas = JSON.parse(localStorage.getItem('sav_consultas_agendadas') || "[]");
        consultas.push({
            id: "c_" + Date.now(),
            animalNome: animal.nome,
            clinica,
            data,
            hora
        });
        localStorage.setItem('sav_consultas_agendadas', JSON.stringify(consultas));
        showToast("Consulta reservada e adicionada à agenda!", "success");
        mudarSubTela('agenda');
    });
}

/* Ecrã de loading animado para marcação */
function mostrarEcraCargaMarcacao(nomeAnimal, clinica, data, hora, callback) {
    const overlay = document.getElementById('marcacao-loading-overlay');
    const steps = overlay.querySelectorAll('.loading-step');

    overlay.classList.remove('hidden');
    steps.forEach(s => s.classList.remove('done', 'active'));

    const fases = [
        { idx: 0, delay: 200,  dur: 900  },
        { idx: 1, delay: 1200, dur: 800  },
        { idx: 2, delay: 2100, dur: 700  },
        { idx: 3, delay: 2900, dur: 600  }
    ];

    fases.forEach(({ idx, delay, dur }) => {
        setTimeout(() => {
            steps[idx].classList.add('active');
            setTimeout(() => steps[idx].classList.add('done'), dur);
        }, delay);
    });

    /* Preencher dados de confirmação */
    document.getElementById('confirm-animal-nome').innerText = nomeAnimal;
    document.getElementById('confirm-clinica').innerText = clinica;
    document.getElementById('confirm-data').innerText = data.split('-').reverse().join('/') + ' às ' + hora;

    setTimeout(() => {
        overlay.classList.add('hidden');
        callback();
    }, 4000);
}

function renderizerAgendaConsultas() {
    const container = document.getElementById('lista-consultas-futuras');
    const consultas = JSON.parse(localStorage.getItem('sav_consultas_agendadas') || "[]");
    container.innerHTML = "";

    if (consultas.length === 0) {
        container.innerHTML = "<p style='color:var(--text-muted); font-size:0.9rem;'>Sem consultas marcadas para os seus animais.</p>";
        return;
    }

    consultas.forEach(c => {
        const div = document.createElement('div');
        div.className = "clinical-widget";
        div.style.marginBottom = "12px";
        div.innerHTML = `
            <div style="display:flex; justify-content:space-between; align-items:flex-start;">
                <div>
                    <h4 style="margin:0;"><i class="fa-solid fa-calendar-check" style="color:var(--brand-yellow);"></i> ${c.animalNome} — Consulta</h4>
                    <p style="font-size:0.85rem; color:var(--text-muted); margin-top:4px;">Local: ${c.clinica}</p>
                    <p style="font-size:0.85rem; font-weight:600; color:var(--text);"><i class="fa-solid fa-clock"></i> Dia ${c.data} às ${c.hora}</p>
                </div>
                <button class="btn-secondary" onclick="cancelarConsulta('${c.id}')" style="background:var(--red-light); color:var(--red); padding:6px 10px; font-size:0.8rem; border-radius:6px; font-weight:700;">Cancelar</button>
            </div>
        `;
        container.appendChild(div);
    });
}

function cancelarConsulta(id) {
    let consultas = JSON.parse(localStorage.getItem('sav_consultas_agendadas') || "[]");
    consultas = consultas.filter(x => x.id !== id);
    localStorage.setItem('sav_consultas_agendadas', JSON.stringify(consultas));
    showToast("Marcação cancelada com sucesso.", "success");
    renderizerAgendaConsultas();
}

/* ============================================
   REVOGAR TITULARIDADE / DELETAR CONTA
   ============================================ */
function processarPerdaTitularidadeApagar() {
    const confirmar = confirm("Atenção: Ao confirmar a perda legal de titularidade dos animais no SIAC, o acesso da sua conta será totalmente revogado. Deseja continuar?");
    if (confirmar) {
        const tutor = JSON.parse(localStorage.getItem('sav_sessao_ativa'));
        const animaisPorTutor = JSON.parse(localStorage.getItem('sav_animais_por_tutor') || "{}");
        delete animaisPorTutor[tutor.email.toLowerCase()];
        localStorage.setItem('sav_animais_por_tutor', JSON.stringify(animaisPorTutor));

        let tutores = JSON.parse(localStorage.getItem('sav_tutores') || "[]");
        tutores = tutores.filter(x => x.email.toLowerCase() !== tutor.email.toLowerCase());
        localStorage.setItem('sav_tutores', JSON.stringify(tutores));

        localStorage.removeItem('sav_sessao_ativa');
        alert("Acesso revogado. A sua conta foi eliminada com base no SIAC.");
        location.reload();
    }
}

/* ============================================
   ESTRUTURA BASE SPA NATIVO
   ============================================ */
function executarLoginTutor() {
    const pin = document.getElementById('login-pin').value.trim();
    const tutores = JSON.parse(localStorage.getItem('sav_tutores') || "[]");
    const matches = tutores.filter(x => x.pin === pin);

    if (matches.length === 0) {
        showToast("PIN incorreto. Utilize 1234 para a conta demo.", "error");
        return;
    }

    if (matches.length > 1) {
        const emailEscolhido = prompt("Mais do que uma conta tem este PIN.\nIntroduza o seu e-mail para identificar a conta:\n" + matches.map(x => x.email).join("\n"));
        const t = matches.find(x => x.email.toLowerCase() === (emailEscolhido || "").toLowerCase().trim());
        if (!t) { showToast("E-mail nao reconhecido para este PIN.", "error"); return; }
        localStorage.setItem('sav_sessao_ativa', JSON.stringify(t));
        showToast("Bem-vindo de volta, " + t.nome + "! 🐾", "success");
        verificarSessaoAtiva();
        return;
    }

    const t = matches[0];
    localStorage.setItem('sav_sessao_ativa', JSON.stringify(t));
    showToast("Bem-vindo de volta, " + t.nome + "! 🐾", "success");
    verificarSessaoAtiva();
}

function solicitarCriacaoConta() {
    const nome = document.getElementById('reg-nome').value.trim();
    const email = document.getElementById('reg-email').value.trim();
    const nif = document.getElementById('reg-nif').value.trim();
    const aceitou = document.getElementById('reg-termos').checked;

    if (!nome || !email || !nif || !aceitou) { showToast("Preencha todos os campos obrigatórios.", "error"); return; }
    if (!/^\d{9}$/.test(nif)) { showToast("O NIF deve conter exatamente 9 dígitos numéricos.", "error"); return; }

    /* Verificar email duplicado */
    const tutores = JSON.parse(localStorage.getItem('sav_tutores') || "[]");
    if (tutores.find(x => x.email.toLowerCase() === email.toLowerCase())) {
        showToast("Este e-mail já está registado na base de dados SAV.", "error");
        return;
    }

    dadosTemporariosRegisto = { nome, email, nif };
    showToast("Código de verificação enviado para o seu e-mail.", "success");
    document.getElementById('auth-register-view').classList.add('hidden');
    document.getElementById('auth-verification-view').classList.remove('hidden');
}

function validarCodigoVerificacao() {
    const codigo = document.getElementById('verification-code').value.trim();
    if (!codigo) { showToast("Insira o código de verificação.", "error"); return; }
    document.getElementById('auth-verification-view').classList.add('hidden');
    document.getElementById('auth-pin-set-view').classList.remove('hidden');
}

function finalizarRegistoPerfil() {
    const pin = document.getElementById('new-pin').value.trim();
    if (pin.length !== 4 || isNaN(pin)) { showToast("O PIN tem de ter 4 algarismos.", "error"); return; }
    if (pin === '1234') { showToast("O PIN 1234 está reservado. Escolha outro PIN.", "error"); return; }

    const tutores = JSON.parse(localStorage.getItem('sav_tutores') || "[]");
    const novo = { nome: dadosTemporariosRegisto.nome, email: dadosTemporariosRegisto.email, nif: dadosTemporariosRegisto.nif, pin };
    tutores.push(novo);
    localStorage.setItem('sav_tutores', JSON.stringify(tutores));

    const animaisPorTutor = JSON.parse(localStorage.getItem('sav_animais_por_tutor') || "{}");
    animaisPorTutor[novo.email.toLowerCase()] = [];
    localStorage.setItem('sav_animais_por_tutor', JSON.stringify(animaisPorTutor));

    localStorage.setItem('sav_sessao_ativa', JSON.stringify(novo));
    showToast("Conta criada com sucesso! Bem-vindo/a à SAV! 🐾", "success");
    verificarSessaoAtiva();
}

function mudarSubTela(id) {
    document.querySelectorAll('.sub-view').forEach(v => v.classList.add('hidden'));
    document.getElementById(`sub-${id}`).classList.remove('hidden');
    document.querySelectorAll('.nav-menu .nav-btn').forEach(b => b.classList.remove('active'));

    if (id === 'home' || id === 'perfil-animal') document.getElementById('nav-home').classList.add('active');
    if (id === 'resumo-saude') {
        document.getElementById('nav-resumo').classList.add('active');
        popularSeletorAnimaisResumo();
    }
    if (id === 'marcar') {
        document.getElementById('nav-marcar').classList.add('active');
        /* Repõe slots ao mudar de clínica ou data */
        const sel = document.getElementById('marcar-select-animal');
        const tutor = JSON.parse(localStorage.getItem('sav_sessao_ativa'));
        const animaisPorTutor = JSON.parse(localStorage.getItem('sav_animais_por_tutor') || "{}");
        const meus = animaisPorTutor[tutor.email.toLowerCase()] || [];
        sel.innerHTML = meus.map(x => `<option value="${x.id}">${x.nome}</option>`).join('');
        gerarHorariosCalendario();
    }
    if (id === 'agenda') {
        document.getElementById('nav-agenda').classList.add('active');
        renderizerAgendaConsultas();
    }
    if (id === 'config') document.getElementById('nav-config').classList.add('active');
}



function verificarSessaoAtiva() {
    const s = localStorage.getItem('sav_sessao_ativa');
    if (s) {
        const u = JSON.parse(s);
        document.getElementById('screen-auth').classList.add('hidden');
        document.getElementById('screen-app').classList.remove('hidden');
        document.getElementById('user-display-name').innerText = `Tutor: ${u.nome}`;
        renderizerListaAnimais();
    } else {
        document.getElementById('screen-auth').classList.remove('hidden');
        document.getElementById('screen-app').classList.add('hidden');
    }
}

function configurarDataMinima() {
    const inp = document.getElementById('marcar-data-input');
    if (inp) inp.min = new Date().toISOString().split('T')[0];
}

function reenviarCodigoSmsEmail() { showToast("Código reenviado com sucesso para o seu contacto.", "success"); }
function executarLogout() { localStorage.removeItem('sav_sessao_ativa'); location.reload(); }

function alternarVisaoAuth(v) {
    ['auth-login-view','auth-register-view','auth-verification-view','auth-pin-set-view'].forEach(id => {
        document.getElementById(id).classList.add('hidden');
    });
    if (v === 'registo') document.getElementById('auth-register-view').classList.remove('hidden');
    if (v === 'login')   document.getElementById('auth-login-view').classList.remove('hidden');
}

function fecharRelatorioFora(event) {
    if (event.target === document.getElementById('relatorio-overlay')) {
        fecharRelatorio();
    }
}

function showToast(m, t) {
    const b = document.getElementById('toast-container');
    b.className = `toast animate-fade toast-${t}`;
    b.innerText = m;
    b.classList.remove('hidden');
    setTimeout(() => b.classList.add('hidden'), 3500);
}
