import os
import re
from pathlib import Path

# Pfade definieren (anpassen falls deine Ordnerstruktur abweicht)
BASE_DIR = Path(__file__).resolve().parent
JS_DIR = BASE_DIR / "frontend" / "static" / "js"
ENTRY_POINT = JS_DIR / "app.js"

def get_imports(file_path):
    """Liest eine Datei und extrahiert alle lokalen JS-Imports."""
    if not file_path.exists():
        return set()

    imports = set()
    # Regulärer Ausdruck für: import ... from './dateiname.js' oder import './dateiname.js'
    pattern = re.compile(r'import\s+.*?\s+from\s+[\'"](?:\./)?(.*?)[\'"]|import\s+[\'"](?:\./)?(.*?)[\'"]')

    try:
        with open(file_path, "r", encoding="utf-8") as f:
            content = f.read()
            for match in pattern.findall(content):
                # match ist ein Tupel aus (from_import, direct_import)
                imp = match[0] or match[1]
                if imp:
                    # Sicherstellen, dass die Endung .js vorhanden ist
                    if not imp.endswith('.js'):
                        imp += '.js'
                    imports.add(imp)
    except Exception as e:
        print(f"Fehler beim Lesen von {file_path.name}: {e}")

    return imports

def build_dependency_tree(entry_file):
    """Verfolgt rekursiv alle Imports ab dem Einstiegspunkt."""
    used_files = {entry_file.name}
    queue = [entry_file]

    while queue:
        current_file = queue.pop(0)
        current_imports = get_imports(current_file)

        for imp in current_imports:
            if imp not in used_files:
                used_files.add(imp)
                next_file = JS_DIR / imp
                if next_file.exists():
                    queue.append(next_file)

    return used_files

def main():
    if not ENTRY_POINT.exists():
        print(f"❌ Einstiegspunkt nicht gefunden unter: {ENTRY_POINT}")
        return

    # 1. Alle tatsächlich existierenden JS-Dateien im Ordner finden
    all_js_files = {f.name for f in JS_DIR.glob("*.js")}

    # 2. Alle genutzten JS-Dateien über den Import-Baum ermitteln
    used_js_files = build_dependency_tree(ENTRY_POINT)

    # 3. Differenz berechnen (Verwaiste Dateien)
    orphaned_files = all_js_files - used_js_files

    print("=== JS-DATEI ANALYSE ===")
    print(f"Gefundene JS-Dateien insgesamt: {len(all_js_files)}")
    print(f"Aktiv genutzte JS-Dateien:     {len(used_js_files)}")
    print(f"Verwaiste JS-Dateien:          {len(orphaned_files)}\n")

    if orphaned_files:
        print("🗑️  Diese Dateien werden NIRGENDS importiert und können gelöscht werden:")
        for file in sorted(orphaned_files):
            print(f"  - frontend/static/js/{file}")
    else:
        print("✅ Alles sauber! Es wurden keine verwaisten JS-Dateien gefunden.")

if __name__ == "__main__":
    main()
