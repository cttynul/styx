# generate_csv.py

import csv
import random
from datetime import datetime, timedelta
import os

DATA_DIR = os.path.join(os.path.dirname(__file__), "data")

# Assicurati che la cartella 'data' esista
# Se non esiste, la crea.
os.makedirs(DATA_DIR, exist_ok=True)

CSV_VULNERABILITIES_FILE_NAME = "vulnerabilities.csv"
CSV_ASSETS_FILE_NAME = "assets.csv"

# Modifica i percorsi completi dei file CSV per includere DATA_DIR
CSV_VULNERABILITIES_FILE_PATH = os.path.join(DATA_DIR, CSV_VULNERABILITIES_FILE_NAME)
CSV_ASSETS_FILE_PATH = os.path.join(DATA_DIR, CSV_ASSETS_FILE_NAME)


def generate_asset_data(num_servers: int = 70, num_offices: int = 4):
    assets_data = []
    office_ids = [f"Office-{chr(65 + i)}" for i in range(num_offices)]
    os_types_and_eol = [
        {"name": "Linux", "is_eol": False},
        {"name": "Windows Server 2019", "is_eol": False},
        {"name": "CentOS 7", "is_eol": True},
        {"name": "Ubuntu 20.04", "is_eol": False},
        {"name": "Windows Server 2016", "is_eol": True},
        {"name": "Debian 9", "is_eol": True},
        {"name": "Windows Server 2022", "is_eol": False},
        {"name": "RedHat Enterprise Linux 8", "is_eol": False},
    ]

    for i in range(1, num_servers + 1):
        server_id = f"SERVER-{i:03d}"
        office_id = random.choice(office_ids)
        
        chosen_os_info = random.choice(os_types_and_eol)
        if random.random() < 0.3:
            eol_oss = [os for os in os_types_and_eol if os["is_eol"] is True]
            if eol_oss:
                chosen_os_info = random.choice(eol_oss)
        
        assets_data.append({
            "server_id": server_id,
            "office_id": office_id,
            "os_type": chosen_os_info["name"],
            "is_eol_os": "TRUE" if chosen_os_info["is_eol"] else "FALSE"
        })
    return assets_data

def generate_large_simulated_vulnerability_data(
    assets_data: list,
    num_vulnerabilities: int = 1500,
    percentage_servers_with_no_vulnerabilities: float = 0.15
):
    vulnerabilities_data = []
    severities = ["Critical", "High", "Medium", "Low"]
    components = {
        "Apache HTTP Server": False, "nginx": False, "OpenSSL": False,
        "MySQL": False, "Struts 2": True, "IIS": False, "PHP 5.6": True,
        "Tomcat": False, "PostgreSQL": False, "Redis": False,
        "Spring Framework": False, "JBoss": True, "Node.js": False,
        "Python 2.7": True, "OpenSSH": False
    }
    cve_years = [2021, 2022, 2023, 2024, 2025]

    start_date = datetime.now() - timedelta(days=730)

    all_server_ids = [asset["server_id"] for asset in assets_data]
    num_servers_to_exclude = int(len(all_server_ids) * percentage_servers_with_no_vulnerabilities)
    servers_to_exclude = random.sample(all_server_ids, num_servers_to_exclude)
    
    eligible_assets = [asset for asset in assets_data if asset["server_id"] not in servers_to_exclude]

    if not eligible_assets:
        print("Warning: All servers are excluded from having vulnerabilities. No vulnerabilities will be generated.")
        return []

    assets_map = {asset["server_id"]: asset for asset in assets_data}

    for i in range(num_vulnerabilities):
        chosen_asset = random.choice(eligible_assets)
        server_id = chosen_asset["server_id"]
        office_id = chosen_asset["office_id"]
        os_type = chosen_asset["os_type"]
        is_eol_os = chosen_asset["is_eol_os"]

        severity = random.choices(severities, weights=[0.15, 0.35, 0.30, 0.20], k=1)[0]
        
        component_name_val, is_eol_component_val = random.choice(list(components.items()))
        if random.random() < 0.35:
            eol_components_list = [(k,v) for k,v in components.items() if v is True]
            if eol_components_list:
                component_name_val, is_eol_component_val = random.choice(eol_components_list)

        cve_year = random.choice(cve_years)
        
        discovery_date = (start_date + timedelta(days=random.randint(0, 730))).strftime("%Y-%m-%d")

        vulnerabilities_data.append({
            "vulnerability_id": f"VULN-{i+1:05d}",
            "cve_id": f"CVE-{cve_year}-{random.randint(1000, 99999)}",
            "server_id": server_id,
            "office_id": office_id,
            "severity": severity,
            "os_type": os_type,
            "is_eol_os": is_eol_os,
            "component_name": component_name_val,
            "is_eol_component": "TRUE" if is_eol_component_val else "FALSE",
            "discovery_date": discovery_date
        })
    return vulnerabilities_data

def write_data_to_csv(data: list, file_path: str, fieldnames: list):
    if not data:
        print(f"No data to write to {file_path}.")
        return

    with open(file_path, mode='w', newline='', encoding='utf-8') as csvfile:
        writer = csv.DictWriter(csvfile, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(data)
    print(f"Successfully generated {len(data)} records to {file_path}")

if __name__ == "__main__":
    print("Generating simulated asset data...")
    num_servers_to_generate = 70
    generated_assets = generate_asset_data(num_servers_to_generate)
    asset_fieldnames = ["server_id", "office_id", "os_type", "is_eol_os"]
    # Utilizza il nuovo percorso del file
    write_data_to_csv(generated_assets, CSV_ASSETS_FILE_PATH, asset_fieldnames)
    print("Asset CSV generation complete.")

    print("\nGenerating simulated vulnerability data based on assets...")
    num_vulnerabilities_to_generate = 1500
    percentage_no_vulnerabilities = 0.15 
    simulated_vulnerabilities = generate_large_simulated_vulnerability_data(
        generated_assets,
        num_vulnerabilities_to_generate,
        percentage_no_vulnerabilities
    )
    vulnerability_fieldnames = [
        "vulnerability_id", "cve_id", "server_id", "office_id", "severity",
        "os_type", "is_eol_os", "component_name", "is_eol_component", "discovery_date"
    ]
    # Utilizza il nuovo percorso del file
    write_data_to_csv(simulated_vulnerabilities, CSV_VULNERABILITIES_FILE_PATH, vulnerability_fieldnames)
    print("Vulnerability CSV generation complete.")