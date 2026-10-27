# 🩺 AI-Powered Medical Symptom Assistant using GPT-4

> **Course:** 24CS2506 – Building Applications using GPT-4  
> **Experiment:** 06  
> **Triage Engine:** GPT-4 & Local Zero-Data Heuristic Clinical Engine  
> **Interface:** Modern High-Contrast Medical-Tech Dashboard (100% Offline Capable)

[![Python 3.11+](https://img.shields.io/badge/Python-3.11%2B-blue.svg)](https://www.python.org/)
[![Node.js 18+](https://img.shields.io/badge/Node.js-18%2B-green.svg)](https://nodejs.org/)
[![Zero Mobile Data](https://img.shields.io/badge/Network-0%20Mobile%20Data%20Offline-teal.svg)](#)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

---

## 🌟 Overview

**MediSense AI** is an AI-powered medical symptom assistant built using GPT-4 and client-side clinical NLP techniques. The application analyzes user-reported natural language symptoms, identifies possible associated conditions (differential possibilities), generates relevant clinical follow-up questions, assesses urgency levels (Emergency, Urgent, Routine), and provides general guidance regarding professional medical attention with strict safety guardrails.

### 🛡️ Safety & Medical Guardrails
- **Informational AI Only:** Does **NOT** issue definitive clinical diagnoses or prescriptions.
- **Uncertainty Communication:** Expresses clinical possibilities (e.g., *"Possible conditions to evaluate with a physician..."*).
- **Emergency Red-Flag Interceptor:** Detects acute, life-threatening symptoms (e.g., crushing chest pain, acute dyspnea, cyanosis) and directs the user to emergency services (911 / 112).
- **Zero Mobile Data Consumption:** Operates completely offline with zero external CDNs, downloads, or external network calls required.

---

## 🏗️ System Architecture Workflow

```
+---------------------------------------------------------------------------------------------------+
|                        AI-POWERED MEDICAL SYMPTOM ASSISTANT (GPT-4)                               |
+---------------------------------------------------------------------------------------------------+
  [1. User / Patient Input]  -->  [2. Patient Profile Module]  -->  [3. Symptom Extraction (NLP)]
  (Age, Sex, Symptoms, Severity)   (ID, Cohort, Baseline History)     (Normalized Clinical Entities)
                                                                                  |
                                                                                  v
  [6. GPT-4 / Clinical AI Engine] <-- [5. Prompt Generation Module] <-- [4. Context & Risk Analysis]
  (Differential Reasoning & Triage)   (Role, Guardrails & JSON Schema)  (Comorbidity & Vulnerability)
                |
                v
  +-------------------------------+-------------------------------+---------------------------------+
  | 7. Possible Conditions        | 8. Follow-up Questions        | 9. Safety & Triage Guidance     |
  | (Ranked Differential Matches) | (Targeted Clinical Screening) | (Emergency Interceptor & Advice)|
  +-------------------------------+-------------------------------+---------------------------------+
                                                  |
                                                  v
                                      [10. Save & Export Module]
                                  (JSON, Markdown & Medical Report)
```

---

## 📦 Module Design

| Module | Responsibility |
| :--- | :--- |
| **1. Input Module** | Collects patient demographics, reported symptoms, duration, severity, and health background via interactive Web UI and terminal CLI. |
| **2. Profile Module** | Validates, sanitizes, and structures the patient intake record with unique Patient ID, timestamp, and age cohort assignment. |
| **3. Symptom Module** | Parses natural language symptom text, normalizes clinical terminology, and maps symptoms to physiological organ systems using NLP. |
| **4. Context Module** | Evaluates comorbidity interactions, age-cohort modifiers, and drug allergies, computing a standardized vulnerability risk score (1–5). |
| **5. Prompt Module** | Synthesizes clinical GPT-4 prompts with system role definitions, strict non-diagnostic guardrails, and structured JSON output schemas. |
| **6. Analysis Module** | Evaluates differential condition possibilities, physiological rationales, and likelihoods via clinical AI reasoning. |
| **7. Question Module** | Formulates targeted clinical follow-up questions to clarify red-flag symptoms, disease progression, and fever peaks. |
| **8. Safety Module** | Detects emergency red-flag symptoms, assigns clinical triage urgency levels (Emergency, Urgent, Routine), and embeds safety disclaimers. |
| **9. Save Module** | Serializes, formats, and persists complete clinical analysis reports into structured JSON, Markdown, and printable PDF documents. |
| **10. Main Module** | Coordinates the end-to-end 10-module execution pipeline, managing application state, event handlers, and interface rendering. |

---

## 🚀 Getting Started

### Option 1: Web Interface (Recommended)
You can launch the web application in any of two ways:

1. **Using Node.js Local Server (Zero external dependencies):**
   ```bash
   node server.js
   ```
   Open your browser at `http://localhost:3001`

2. **Direct Browser Execution:**
   Double-click `index.html` directly in Google Chrome, Microsoft Edge, or Firefox. It runs 100% offline with zero data consumption!

### Option 2: Python CLI & Batch Pipeline
Run the Python terminal assistant (uses standard library modules):
```bash
# High-fidelity sample demonstration
python symptom_assistant.py

# Interactive patient intake CLI
python symptom_assistant.py --interactive
```

---

## 🎯 Clinical Test Presets Included

The web application includes 5 pre-loaded clinical scenarios accessible with a single click:
1. **Acute Upper Respiratory Infection:** (Fever, sore throat, cough, fatigue - 2 days)
2. **Acute Migraine Episode with Aura:** (Unilateral throbbing headache, photophobia, nausea)
3. **Acute Viral Gastroenteritis:** (Nausea, watery diarrhea, abdominal cramping)
4. **Seasonal Allergic Rhinitis:** (Sneezing, itchy eyes, clear rhinorrhea, congestion)
5. **🚨 Emergency Cardiac Triage:** (Crushing chest pain radiating to jaw and left arm, shortness of breath, cold sweat - triggers immediate Red-Flag Emergency Banner)

---

## ⚠️ Official Medical & Legal Safety Disclaimer

> **NOT A MEDICAL DIAGNOSIS:**  
> This artificial intelligence application is designed strictly for educational, informational, and triage demonstration purposes. It does not provide medical diagnoses, treatment plans, or clinical prescriptions. Medical conditions and severe symptoms require personal evaluation and diagnostic testing by a licensed physician or healthcare professional. If you are experiencing a life-threatening emergency, call **911 / 112** or go to the nearest emergency medical facility immediately.
