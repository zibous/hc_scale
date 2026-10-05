# Klemera-Doubal-Methode (KDM) – Zusammenfassung

## Was ist KDM?
Statistischer Algorithmus zur Schätzung des **biologischen Alters** aus klinischen Biomarkern. Entwickelt von Klemera & Doubal (2006).

## Kernprinzip
- Reverse Regression: Biomarker werden auf chronologisches Alter regressiert (nicht umgekehrt)
- Minimiert quadrierte Abstände zwischen Regressionslinien und Biomarker-Werten
- Reduziert Fehlerpropagation und Multikollinearität

## Standard-Biomarker-Panel (NHANES-basiert)
| Biomarker | Bedeutung |
|-----------|-----------|
| albumin | Albumin (Blutprotein) |
| alp | Alkalische Phosphatase (Leber) |
| lncrp | Log-CRP (Entzündung) |
| totchol | Gesamtkolesterol |
| lncreat | Log-Kreatinin (Niere) |
| hba1c | Hämoglobin A1c (Glukose) |
| sbp | Systolischer Blutdruck |
| bun | Blutharnstoffstickstoff |
| uap | Harnsäure |
| lymph | Lymphozyten (Immun) |
| mcv | MCV (Hämatologie) |
| wbc | Leukozyten (Immun) |

## Berechnungsparameter (pro Biomarker)
- **gᵢ** = Achsenabschnitt (Intercept)
- **hᵢ** = Steigung (Slope)
- **sᵢ** = RMSE der Regression
- **sD²** = Varianz des chronologischen Alters

## Grundformel
BA = Σ[(xi - gi)/hi] / Σ[1/hi² × (si² + sD²)]


## Validierung
- Levine (2013): 9.389 Teilnehmer, 18 Jahre Follow-up
- AUC: 0,851 (vs. 0,827 bei chron. Alter allein)
- Hazard Ratio: 1,09 pro Jahr biologischer Alterung
- Gilt als zuverlässigste Methode für biologisches Alter

## Verfügbarkeit
- **R-Package**: BioAge (Kwon & Belsky, 2021)
- GitHub: https://github.com/dayoonkwon/BioAge
- Geschlechtsspezifische Modelle (männlich/weiblich)

## Anwendungsbereiche
✓ Mortalitätsvorhersage
✓ Interventionsstudien (Kalorienrestriktion, Ernährung)
✓ Bevölkerungsvergleiche
✓ Forschung zu Alternsprozessen

## Limitationen
- Kein einheitliches Biomarker-Panel über Studien hinweg
- Laborwerte erforderlich (keine Consumer-Geräte)
- Neueste ML-Uhren übertreffen KDM in Mortalitätstests
- Nach wie vor goldener Benchmark für Vergleichbarkeit

## Unterschied zu "Metabolischem Alter"
| Merkmal | KDM | Metabolisches Alter (InBody o.ä.) |
|---------|-----|-----------------------------------|
| Daten | Laborblutwerte | Körperimpedanz, Größe, Gewicht |
| Validierung | Hoch (wissenschaftlich) | Begrenzt |
| Anwendung | Forschung | Consumer-Fitness |
| Biomarker | 7-13 klinische Werte | 3-4 physikalische Parameter |

---
*Letzte Aktualisierung: 2026 | Quellen: Longevity Germany, PMC/NIH, GeroScience 43 (2021)*

## Praktische Berechnungsmöglichkeiten

R-Package "BioAge" (empfohlen)

# Installation und Nutzung
library(BioAge)
# Daten aus NHANES oder eigenen klinischen Daten
kdm_result <- kdm_calculate(biomarker_data, chronological_age, sex)

GitHub: https://github.com/dayoonkwon/BioAge
