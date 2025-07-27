// demo-script.js

// NON ABBIAMO PIÙ BISOGNO DI API_BASE_URL PER LA DEMO
// const API_BASE_URL = 'http://127.0.0.1:8000'; 

// --- Dati Mock per la Demo ---
// Questi dati simulano le risposte che verrebbero dalle tue API
const mockData = {
    offices: ["OfficeA", "OfficeB", "OfficeC"],
    kpiSummaryGlobal: {
        totalVulnerabilities: 125,
        totalServers: 50,
        uniqueServersAffected: 35,
        serversWithEolOs: 8,
        eolComponents: 15,
        criticalVulnerabilities: 20,
        highVulnerabilities: 45,
        criticalOutOfSLA: 5,
        highOutOfSLA: 12,
        vulnerabilitiesPerServerTotal: 2.5,
        healthScorePercentage: '75%',
        healthScoreColor: 'yellow', // green, yellow, red
        vulnerabilitiesBySeverity: {
            Critical: 20,
            High: 45,
            Medium: 50,
            Low: 10
        },
        vulnerabilitiesPerServerBreakdown: [
            { serverId: "SRV001", vulnerabilityCount: 10 },
            { serverId: "SRV002", vulnerabilityCount: 8 },
            { serverId: "SRV003", vulnerabilityCount: 7 },
            { serverId: "SRV004", vulnerabilityCount: 6 },
            { serverId: "SRV005", vulnerabilityCount: 5 },
            { serverId: "SRV006", vulnerabilityCount: 4 },
            { serverId: "SRV007", vulnerabilityCount: 3 },
            { serverId: "SRV008", vulnerabilityCount: 2 },
            { serverId: "SRV009", vulnerabilityCount: 1 },
            { serverId: "SRV010", vulnerabilityCount: 1 }
        ]
    },
    kpiSummaryOfficeA: {
        totalVulnerabilities: 50,
        totalServers: 20,
        uniqueServersAffected: 15,
        serversWithEolOs: 3,
        eolComponents: 5,
        criticalVulnerabilities: 10,
        highVulnerabilities: 20,
        criticalOutOfSLA: 2,
        highOutOfSLA: 5,
        vulnerabilitiesPerServerTotal: 2.5,
        healthScorePercentage: '85%',
        healthScoreColor: 'green',
        vulnerabilitiesBySeverity: {
            Critical: 10,
            High: 20,
            Medium: 15,
            Low: 5
        },
        vulnerabilitiesPerServerBreakdown: [
            { serverId: "SRV_A01", vulnerabilityCount: 7 },
            { serverId: "SRV_A02", vulnerabilityCount: 5 },
            { serverId: "SRV_A03", vulnerabilityCount: 4 }
        ]
    },
    kpiSummaryOfficeB: {
        totalVulnerabilities: 60,
        totalServers: 15,
        uniqueServersAffected: 10,
        serversWithEolOs: 4,
        eolComponents: 7,
        criticalVulnerabilities: 8,
        highVulnerabilities: 25,
        criticalOutOfSLA: 3,
        highOutOfSLA: 6,
        vulnerabilitiesPerServerTotal: 4.0,
        healthScorePercentage: '60%',
        healthScoreColor: 'red',
        vulnerabilitiesBySeverity: {
            Critical: 8,
            High: 25,
            Medium: 20,
            Low: 7
        },
        vulnerabilitiesPerServerBreakdown: [
            { serverId: "SRV_B01", vulnerabilityCount: 9 },
            { serverId: "SRV_B02", vulnerabilityCount: 8 },
            { serverId: "SRV_B03", vulnerabilityCount: 6 }
        ]
    },
    // Puoi aggiungere mockData per OfficeC se necessario
    timeSeriesGlobal: [
        { date: "2024-01-01", count: 10 },
        { date: "2024-02-01", count: 15 },
        { date: "2024-03-01", count: 22 },
        { date: "2024-04-01", count: 30 },
        { date: "2024-05-01", count: 45 },
        { date: "2024-06-01", count: 55 },
        { date: "2024-07-01", count: 68 }
    ],
    timeSeriesOfficeA: [
        { date: "2024-01-01", count: 3 },
        { date: "2024-02-01", count: 5 },
        { date: "2024-03-01", count: 8 },
        { date: "2024-04-01", count: 12 },
        { date: "2024-05-01", count: 18 },
        { date: "2024-06-01", count: 25 },
        { date: "2024-07-01", count: 30 }
    ],
    vulnerabilitiesAllGlobal: [
        { vulnerability_id: "VULN001", cve_id: "CVE-2023-1234", server_id: "SRV001", office_id: "OfficeA", severity: "Critical", os_type: "Linux", is_eol_os: false, component_name: "OpenSSL", is_eol_component: false, discovery_date: "2024-01-15", sla_status: "In SLA" },
        { vulnerability_id: "VULN002", cve_id: "CVE-2023-5678", server_id: "SRV002", office_id: "OfficeB", severity: "High", os_type: "Windows", is_eol_os: true, component_name: "IIS", is_eol_component: false, discovery_date: "2024-02-20", sla_status: "Fuori SLA" },
        { vulnerability_id: "VULN003", cve_id: "CVE-2023-9101", server_id: "SRV001", office_id: "OfficeA", severity: "Medium", os_type: "Linux", is_eol_os: false, component_name: "Nginx", is_eol_component: false, discovery_date: "2024-03-10", sla_status: "In SLA" },
        { vulnerability_id: "VULN004", cve_id: "CVE-2023-1111", server_id: "SRV003", office_id: "OfficeA", severity: "Critical", os_type: "Windows", is_eol_os: false, component_name: "SQL Server", is_eol_component: false, discovery_date: "2024-04-05", sla_status: "Fuori SLA" },
        { vulnerability_id: "VULN005", cve_id: "CVE-2023-2222", server_id: "SRV004", office_id: "OfficeC", severity: "Low", os_type: "Linux", is_eol_os: false, component_name: "Apache", is_eol_component: false, discovery_date: "2024-05-01", sla_status: "In SLA" }
    ],
    assetsGlobal: [
        { server_id: "SRV001", office_id: "OfficeA", os_type: "Linux", is_eol_os: false },
        { server_id: "SRV002", office_id: "OfficeB", os_type: "Windows", is_eol_os: true },
        { server_id: "SRV003", office_id: "OfficeA", os_type: "Windows", is_eol_os: false },
        { server_id: "SRV004", office_id: "OfficeC", os_type: "Linux", is_eol_os: false },
        { server_id: "SRV005", office_id: "OfficeA", os_type: "Linux", is_eol_os: false }
    ]
};

// Riferimenti agli elementi HTML (vengono inizializzati in DOMContentLoaded)
let officeSelect = null;
let kpiTitleElement = null;
let vizTitleElement = null;
let kpiGridElement = null;
let chartsGridElement = null;

// Riferimenti per i KPI (riassegnati in loadDashboardData dopo che il DOM è pronto)
let totalVulnerabilitiesElement = null;
let totalServersElement = null;
let uniqueServersElement = null;
let eolOsServersElement = null;
let eolComponentsElement = null;
let criticalVulnerabilitiesElement = null;
let highVulnerabilitiesElement = null;
let criticalOutOfSLAElement = null;
let highOutOfSLAElement = null;
let vulnerabilitiesPerServerTotalElement = null;
let healthScorePercentageElement = null;
let healthScoreContainerElement = null;
let showVulnerabilitiesTableBtn = null;
let showAssetsTableBtn = null;
let modalOfficeLabel = null;
let modalAssetOfficeLabel = null; 

// Variabili per i grafici Chart.js (inizializzate a null e distrutte/ricreate)
let severityChart = null;
let serversChart = null;
let timeChart = null;

// Variabili per le tabelle DataTables (istanze)
let vulnerabilitiesDataTable = null;
let assetsDataTable = null; 

// ID dell'ufficio attualmente selezionato
let currentOfficeId = null; 

// Nuovi colori personalizzati per i grafici Chart.js (adattati al tema chiaro)
const chartColors = {
    primary: '#007bff',       // Blu di Bootstrap
    secondary: '#6f42c1',     // Viola di Bootstrap
    background: '#f8f9fa',    // Sfondo chiaro delle card (per tooltip)
    gridLines: '#e9ecef',     // Grigio chiaro per le griglie
    text: '#495057',          // Grigio scuro per il testo (labels, ticks)
    severity: {
        Critical: '#dc3545',  // Rosso scuro (per Critical)
        High: '#fd7e14',      // Arancione (per High)
        Medium: '#ffc107',    // Giallo scuro (per Medium)
        Low: '#17a2b8'        // Blu-verde (per Low)
    },
    line: '#6f42c1'           // Viola per le linee di trend
};

// --- Funzioni di Utility con Dati Mock ---

// Funzione mock per il recupero dati
// Simula un ritardo di rete con setTimeout per rendere l'esperienza più realistica
async function mockFetchData(dataType, officeId = null) {
    return new Promise(resolve => {
        setTimeout(() => {
            let data = null;
            switch (dataType) {
                case 'offices':
                    data = mockData.offices;
                    break;
                case 'kpiSummary':
                    data = officeId ? mockData['kpiSummary' + officeId] : mockData.kpiSummaryGlobal;
                    break;
                case 'timeSeries':
                    data = officeId ? mockData['timeSeries' + officeId] : mockData.timeSeriesGlobal;
                    break;
                case 'vulnerabilitiesAll':
                    data = mockData.vulnerabilitiesAllGlobal.filter(v => !officeId || v.office_id === officeId);
                    break;
                case 'assets':
                    data = mockData.assetsGlobal.filter(a => !officeId || a.office_id === officeId);
                    break;
                default:
                    data = null;
            }
            resolve(data);
        }, 300); // Simula un ritardo di 300ms
    });
}


// Funzione per il caricamento dei dati KPI (USA MOCK DATA)
async function fetchKpiSummary(officeId = null) {
    try {
        return await mockFetchData('kpiSummary', officeId);
    } catch (error) {
        console.error("Errore nel recupero dei KPI mock:", error);
        alert("Impossibile caricare i dati dei KPI mock. Controlla la console per i dettagli.");
        return null;
    }
}

// Funzione per il caricamento degli ID degli uffici (USA MOCK DATA)
async function fetchOfficeIds() {
    try {
        return await mockFetchData('offices'); 
    } catch (error) {
        console.error("Errore nel recupero degli ID degli uffici mock:", error);
        return [];
    }
}

// Funzione per il recupero dei dati degli asset (USA MOCK DATA)
async function fetchAssets(officeId = null) {
    try {
        return await mockFetchData('assets', officeId);
    } catch (error) {
        console.error("Errore nel recupero degli asset mock:", error);
        alert("Impossibile caricare i dati degli asset mock. Controlla la console per i dettagli.");
        return [];
    }
}


// --- Le seguenti funzioni rimangono INALTERATE perché elaborano i dati, non li recuperano ---

// Funzione per il rendering dei KPI
function renderKpis(kpiData) {
    if (!kpiData) {
        kpiGridElement.innerHTML = '<div class="col-12 text-center text-muted">Dati KPI non disponibili.</div>';
        totalVulnerabilitiesElement = null;
        totalServersElement = null;
        uniqueServersElement = null;
        eolOsServersElement = null;
        eolComponentsElement = null;
        criticalVulnerabilitiesElement = null;
        highVulnerabilitiesElement = null;
        criticalOutOfSLAElement = null;
        highOutOfSLAElement = null;
        vulnerabilitiesPerServerTotalElement = null;
        healthScorePercentageElement = null;
        healthScoreContainerElement = null;
        return;
    }

    totalVulnerabilitiesElement = document.getElementById('total-vulnerabilities');
    totalServersElement = document.getElementById('total-servers');
    uniqueServersElement = document.getElementById('unique-servers');
    eolOsServersElement = document.getElementById('eol-os-servers');
    eolComponentsElement = document.getElementById('eol-components');
    criticalVulnerabilitiesElement = document.getElementById('critical-vulnerabilities');
    highVulnerabilitiesElement = document.getElementById('high-vulnerabilities');
    criticalOutOfSLAElement = document.getElementById('critical-out-of-sla');
    highOutOfSLAElement = document.getElementById('high-out-of-sla');
    vulnerabilitiesPerServerTotalElement = document.getElementById('vulnerabilities-per-server-total');
    healthScorePercentageElement = document.getElementById('health-score-percentage');
    healthScoreContainerElement = document.getElementById('health-score-container');


    totalVulnerabilitiesElement.textContent = kpiData.totalVulnerabilities !== undefined ? kpiData.totalVulnerabilities : 'N/D';
    totalServersElement.textContent = kpiData.totalServers !== undefined ? kpiData.totalServers : 'N/D';
    uniqueServersElement.textContent = kpiData.uniqueServersAffected !== undefined ? kpiData.uniqueServersAffected : 'N/D';
    eolOsServersElement.textContent = kpiData.serversWithEolOs !== undefined ? kpiData.serversWithEolOs : 'N/D';
    eolComponentsElement.textContent = kpiData.eolComponents !== undefined ? kpiData.eolComponents : 'N/D';
    criticalVulnerabilitiesElement.textContent = kpiData.criticalVulnerabilities !== undefined ? kpiData.criticalVulnerabilities : 'N/D';
    highVulnerabilitiesElement.textContent = kpiData.highVulnerabilities !== undefined ? kpiData.highVulnerabilities : 'N/D';
    criticalOutOfSLAElement.textContent = kpiData.criticalOutOfSLA !== undefined ? kpiData.criticalOutOfSLA : 'N/D';
    highOutOfSLAElement.textContent = kpiData.highOutOfSLA !== undefined ? kpiData.highOutOfSLA : 'N/D';
    vulnerabilitiesPerServerTotalElement.textContent = kpiData.vulnerabilitiesPerServerTotal !== undefined ? kpiData.vulnerabilitiesPerServerTotal.toFixed(2) : 'N/D';

    if (kpiData.healthScorePercentage !== undefined && kpiData.healthScoreColor) {
        healthScorePercentageElement.textContent = kpiData.healthScorePercentage;
        healthScoreContainerElement.classList.remove('bg-success', 'bg-warning', 'bg-danger', 'bg-secondary');
        
        if (kpiData.healthScoreColor === 'green') {
            healthScoreContainerElement.classList.add('bg-success');
        } else if (kpiData.healthScoreColor === 'yellow') {
            healthScoreContainerElement.classList.add('bg-warning');
        } else if (kpiData.healthScoreColor === 'red') {
            healthScoreContainerElement.classList.add('bg-danger');
        }
    } else {
        healthScorePercentageElement.textContent = 'N/D';
        healthScoreContainerElement.classList.remove('bg-success', 'bg-warning', 'bg-danger');
        healthScoreContainerElement.classList.add('bg-secondary');
    }
}


// Funzione per il rendering del grafico delle vulnerabilità per gravità
function renderSeverityChart(data) {
    const ctx = document.getElementById('severity-chart-canvas').getContext('2d');

    if (severityChart) {
        severityChart.destroy();
        severityChart = null;
    }

    if (!data || Object.keys(data).length === 0 || Object.values(data).every(val => val === 0)) {
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        ctx.font = "16px Arial";
        ctx.fillStyle = chartColors.text;
        ctx.textAlign = "center";
        ctx.fillText("Nessun dato disponibile per il grafico di gravità.", ctx.canvas.width / 2, ctx.canvas.height / 2);
        return;
    }

    const labels = Object.keys(data);
    const counts = Object.values(data);

    const backgroundColors = labels.map(label => chartColors.severity[label] || chartColors.secondary);
    const borderColors = labels.map(label => chartColors.severity[label].replace('0.8)', '1)') || chartColors.secondary);

    severityChart = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: labels,
            datasets: [{
                data: counts,
                backgroundColor: backgroundColors,
                borderColor: borderColors,
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'top',
                    labels: {
                        color: chartColors.text
                    }
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            let label = context.label || '';
                            if (label) {
                                label += ': ';
                            }
                            if (context.parsed !== null) {
                                label += context.parsed;
                            }
                            return label;
                        }
                    }
                },
                title: {
                    display: false,
                }
            }
        }
    });
}

// Funzione per il rendering del grafico dei server più vulnerabili
function renderServersChart(data) {
    const ctx = document.getElementById('servers-chart-canvas').getContext('2d');

    if (serversChart) {
        serversChart.destroy();
        serversChart = null;
    }

    if (!data || data.length === 0 || data.every(item => item.vulnerabilityCount === 0)) {
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        ctx.font = "16px Arial";
        ctx.fillStyle = chartColors.text;
        ctx.textAlign = "center";
        ctx.fillText("Nessun dato disponibile per il grafico dei server.", ctx.canvas.width / 2, ctx.canvas.height / 2);
        return;
    }

    const sortedData = data.sort((a, b) => b.vulnerabilityCount - a.vulnerabilityCount).slice(0, 10);
    const labels = sortedData.map(item => item.serverId);
    const counts = sortedData.map(item => item.vulnerabilityCount);

    serversChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'Numero di Vulnerabilità',
                data: counts,
                backgroundColor: chartColors.primary.replace('0.8)', '0.8)'),
                borderColor: chartColors.primary,
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            indexAxis: 'y',
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return `${context.dataset.label}: ${context.parsed.x}`;
                        }
                    }
                },
                title: {
                    display: false,
                }
            },
            scales: {
                x: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Vulnerabilità',
                        color: chartColors.text
                    },
                    ticks: {
                        color: chartColors.text
                    },
                    grid: {
                        color: chartColors.gridLines
                    }
                },
                y: {
                    title: {
                        display: true,
                        text: 'Server ID',
                        color: chartColors.text
                    },
                    ticks: {
                        color: chartColors.text
                    },
                    grid: {
                        color: chartColors.gridLines
                    }
                }
            }
        }
    });
}

// Funzione per il rendering del grafico dell'andamento nel tempo (USA MOCK DATA)
async function renderTimeChart(officeId = null) {
    const ctx = document.getElementById('time-chart-canvas').getContext('2d');

    if (timeChart) {
        timeChart.destroy();
        timeChart = null;
    }

    try {
        const data = await mockFetchData('timeSeries', officeId);

        if (!data || data.length === 0) {
            ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
            ctx.font = "16px Arial";
            ctx.fillStyle = chartColors.text;
            ctx.textAlign = "center";
            ctx.fillText("Nessun dato disponibile per il grafico temporale.", ctx.canvas.width / 2, ctx.canvas.height / 2);
            return;
        }

        const labels = data.map(item => item.date);
        const counts = data.map(item => item.count);

        timeChart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Discovered Vulnerability',
                    data: counts,
                    fill: false,
                    borderColor: chartColors.line,
                    tension: 0.1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: true,
                        labels: {
                            color: chartColors.text
                        }
                    },
                    tooltip: {
                        mode: 'index',
                        intersect: false,
                    },
                    title: {
                        display: false,
                    }
                },
                scales: {
                    x: {
                        title: {
                            display: true,
                            text: 'Data',
                            color: chartColors.text
                        },
                        ticks: {
                            color: chartColors.text
                        },
                        grid: {
                            color: chartColors.gridLines
                        }
                    },
                    y: {
                        beginAtZero: true,
                        title: {
                            display: true,
                            text: 'Vulnerability Number',
                            color: chartColors.text
                        },
                        ticks: {
                            color: chartColors.text
                        },
                        grid: {
                            color: chartColors.gridLines
                        }
                    }
                }
            }
        });

    } catch (error) {
        console.error("Errore nel recupero dei dati mock per il grafico temporale:", error);
        const ctx = document.getElementById('time-chart-canvas').getContext('2d');
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        ctx.font = "16px Arial";
        ctx.fillStyle = chartColors.text;
        ctx.textAlign = "center";
        ctx.fillText("Errore nel caricamento del grafico temporale mock.", ctx.canvas.width / 2, ctx.canvas.height / 2);
    }
}


// Funzione principale per caricare e renderizzare tutti i dati
async function loadDashboardData(officeId = null) {
    currentOfficeId = officeId;

    const kpiSummary = await fetchKpiSummary(officeId);
    if (kpiSummary) {
        renderKpis(kpiSummary);
        renderSeverityChart(kpiSummary.vulnerabilitiesBySeverity); 
        renderServersChart(kpiSummary.vulnerabilitiesPerServerBreakdown);
    } else {
        renderKpis(null);
        renderSeverityChart(null);
        renderServersChart(null);
    }
    await renderTimeChart(officeId);
}


// Event Listener per il caricamento del DOM
document.addEventListener('DOMContentLoaded', async () => {
    officeSelect = document.getElementById('office-select');
    kpiTitleElement = document.getElementById('kpi-title');
    vizTitleElement = document.getElementById('viz-title');
    kpiGridElement = document.getElementById('kpi-grid');
    chartsGridElement = document.querySelector('.charts-grid');
    showVulnerabilitiesTableBtn = document.getElementById('show-vulnerabilities-table-btn');
    showAssetsTableBtn = document.getElementById('show-assets-table-btn');
    modalOfficeLabel = document.getElementById('modal-office-label');
    modalAssetOfficeLabel = document.getElementById('modal-asset-office-label');

    const vulnerabilitiesTableModal = new bootstrap.Modal(document.getElementById('vulnerabilitiesTableModal'));
    const assetsTableModal = new bootstrap.Modal(document.getElementById('assetsTableModal'));

    // Popola il selettore degli uffici (USA MOCK DATA)
    const officeIds = await fetchOfficeIds();
    officeIds.forEach(id => {
        const option = document.createElement('option');
        option.value = id;
        option.textContent = id;
        officeSelect.appendChild(option);
    });

    // Carica i dati iniziali della dashboard (globali)
    await loadDashboardData();

    // Listener per il cambio del selettore ufficio
    officeSelect.addEventListener('change', async () => {
        const selectedOfficeId = officeSelect.value;
        
        if (selectedOfficeId) {
            kpiTitleElement.textContent = `Indicatori Chiave di Performance (${selectedOfficeId})`;
            vizTitleElement.textContent = `Visualizzazioni Grafiche (${selectedOfficeId})`;
        } else {
            kpiTitleElement.textContent = `Indicatori Chiave di Performance (Global)`;
            vizTitleElement.textContent = `Visualizzazioni Grafiche (Global)`;
        }
        await loadDashboardData(selectedOfficeId === "" ? null : selectedOfficeId);
    });

    // Listener per il pulsante "Mostra Tutte le Vulnerabilità" (USA MOCK DATA)
    showVulnerabilitiesTableBtn.addEventListener('click', async () => {
        const selectedOfficeId = officeSelect.value;
        const data = await mockFetchData('vulnerabilitiesAll', selectedOfficeId === "" ? null : selectedOfficeId);

        if (selectedOfficeId) {
            modalOfficeLabel.textContent = selectedOfficeId;
        } else {
            modalOfficeLabel.textContent = 'Global';
        }

        try {
            if ($.fn.DataTable.isDataTable('#vulnerabilities-datatable')) {
                vulnerabilitiesDataTable.destroy();
                $('#vulnerabilities-datatable').empty(); 
            }

            vulnerabilitiesDataTable = $('#vulnerabilities-datatable').DataTable({
                data: data,
                columns: [
                    { data: 'vulnerability_id', title: 'ID Vulnerabilità' },
                    { data: 'cve_id', title: 'CVE ID' },
                    { data: 'server_id', title: 'Server ID' },
                    { data: 'office_id', title: 'Office ID' },
                    { data: 'severity', title: 'Gravità' },
                    { data: 'os_type', title: 'OS Tipo' },
                    { data: 'is_eol_os', title: 'OS EOL', render: function(data, type, row) { return data ? 'Yes' : 'No'; } },
                    { data: 'component_name', title: 'Componente' },
                    { data: 'is_eol_component', title: 'Comp. EOL', render: function(data, type, row) { return data ? 'Yes' : 'No'; } },
                    { data: 'discovery_date', title: 'Data Scoperta' },
                    { 
                        data: 'sla_status', 
                        title: 'Stato SLA', 
                        render: function(data, type, row) {
                            if (type === 'display') {
                                if (data === 'In SLA') {
                                    return `<span class="text-success fw-bold">${data}</span>`;
                                } else if (data === 'Fuori SLA') {
                                    return `<span class="text-danger fw-bold">${data}</span>`;
                                }
                            }
                            return data;
                        }
                    }
                ],
                responsive: true,
                language: {
                    url: 'https://cdn.datatables.net/plug-ins/2.0.8/i18n/it-IT.json'
                },
                paging: true,
                lengthChange: true,
                searching: true,
                ordering: true,
                info: true,
            });

            vulnerabilitiesTableModal.show();

        } catch (error) {
            console.error("Errore nel recupero o nell'inizializzazione della tabella delle vulnerabilità mock:", error);
            alert("Impossibile caricare i dati delle vulnerabilità mock. Controlla la console per i dettagli.");
        }
    });

    // Listener per il nuovo pulsante "Mostra Tutti gli Asset" (USA MOCK DATA)
    showAssetsTableBtn.addEventListener('click', async () => {
        const selectedOfficeId = officeSelect.value;
        const data = await fetchAssets(selectedOfficeId === "" ? null : selectedOfficeId);

        if (selectedOfficeId) {
            modalAssetOfficeLabel.textContent = selectedOfficeId;
        } else {
            modalAssetOfficeLabel.textContent = 'Global';
        }

        try {
            if ($.fn.DataTable.isDataTable('#assets-datatable')) {
                assetsDataTable.destroy();
                $('#assets-datatable').empty();
            }

            assetsDataTable = $('#assets-datatable').DataTable({
                data: data,
                columns: [
                    { data: 'server_id', title: 'Server ID' },
                    { data: 'office_id', title: 'Office ID' },
                    { data: 'os_type', title: 'OS Type' },
                    { data: 'is_eol_os', title: 'OS EOL', render: function(data, type, row) { return data ? 'Yes' : 'No'; } }
                ],
                responsive: true,
                language: {
                    url: 'https://cdn.datatables.net/plug-ins/2.0.8/i18n/it-IT.json'
                },
                paging: true,
                lengthChange: true,
                searching: true,
                ordering: true,
                info: true,
            });

            assetsTableModal.show();

        } catch (error) {
            console.error("Errore nel recupero o nell'inizializzazione della tabella degli asset mock:", error);
            alert("Impossibile caricare i dati degli asset mock. Controlla la console per i dettagli.");
        }
    });
});