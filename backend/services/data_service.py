# services/data_service.py

import csv
from typing import List, Dict, Set, Optional
import os
from datetime import datetime, timedelta
from models.vulnerability_model import Vulnerability
from models.asset_model import Asset

CSV_VULNERABILITIES_FILE_PATH = os.path.join(os.path.dirname(os.path.dirname(__file__)), "data", "vulnerabilities.csv")
CSV_ASSETS_FILE_PATH = os.path.join(os.path.dirname(os.path.dirname(__file__)), "data", "assets.csv")

class DataService:
    def __init__(self):
        self._assets: List[Asset] = self._load_assets_from_csv()
        self._vulnerabilities: List[Vulnerability] = self._load_vulnerabilities_from_csv()
        # Mappa server_id agli asset per un accesso più rapido
        self._assets_map: Dict[str, Asset] = {asset.server_id: asset for asset in self._assets}


    def _load_assets_from_csv(self) -> List[Asset]:
        loaded_assets = []
        try:
            with open(CSV_ASSETS_FILE_PATH, mode='r', encoding='utf-8') as csvfile:
                reader = csv.DictReader(csvfile)
                for row in reader:
                    is_eol_os_val = row.get('is_eol_os', 'FALSE').upper() == 'TRUE'
                    try:
                        asset = Asset(
                            server_id=row['server_id'],
                            office_id=row['office_id'],
                            os_type=row['os_type'],
                            is_eol_os=is_eol_os_val
                        )
                        loaded_assets.append(asset)
                    except Exception as e:
                        print(f"Error parsing asset row: {row}. Error: {e}")
                        pass
        except FileNotFoundError:
            print(f"Error: CSV asset file not found at {CSV_ASSETS_FILE_PATH}. Please run generate_csv.py first.")
        except Exception as e:
            print(f"An unexpected error occurred while reading asset CSV: {e}")
            
        return loaded_assets


    def _load_vulnerabilities_from_csv(self) -> List[Vulnerability]:
        loaded_data = []
        try:
            with open(CSV_VULNERABILITIES_FILE_PATH, mode='r', encoding='utf-8') as csvfile:
                reader = csv.DictReader(csvfile)
                for row in reader:
                    is_eol_os_val = row.get('is_eol_os', 'FALSE').upper() == 'TRUE'
                    is_eol_component_val = row.get('is_eol_component', 'FALSE').upper() == 'TRUE'
                    
                    component_name_value = row.get('component_name')
                    if component_name_value == '' or component_name_value is None:
                        component_name_value = None

                    try:
                        vulnerability = Vulnerability(
                            vulnerability_id=row['vulnerability_id'],
                            cve_id=row['cve_id'],
                            server_id=row['server_id'],
                            office_id=row['office_id'],
                            severity=row['severity'],
                            os_type=row['os_type'],
                            is_eol_os=is_eol_os_val,
                            component_name=component_name_value,
                            is_eol_component=is_eol_component_val,
                            discovery_date=row['discovery_date']
                        )
                        loaded_data.append(vulnerability)
                    except Exception as e:
                        print(f"Error parsing vulnerability row: {row}. Error: {e}")
                        pass
        except FileNotFoundError:
            print(f"Error: CSV vulnerability file not found at {CSV_VULNERABILITIES_FILE_PATH}. Please run generate_csv.py first.")
        except Exception as e:
            print(f"An unexpected error occurred while reading vulnerability CSV: {e}")
            
        return loaded_data

    def get_all_vulnerabilities(self) -> List[Vulnerability]:
        return self._vulnerabilities

    def get_all_assets(self) -> List[Asset]:
        return self._assets

    def get_asset_by_server_id(self, server_id: str) -> Optional[Asset]:
        return self._assets_map.get(server_id)

    # Nuova funzione: Ottiene il numero totale di server
    def get_total_servers(self) -> int:
        return len(self._assets)

    # Nuova funzione: Ottiene il numero totale di server per un ufficio specifico
    def get_total_servers_for_office(self, office_id: str) -> int:
        office_assets = self.get_assets_by_office(office_id)
        return len(office_assets)

    # Funzione ausiliaria per calcolare l'indicatore di salute e i KPI dettagliati
    def _calculate_detailed_kpis(self, vulnerabilities: List[Vulnerability]) -> Dict:
        today = datetime.now()
        sla_threshold = timedelta(days=15)

        critical_vulns = 0
        high_vulns = 0
        critical_out_of_sla = 0
        high_out_of_sla = 0
        
        # Inizializza i conteggi per gravità
        severity_counts = {"Critical": 0, "High": 0, "Medium": 0, "Low": 0}

        for vuln in vulnerabilities:
            discovery_date_dt = datetime.strptime(vuln.discovery_date, "%Y-%m-%d")
            is_out_of_sla = (today - discovery_date_dt) > sla_threshold

            # Aggiorna i conteggi per gravità
            severity_counts[vuln.severity] = severity_counts.get(vuln.severity, 0) + 1

            if vuln.severity == "Critical":
                critical_vulns += 1
                if is_out_of_sla:
                    critical_out_of_sla += 1
            elif vuln.severity == "High":
                high_vulns += 1
                if is_out_of_sla:
                    high_out_of_sla += 1

        # Calcolo dell'indicatore di salute
        weight_critical_out_of_sla = 10
        weight_critical_in_sla = 5
        weight_high_out_of_sla = 4
        weight_high_in_sla = 2
        weight_eol_component = 3

        total_score = (
            (critical_out_of_sla * weight_critical_out_of_sla) +
            ((critical_vulns - critical_out_of_sla) * weight_critical_in_sla) +
            (high_out_of_sla * weight_high_out_of_sla) +
            ((high_vulns - high_out_of_sla) * weight_high_in_sla)
        )
        
        eol_components_count = len(set(v.component_name for v in vulnerabilities if v.is_eol_component and v.component_name))
        total_score += (eol_components_count * weight_eol_component)

        # Normalizzazione: definisci un punteggio massimo teorico
        max_possible_score = (
            (len(vulnerabilities) * weight_critical_out_of_sla) +
            (eol_components_count * weight_eol_component)
        )
        
        if max_possible_score == 0:
            health_score_percentage = 0
        else:
            health_score_percentage = min(100, round((total_score / max_possible_score) * 100, 2))

        health_color = "green"
        if health_score_percentage >= 60:
            health_color = "red"
        elif health_score_percentage >= 40:
            health_color = "yellow"

        # Vulnerabilities per server totali
        # Qui usiamo un set di server_id unici dalle vulnerabilità per il calcolo della media
        unique_servers_with_vulns = len(set(v.server_id for v in vulnerabilities))
        vulnerabilities_per_server_total = 0
        if unique_servers_with_vulns > 0:
            vulnerabilities_per_server_total = round(len(vulnerabilities) / unique_servers_with_vulns, 2)
        
        # Conteggio vulnerabilitÃ  per server di tutti i server (anche quelli a 0)
        server_vuln_counts_all_servers = {}
        # Per questo breakdown, useremo tutti i server conosciuti dal _assets_map per il contesto globale
        for server_id in self._assets_map.keys():
            server_vuln_counts_all_servers[server_id] = 0
        for vuln in vulnerabilities:
            server_vuln_counts_all_servers[vuln.server_id] = server_vuln_counts_all_servers.get(vuln.server_id, 0) + 1
        
        # Filtra i server con 0 vulnerabilità se non vuoi mostrarli, altrimenti includili
        vuln_per_server_breakdown = [
            {"serverId": server, "vulnerabilityCount": count} 
            for server, count in server_vuln_counts_all_servers.items()
        ]
        # Ordina per il serverId
        vuln_per_server_breakdown = sorted(vuln_per_server_breakdown, key=lambda x: x["serverId"])

        return {
            "criticalVulnerabilities": critical_vulns,
            "highVulnerabilities": high_vulns,
            "criticalOutOfSLA": critical_out_of_sla,
            "highOutOfSLA": high_out_of_sla,
            "healthScorePercentage": health_score_percentage,
            "healthScoreColor": health_color,
            "vulnerabilitiesPerServerTotal": vulnerabilities_per_server_total,
            "vulnerabilitiesPerServerBreakdown": vuln_per_server_breakdown,
            "vulnerabilitiesBySeverity": severity_counts # AGGIUNTO: Conteggio per gravità
        }


    def get_kpis_summary(self) -> Dict:
        detailed_kpis = self._calculate_detailed_kpis(self._vulnerabilities)

        total_vulnerabilities = len(self._vulnerabilities)
        
        # La severity_counts ora viene gestita direttamente in _calculate_detailed_kpis
        # Non è più necessaria qui, poiché è inclusa in detailed_kpis
        # severity_counts = {}
        # for vuln in self._vulnerabilities:
        #     severity_counts[vuln.severity] = severity_counts.get(vuln.severity, 0) + 1

        unique_servers = len(set(v.server_id for v in self._vulnerabilities))

        eol_os_servers_from_assets = len(set(asset.server_id for asset in self._assets if asset.is_eol_os))

        eol_components = len(set(v.component_name for v in self._vulnerabilities if v.is_eol_component and v.component_name))

        return {
            "totalVulnerabilities": total_vulnerabilities,
            "totalServers": self.get_total_servers(), # Nuovo KPI
            "uniqueServersAffected": unique_servers,
            "serversWithEolOs": eol_os_servers_from_assets,
            "eolComponents": eol_components,
            **detailed_kpis
        }

    def get_vulnerabilities_per_server(self) -> List[Dict]:
        detailed_kpis = self._calculate_detailed_kpis(self._vulnerabilities)
        return detailed_kpis["vulnerabilitiesPerServerBreakdown"]


    def get_vulnerabilities_over_time(self) -> List[Dict]:
        date_counts = {}
        for vuln in self._vulnerabilities:
            date_counts[vuln.discovery_date] = date_counts.get(vuln.discovery_date, 0) + 1
        
        sorted_dates = sorted(date_counts.keys())
        result = [{"date": date, "count": date_counts[date]} for date in sorted_dates]
        return result

    def get_unique_office_ids(self) -> List[str]:
        return sorted(list(set(asset.office_id for asset in self._assets)))

    def get_vulnerabilities_by_office(self, office_id: str) -> List[Vulnerability]:
        return [v for v in self._vulnerabilities if v.office_id == office_id]

    # Nuovo metodo per ottenere tutte le vulnerabilitÃ  per una tabella, opzionalmente filtrate per ufficio
    def get_all_vulnerabilities_for_table(self, office_id: Optional[str] = None) -> List[Dict]:
        vulnerabilities_to_return = self._vulnerabilities
        if office_id:
            vulnerabilities_to_return = self.get_vulnerabilities_by_office(office_id)
        
        # Formatta i dati per la tabella
        formatted_vulns = []
        for vuln in vulnerabilities_to_return:
            # Calcola lo stato SLA
            today = datetime.now()
            discovery_date_dt = datetime.strptime(vuln.discovery_date, "%Y-%m-%d")
            sla_threshold = timedelta(days=15)
            is_out_of_sla = (today - discovery_date_dt) > sla_threshold
            
            sla_status = "In SLA"
            if is_out_of_sla and (vuln.severity == "Critical" or vuln.severity == "High"):
                sla_status = "Fuori SLA"
            
            formatted_vulns.append({
                "vulnerability_id": vuln.vulnerability_id,
                "cve_id": vuln.cve_id,
                "server_id": vuln.server_id,
                "office_id": vuln.office_id,
                "severity": vuln.severity,
                "os_type": vuln.os_type,
                "is_eol_os": "Yes" if vuln.is_eol_os else "No",
                "component_name": vuln.component_name if vuln.component_name else "N/A",
                "is_eol_component": "Yes" if vuln.is_eol_component else "No",
                "discovery_date": vuln.discovery_date,
                "sla_status": sla_status # Aggiungi lo stato SLA
            })
        return formatted_vulns


    def get_assets_by_office(self, office_id: str) -> List[Asset]:
        return [asset for asset in self._assets if asset.office_id == office_id]


    def get_kpis_summary_for_office(self, office_id: str) -> Dict:
        office_vulnerabilities = self.get_vulnerabilities_by_office(office_id)
        office_assets = self.get_assets_by_office(office_id)

        detailed_kpis_office = self._calculate_detailed_kpis_for_office(office_vulnerabilities, office_assets)

        total_vulnerabilities = len(office_vulnerabilities)
        
        # La severity_counts ora viene gestita direttamente in _calculate_detailed_kpis_for_office
        # Non è più necessaria qui, poiché è inclusa in detailed_kpis_office
        # severity_counts = {}
        # for vuln in office_vulnerabilities:
        #     severity_counts[vuln.severity] = severity_counts.get(vuln.severity, 0) + 1

        unique_servers = len(set(v.server_id for v in office_vulnerabilities))

        eol_os_servers = len(set(asset.server_id for asset in office_assets if asset.is_eol_os))

        eol_components = len(set(v.component_name for v in office_vulnerabilities if v.is_eol_component and v.component_name))

        return {
            "officeId": office_id,
            "totalVulnerabilities": total_vulnerabilities,
            "totalServers": self.get_total_servers_for_office(office_id), # Nuovo KPI per ufficio
            "uniqueServersAffected": unique_servers,
            "serversWithEolOs": eol_os_servers,
            "eolComponents": eol_components,
            **detailed_kpis_office
        }

    # Nuova funzione ausiliaria per calcolare l'indicatore di salute e i KPI dettagliati per un ufficio
    def _calculate_detailed_kpis_for_office(self, vulnerabilities: List[Vulnerability], assets: List[Asset]) -> Dict:
        today = datetime.now()
        sla_threshold = timedelta(days=15)

        critical_vulns = 0
        high_vulns = 0
        critical_out_of_sla = 0
        high_out_of_sla = 0
        
        # Inizializza i conteggi per gravità per l'ufficio
        severity_counts = {"Critical": 0, "High": 0, "Medium": 0, "Low": 0}
        
        for vuln in vulnerabilities:
            discovery_date_dt = datetime.strptime(vuln.discovery_date, "%Y-%m-%d")
            is_out_of_sla = (today - discovery_date_dt) > sla_threshold

            # Aggiorna i conteggi per gravità per l'ufficio
            severity_counts[vuln.severity] = severity_counts.get(vuln.severity, 0) + 1

            if vuln.severity == "Critical":
                critical_vulns += 1
                if is_out_of_sla:
                    critical_out_of_sla += 1
            elif vuln.severity == "High":
                high_vulns += 1
                if is_out_of_sla:
                    high_out_of_sla += 1

        # Calcolo dell'indicatore di salute per l'ufficio
        weight_critical_out_of_sla = 10
        weight_critical_in_sla = 5
        weight_high_out_of_sla = 4
        weight_high_in_sla = 2
        weight_eol_component = 3

        total_score = (
            (critical_out_of_sla * weight_critical_out_of_sla) +
            ((critical_vulns - critical_out_of_sla) * weight_critical_in_sla) +
            (high_out_of_sla * weight_high_out_of_sla) +
            ((high_vulns - high_out_of_sla) * weight_high_in_sla)
        )
        
        eol_components_count = len(set(v.component_name for v in vulnerabilities if v.is_eol_component and v.component_name))
        total_score += (eol_components_count * weight_eol_component)

        max_possible_score = (
            (len(vulnerabilities) * weight_critical_out_of_sla) +
            (eol_components_count * weight_eol_component)
        )

        if max_possible_score == 0:
            health_score_percentage = 0
        else:
            health_score_percentage = min(100, round((total_score / max_possible_score) * 100, 2))

        health_color = "green"
        if health_score_percentage >= 60:
            health_color = "red"
        elif health_score_percentage >= 40:
            health_color = "yellow"

        # Vulnerabilities per server totali per l'ufficio
        # Qui usiamo un set di server_id unici dalle vulnerabilità per il calcolo della media
        unique_servers_with_vulns_office = len(set(v.server_id for v in vulnerabilities))
        vulnerabilities_per_server_total = 0
        if unique_servers_with_vulns_office > 0:
            vulnerabilities_per_server_total = round(len(vulnerabilities) / unique_servers_with_vulns_office, 2)

        # Conteggio vulnerabilitÃ  per server di tutti i server dell'ufficio (anche quelli a 0)
        server_vuln_counts_all_office_servers = {}
        for asset in assets: # Qui usiamo gli asset specifici dell'ufficio
            server_vuln_counts_all_office_servers[asset.server_id] = 0
        for vuln in vulnerabilities:
            server_vuln_counts_all_office_servers[vuln.server_id] = server_vuln_counts_all_office_servers.get(vuln.server_id, 0) + 1

        vuln_per_server_breakdown = [
            {"serverId": server, "vulnerabilityCount": count} 
            for server, count in server_vuln_counts_all_office_servers.items()
        ]
        vuln_per_server_breakdown = sorted(vuln_per_server_breakdown, key=lambda x: x["serverId"])

        return {
            "criticalVulnerabilities": critical_vulns,
            "highVulnerabilities": high_vulns,
            "criticalOutOfSLA": critical_out_of_sla,
            "highOutOfSLA": high_out_of_sla,
            "healthScorePercentage": health_score_percentage,
            "healthScoreColor": health_color,
            "vulnerabilitiesPerServerTotal": vulnerabilities_per_server_total,
            "vulnerabilitiesPerServerBreakdown": vuln_per_server_breakdown,
            "vulnerabilitiesBySeverity": severity_counts # AGGIUNTO: Conteggio per gravità per l'ufficio
        }


    def get_vulnerabilities_per_server_for_office(self, office_id: str) -> List[Dict]:
        office_vulnerabilities = self.get_vulnerabilities_by_office(office_id)
        office_assets = self.get_assets_by_office(office_id)
        
        detailed_kpis_office = self._calculate_detailed_kpis_for_office(office_vulnerabilities, office_assets)
        return detailed_kpis_office["vulnerabilitiesPerServerBreakdown"]


    def get_vulnerabilities_over_time_for_office(self, office_id: str) -> List[Dict]:
        office_vulnerabilities = self.get_vulnerabilities_by_office(office_id)
        date_counts = {}
        for vuln in office_vulnerabilities:
            date_counts[vuln.discovery_date] = date_counts.get(vuln.discovery_date, 0) + 1
        
        sorted_dates = sorted(date_counts.keys())
        result = [{"date": date, "count": date_counts[date]} for date in sorted_dates]
        return result