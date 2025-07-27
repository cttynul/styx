// script.js

const API_BASE_URL = 'http://127.0.0.1:8000'; // Modificato per puntare alla base, non solo /vulnerabilities

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
let showAssetsTableBtn = null; // Nuovo riferimento per il pulsante asset
let modalOfficeLabel = null;
let modalAssetOfficeLabel = null; // Nuovo riferimento per la label dell'ufficio nel modale asset


// Variabili per i grafici Chart.js (inizializzate a null e distrutte/ricreate)
let severityChart = null;
let serversChart = null;
let timeChart = null;

// Variabili per le tabelle DataTables (istanze)
let vulnerabilitiesDataTable = null;
let assetsDataTable = null; // Nuova variabile per l'istanza della tabella asset

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
        High: '#fd7e14',      // Aranciere (per High)
        Medium: '#ffc107',    // Giallo scuro (per Medium)
        Low: '#17a2b8'        // Blu-verde (per Low)
    },
    line: '#6f42c1'           // Viola per le linee di trend
};

// --- Funzioni di Utility per le Chiamate API ---
async function fetchData(url) {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
        }
        return await response.json();
    } catch (error) {
        console.error('Errore durante il recupero dati:', error);
        throw error;
    }
}


// Funzione per il caricamento dei dati KPI
async function fetchKpiSummary(officeId = null) {
    let url = `${API_BASE_URL}/vulnerabilities/kpis/summary`; // Percorso completo per le vulnerabilità
    if (officeId) {
        url = `${API_BASE_URL}/vulnerabilities/kpis/summary_by_office/${officeId}`;
    }
    try {
        return await fetchData(url);
    } catch (error) {
        console.error("Errore nel recupero dei KPI:", error);
        alert("Impossibile caricare i dati dei KPI. Controlla la console per i dettagli.");
        return null;
    }
}

// Funzione per il caricamento degli ID degli uffici (dagli asset)
async function fetchOfficeIds() {
    try {
        // Ora gli uffici sono recuperati da /vulnerabilities/offices
        return await fetchData(`${API_BASE_URL}/vulnerabilities/offices`); 
    } catch (error) {
        console.error("Errore nel recupero degli ID degli uffici:", error);
        return [];
    }
}

// Funzione per il recupero dei dati degli asset (nuova)
async function fetchAssets(officeId = null) {
    let url = `${API_BASE_URL}/assets`; // Endpoint per tutti gli asset
    if (officeId) {
        url = `${API_BASE_URL}/assets/by_office/${officeId}`; // Endpoint per asset filtrati
    }
    try {
        return await fetchData(url);
    } catch (error) {
        console.error("Errore nel recupero degli asset:", error);
        alert("Impossibile caricare i dati degli asset. Controlla la console per i dettagli.");
        return [];
    }
}


// Funzione per il rendering dei KPI
function renderKpis(kpiData) {
    if (!kpiData) {
        kpiGridElement.innerHTML = '<div class="col-12 text-center text-muted">Dati KPI non disponibili.</div>';
        // Rimuovi anche i riferimenti agli elementi specifici
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

    // Assicurati che i riferimenti agli elementi siano aggiornati (essenziale dopo un potenziale ricaricamento del DOM o manipolazione)
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

    // Gestione dell'indicatore di salute
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


// Funzione per il rendering del grafico delle vulnerabilitÃ  per gravitÃ 
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
        ctx.fillText("Nessun dato disponibile per il grafico di gravitÃ .", ctx.canvas.width / 2, ctx.canvas.height / 2);
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

// Funzione per il rendering del grafico dei server piÃ¹ vulnerabili
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
                label: 'Numero di VulnerabilitÃ ',
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
                        text: 'VulnerabilitÃ ',
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

// Funzione per il rendering del grafico dell'andamento nel tempo
async function renderTimeChart(officeId = null) {
    const ctx = document.getElementById('time-chart-canvas').getContext('2d');

    if (timeChart) {
        timeChart.destroy();
        timeChart = null;
    }

    let url = `${API_BASE_URL}/vulnerabilities/kpis/over_time`; // Percorso completo
    if (officeId) {
        url = `${API_BASE_URL}/vulnerabilities/kpis/over_time_by_office/${officeId}`;
    }

    try {
        const data = await fetchData(url);

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
        console.error("Errore nel recupero dei dati per il grafico temporale:", error);
        const ctx = document.getElementById('time-chart-canvas').getContext('2d');
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        ctx.font = "16px Arial";
        ctx.fillStyle = chartColors.text;
        ctx.textAlign = "center";
        ctx.fillText("Errore nel caricamento del grafico temporale.", ctx.canvas.width / 2, ctx.canvas.height / 2);
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
    // Inizializza i riferimenti agli elementi HTML dopo che il DOM è pronto
    officeSelect = document.getElementById('office-select');
    kpiTitleElement = document.getElementById('kpi-title');
    vizTitleElement = document.getElementById('viz-title');
    kpiGridElement = document.getElementById('kpi-grid');
    chartsGridElement = document.querySelector('.charts-grid');
    showVulnerabilitiesTableBtn = document.getElementById('show-vulnerabilities-table-btn');
    showAssetsTableBtn = document.getElementById('show-assets-table-btn'); // Nuovo riferimento
    modalOfficeLabel = document.getElementById('modal-office-label');
    modalAssetOfficeLabel = document.getElementById('modal-asset-office-label'); // Nuovo riferimento

    const vulnerabilitiesTableModal = new bootstrap.Modal(document.getElementById('vulnerabilitiesTableModal'));
    const assetsTableModal = new bootstrap.Modal(document.getElementById('assetsTableModal')); // Nuovo modale

    // Popola il selettore degli uffici
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

    // Listener per il pulsante "Mostra Tutte le VulnerabilitÃ "
    showVulnerabilitiesTableBtn.addEventListener('click', async () => {
        const selectedOfficeId = officeSelect.value;
        let apiUrl = `${API_BASE_URL}/vulnerabilities/all_for_table`; // Percorso completo
        if (selectedOfficeId) {
            apiUrl += `/${selectedOfficeId}`;
            modalOfficeLabel.textContent = selectedOfficeId;
        } else {
            modalOfficeLabel.textContent = 'Global';
        }

        try {
            const data = await fetchData(apiUrl);

            // Distruggi la tabella esistente se giÃ  inizializzata
            if ($.fn.DataTable.isDataTable('#vulnerabilities-datatable')) {
                vulnerabilitiesDataTable.destroy();
                $('#vulnerabilities-datatable').empty(); 
            }

            // Inizializza la tabella DataTables con i dati e le opzioni
            vulnerabilitiesDataTable = $('#vulnerabilities-datatable').DataTable({
                data: data,
                columns: [
                    { data: 'vulnerability_id', title: 'ID VulnerabilitÃ ' },
                    { data: 'cve_id', title: 'CVE ID' },
                    { data: 'server_id', title: 'Server ID' },
                    { data: 'office_id', title: 'Office ID' },
                    { data: 'severity', title: 'GravitÃ ' },
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
            console.error("Errore nel recupero o nell'inizializzazione della tabella delle vulnerabilitÃ :", error);
            alert("Impossibile caricare i dati delle vulnerabilitÃ . Controlla la console per i dettagli.");
        }
    });

    // Listener per il nuovo pulsante "Mostra Tutti gli Asset"
    showAssetsTableBtn.addEventListener('click', async () => {
        const selectedOfficeId = officeSelect.value;
        let apiUrl = `${API_BASE_URL}/assets`; // Endpoint di base per gli asset
        if (selectedOfficeId) {
            apiUrl += `/by_office/${selectedOfficeId}`; // Endpoint filtrato per ufficio
            modalAssetOfficeLabel.textContent = selectedOfficeId; // Aggiorna la label del modale
        } else {
            modalAssetOfficeLabel.textContent = 'Global'; // Aggiorna la label del modale
        }

        try {
            const data = await fetchAssets(selectedOfficeId === "" ? null : selectedOfficeId);

            // Distruggi la tabella esistente se già inizializzata
            if ($.fn.DataTable.isDataTable('#assets-datatable')) {
                assetsDataTable.destroy();
                // Assicurati di svuotare il tbody prima di ricaricare i dati
                $('#assets-datatable').empty();
            }

            // Inizializza la tabella DataTables con i dati e le opzioni per gli asset
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

            assetsTableModal.show(); // Mostra il nuovo modale

        } catch (error) {
            console.error("Errore nel recupero o nell'inizializzazione della tabella degli asset:", error);
            alert("Impossibile caricare i dati degli asset. Controlla la console per i dettagli.");
        }
    });
});