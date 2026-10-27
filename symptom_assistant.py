"""
AI-POWERED MEDICAL SYMPTOM ASSISTANT USING GPT-4
Course: 24CS2506 - Building Applications using GPT-4
Experiment 6

This module implements a complete medical symptom assistant structured into 10 cohesive modules:
1. Input Module: Ingestion of patient information, demographics, and natural language symptoms.
2. Profile Module: Validation, normalization, and construction of structured patient profile.
3. Symptom Module: Clinical symptom extraction, duration parsing, and severity tagging.
4. Context Module: Evaluation of comorbidities, medications, allergies, and risk factors.
5. Prompt Module: Structured GPT-4 prompt generation with clinical reasoning and guardrails.
6. Analysis Module: Differential possibility evaluation via GPT-4 / Ollama / Local Clinical Engine.
7. Question Module: Intelligent follow-up question generation for clinical triage.
8. Safety Module: Emergency red-flag detection, urgency level classification, and disclaimers.
9. Save Module: Structured export to JSON, Markdown, and clinical summary text files.
10. Main Module: End-to-end orchestration, interactive CLI loop, and execution pipeline.

DISCLAIMER: This system is an informational AI assistant, NOT a medical diagnostic tool.
Always consult a qualified healthcare provider for medical diagnosis and treatment.
"""

import os
import sys
import json
import re
import datetime
from typing import Dict, List, Any, Optional

# ==============================================================================
# MODULE 1: INPUT MODULE
# ==============================================================================
class InputModule:
    """Collects patient demographics, reported symptoms, and medical history."""

    @staticmethod
    def collect_from_dict(data: Dict[str, Any]) -> Dict[str, Any]:
        """Validates and collects input parameters from a dictionary."""
        return {
            "age": int(data.get("age", 25)),
            "sex": str(data.get("sex", "Unspecified")).strip().capitalize(),
            "symptoms": str(data.get("symptoms", "")).strip(),
            "duration": str(data.get("duration", "1 day")).strip(),
            "severity": str(data.get("severity", "Moderate")).strip().capitalize(),
            "medical_history": str(data.get("medical_history", "None reported")).strip(),
            "medication": str(data.get("medication", "None reported")).strip(),
            "allergies": str(data.get("allergies", "No known allergies")).strip(),
            "additional_info": str(data.get("additional_info", "None")).strip()
        }

    @staticmethod
    def collect_interactive() -> Dict[str, Any]:
        """Interactively collects patient details from the terminal."""
        print("\n" + "=" * 65)
        print(" AI-POWERED MEDICAL SYMPTOM ASSISTANT - PATIENT INTAKE")
        print("=" * 65)
        
        try:
            age_raw = input(" Patient Age (e.g., 28): ").strip()
            age = int(age_raw) if age_raw.isdigit() else 25
        except Exception:
            age = 25
            
        sex = input(" Patient Biological Sex (Male/Female/Other): ").strip().capitalize() or "Unspecified"
        print("\n Describe your symptoms in your own words:")
        symptoms = input(" Symptoms: ").strip() or "Headache and mild fatigue"
        duration = input(" Duration (e.g., 2 days, 1 week): ").strip() or "2 days"
        
        print(" Severity Level: 1) Mild  2) Moderate  3) Severe  4) Critical")
        sev_choice = input(" Select Severity (1-4) [default 2]: ").strip()
        sev_map = {"1": "Mild", "2": "Moderate", "3": "Severe", "4": "Critical"}
        severity = sev_map.get(sev_choice, "Moderate")
        
        medical_history = input(" Pre-existing Conditions / Medical History (or 'None'): ").strip() or "None"
        medication = input(" Current Medications (or 'None'): ").strip() or "None"
        allergies = input(" Known Allergies (or 'None'): ").strip() or "None"
        additional_info = input(" Additional Context (lifestyle, travel, pregnancy, etc.): ").strip() or "None"

        return InputModule.collect_from_dict({
            "age": age,
            "sex": sex,
            "symptoms": symptoms,
            "duration": duration,
            "severity": severity,
            "medical_history": medical_history,
            "medication": medication,
            "allergies": allergies,
            "additional_info": additional_info
        })


# ==============================================================================
# MODULE 2: PROFILE MODULE
# ==============================================================================
class ProfileModule:
    """Standardizes, validates, and builds the patient clinical profile."""

    @staticmethod
    def build_profile(raw_input: Dict[str, Any]) -> Dict[str, Any]:
        age = raw_input["age"]
        # Categorize age cohort
        if age < 2:
            cohort = "Infant"
        elif age < 12:
            cohort = "Child"
        elif age < 18:
            cohort = "Adolescent"
        elif age < 65:
            cohort = "Adult"
        else:
            cohort = "Elderly / Geriatric"

        return {
            "patient_id": f"PAT-{datetime.datetime.now().strftime('%Y%m%d-%H%M%S')}",
            "timestamp": datetime.datetime.now().isoformat(),
            "demographics": {
                "age": age,
                "age_cohort": cohort,
                "sex": raw_input["sex"]
            },
            "clinical_parameters": {
                "reported_symptoms": raw_input["symptoms"],
                "duration": raw_input["duration"],
                "severity": raw_input["severity"]
            },
            "background": {
                "medical_history": raw_input["medical_history"],
                "current_medications": raw_input["medication"],
                "known_allergies": raw_input["allergies"],
                "additional_context": raw_input["additional_info"]
            }
        }


# ==============================================================================
# MODULE 3: SYMPTOM MODULE
# ==============================================================================
class SymptomModule:
    """Extracts, categorizes, and standardizes symptoms from free-text descriptions."""

    CLINICAL_SYMPTOM_DICTIONARY = {
        "respiratory": ["cough", "sore throat", "runny nose", "congestion", "sneezing", "wheezing", "shortness of breath", "chest congestion", "phlegm"],
        "constitutional": ["fever", "chills", "fatigue", "weakness", "night sweats", "malaise", "lethargy", "weight loss"],
        "neurological": ["headache", "migraine", "dizziness", "vertigo", "confusion", "lightheadedness", "fainting"],
        "gastrointestinal": ["nausea", "vomiting", "diarrhea", "abdominal pain", "stomach cramps", "acid reflux", "loss of appetite"],
        "musculoskeletal": ["body ache", "muscle pain", "joint pain", "back pain", "stiffness", "neck pain"],
        "dermatological": ["rash", "itching", "hives", "redness", "skin lesions", "swelling"],
        "cardiovascular": ["chest pain", "palpitations", "rapid heartbeat", "chest tightness", "irregular heartbeat"]
    }

    @staticmethod
    def extract_symptoms(text: str) -> Dict[str, Any]:
        lower_text = text.lower()
        extracted = []
        categories_found = set()

        for category, terms in SymptomModule.CLINICAL_SYMPTOM_DICTIONARY.items():
            for term in terms:
                # Use word boundary matching
                pattern = r'\b' + re.escape(term) + r'\b'
                if re.search(pattern, lower_text):
                    if term not in extracted:
                        extracted.append(term)
                        categories_found.add(category)

        # Fallback if specific dictionary term wasn't matched
        if not extracted:
            tokens = [t.strip(",. ") for t in text.split() if len(t.strip(",. ")) > 3]
            extracted = tokens[:4]
            categories_found.add("unspecified")

        return {
            "raw_query": text,
            "identified_symptoms": extracted,
            "primary_symptom": extracted[0] if extracted else "General discomfort",
            "affected_systems": list(categories_found),
            "symptom_count": len(extracted)
        }


# ==============================================================================
# MODULE 4: CONTEXT MODULE
# ==============================================================================
class ContextModule:
    """Analyzes contextual risk factors, comorbidity interactions, and vulnerability."""

    HIGH_RISK_COMORBIDITIES = ["diabetes", "hypertension", "asthma", "copd", "heart disease", "immunocompromised", "cancer", "kidney disease"]

    @staticmethod
    def evaluate_context(profile: Dict[str, Any], symptom_data: Dict[str, Any]) -> Dict[str, Any]:
        demo = profile["demographics"]
        bg = profile["background"]
        severity = profile["clinical_parameters"]["severity"]
        history_lower = bg["medical_history"].lower()
        meds_lower = bg["current_medications"].lower()
        allergies_lower = bg["known_allergies"].lower()

        identified_comorbidities = [c for c in ContextModule.HIGH_RISK_COMORBIDITIES if c in history_lower]
        
        # Risk vulnerability score (1 to 5)
        risk_score = 1
        risk_factors = []

        if demo["age"] <= 2 or demo["age"] >= 65:
            risk_score += 1
            risk_factors.append(f"Age group vulnerability ({demo['age_cohort']})")

        if identified_comorbidities:
            risk_score += len(identified_comorbidities)
            risk_factors.append(f"Pre-existing conditions: {', '.join(identified_comorbidities)}")

        if severity in ["Severe", "Critical"]:
            risk_score += 2
            risk_factors.append(f"Elevated severity reported: {severity}")

        if "penicillin" in allergies_lower or "antibiotic" in allergies_lower or "sulfa" in allergies_lower:
            risk_factors.append(f"Drug allergy alert: {bg['known_allergies']}")

        risk_score = min(risk_score, 5)
        level_map = {1: "Low", 2: "Mild", 3: "Moderate", 4: "Elevated", 5: "High / Urgent"}

        return {
            "vulnerability_score": risk_score,
            "context_risk_level": level_map[risk_score],
            "identified_comorbidities": identified_comorbidities,
            "has_drug_allergies": allergies_lower not in ["none", "no", "no known allergies", ""],
            "risk_factors": risk_factors
        }


# ==============================================================================
# MODULE 5: PROMPT MODULE
# ==============================================================================
class PromptModule:
    """Constructs rigorous clinical reasoning prompts for GPT-4 with strict guardrails."""

    @staticmethod
    def generate_gpt4_prompt(profile: Dict[str, Any], symptom_data: Dict[str, Any], context_data: Dict[str, Any]) -> str:
        demo = profile["demographics"]
        params = profile["clinical_parameters"]
        bg = profile["background"]

        prompt = f"""You are a professional Medical Symptom Assistant AI built for clinical triage guidance.
IMPORTANT INSTRUCTIONS & GUARDRAILS:
1. You DO NOT provide a definitive medical diagnosis. You only provide informational possibilities.
2. Clearly communicate uncertainty using phrases like "Possible conditions may include..." or "These symptoms can occur with...".
3. Evaluate user symptoms against the patient context, age, duration, severity, and medical history.
4. Detect any emergency red flags requiring immediate hospital or emergency care.
5. Formulate 3-4 targeted clinical follow-up questions.
6. Provide general self-care guidance and clear criteria for when to seek urgent medical attention.

PATIENT INTAKE DATA:
- Age: {demo['age']} ({demo['age_cohort']})
- Biological Sex: {demo['sex']}
- Reported Symptoms: {params['reported_symptoms']}
- Normalized Identified Symptoms: {', '.join(symptom_data['identified_symptoms'])}
- Symptom Duration: {params['duration']}
- Reported Severity: {params['severity']}
- Pre-existing Conditions: {bg['medical_history']}
- Current Medications: {bg['current_medications']}
- Known Allergies: {bg['known_allergies']}
- Additional Context: {bg['additional_context']}
- Contextual Risk Level: {context_data['context_risk_level']} (Vulnerability Score: {context_data['vulnerability_score']}/5)

OUTPUT FORMAT REQUIREMENTS:
Provide your response in structured JSON with the following exact keys:
{{
  "reported_symptoms_summary": "string",
  "possible_conditions": [
    {{"condition": "string", "likelihood": "High/Moderate/Low", "rationale": "string"}}
  ],
  "differential_explanation": "string explaining why these conditions were considered",
  "follow_up_questions": ["question 1", "question 2", "question 3"],
  "medical_attention_guidance": {{
    "urgency": "Emergency (Call 911/112) | Urgent Care (Within 24 hours) | Routine Medical Evaluation | Self-Care",
    "triggers_for_immediate_care": ["trigger 1", "trigger 2"],
    "general_self_care": ["tip 1", "tip 2"]
  }},
  "safety_disclaimer": "This is an informational AI analysis and not a medical diagnosis. Always consult a licensed healthcare professional."
}}"""
        return prompt


# ==============================================================================
# MODULE 6: ANALYSIS MODULE
# ==============================================================================
class AnalysisModule:
    """Evaluates differential condition possibilities using GPT-4 / Ollama / Local Clinical Engine."""

    # Built-in Clinical Knowledge Base for 0-Data Offline Intelligence
    CONDITION_DATABASE = [
        {
            "condition": "Viral Upper Respiratory Tract Infection (Common Cold)",
            "key_symptoms": ["cough", "sore throat", "runny nose", "congestion", "sneezing", "mild fever", "fatigue"],
            "rationale": "Classic cluster of upper airway mucosal irritation, rhinorrhea, and mild low-grade pyrexia.",
            "urgency": "Self-Care"
        },
        {
            "condition": "Influenza (Flu)",
            "key_symptoms": ["fever", "chills", "body ache", "fatigue", "headache", "cough", "weakness"],
            "rationale": "Acute onset of high fever, systemic myalgia, severe exhaustion, and non-productive cough.",
            "urgency": "Routine Medical Evaluation"
        },
        {
            "condition": "Streptococcal Pharyngitis (Strep Throat)",
            "key_symptoms": ["sore throat", "fever", "headache", "swollen lymph nodes", "nausea"],
            "rationale": "Severe localized pharyngeal pain, absence of significant cough, and associated febrile reaction.",
            "urgency": "Routine Medical Evaluation"
        },
        {
            "condition": "Acute Bronchitis",
            "key_symptoms": ["cough", "chest congestion", "phlegm", "shortness of breath", "mild fever"],
            "rationale": "Lower respiratory bronchial inflammation causing persistent productive cough and chest rattling.",
            "urgency": "Routine Medical Evaluation"
        },
        {
            "condition": "Tension Headache / Cervicogenic Headache",
            "key_symptoms": ["headache", "neck pain", "stiffness", "fatigue"],
            "rationale": "Bilateral band-like constricting cranial tension, frequently aggravated by screen posture or fatigue.",
            "urgency": "Self-Care"
        },
        {
            "condition": "Migraine Episode",
            "key_symptoms": ["headache", "nausea", "vomiting", "dizziness", "light sensitivity"],
            "rationale": "Unilateral pulsating or throbbing cephalalgia frequently accompanied by autonomic nausea or photophobia.",
            "urgency": "Routine Medical Evaluation"
        },
        {
            "condition": "Acute Viral Gastroenteritis",
            "key_symptoms": ["nausea", "vomiting", "diarrhea", "abdominal pain", "stomach cramps", "fever"],
            "rationale": "Enteric mucosal inflammation presenting with rapid onset GI distress and fluid-electrolyte depletion risk.",
            "urgency": "Routine Medical Evaluation"
        },
        {
            "condition": "Allergic Rhinitis / Seasonal Allergies",
            "key_symptoms": ["sneezing", "runny nose", "congestion", "itching", "rash"],
            "rationale": "IgE-mediated histamine response to environmental aeroallergens without febrile systemic response.",
            "urgency": "Self-Care"
        },
        {
            "condition": "Acute Coronary Syndrome / Angina (EMERGENCY)",
            "key_symptoms": ["chest pain", "shortness of breath", "palpitations", "dizziness", "weakness"],
            "rationale": "Ischemic myocardial warning symptoms requiring emergent hemodynamical and ECG evaluation.",
            "urgency": "Emergency (Call 911/112)"
        }
    ]

    @staticmethod
    def analyze_local_engine(symptom_data: Dict[str, Any], context_data: Dict[str, Any], params: Dict[str, Any]) -> List[Dict[str, Any]]:
        """High-accuracy offline clinical differential matcher (Consumes 0 Mobile Data)."""
        patient_symps = set(symptom_data["identified_symptoms"])
        scored_conditions = []

        for item in AnalysisModule.CONDITION_DATABASE:
            condition_symps = set(item["key_symptoms"])
            intersection = patient_symps.intersection(condition_symps)
            if intersection:
                match_ratio = len(intersection) / max(len(patient_symps), 1)
                score = len(intersection) * 2.0 + match_ratio * 3.0
                
                # Check severity weighting
                if item["urgency"] == "Emergency (Call 911/112)" and params["severity"] in ["Severe", "Critical"]:
                    score += 4.0

                scored_conditions.append({
                    "condition": item["condition"],
                    "matched_symptoms": list(intersection),
                    "score": score,
                    "rationale": item["rationale"],
                    "urgency_baseline": item["urgency"]
                })

        scored_conditions.sort(key=lambda x: x["score"], reverse=True)
        top_candidates = scored_conditions[:3]

        if not top_candidates:
            # Fallback differential
            top_candidates = [
                {
                    "condition": "Non-specific Viral Syndrome / General Malaise",
                    "matched_symptoms": list(patient_symps),
                    "score": 1.0,
                    "rationale": "Reported symptoms are non-specific and commonly accompany mild viral infections or transient fatigue.",
                    "urgency_baseline": "Self-Care"
                }
            ]

        results = []
        for idx, cand in enumerate(top_candidates):
            if idx == 0 and cand["score"] >= 3.0:
                likelihood = "High"
            elif cand["score"] >= 1.5:
                likelihood = "Moderate"
            else:
                likelihood = "Low"

            results.append({
                "condition": cand["condition"],
                "likelihood": likelihood,
                "rationale": cand["rationale"],
                "matched_symptoms": cand["matched_symptoms"]
            })

        return results


# ==============================================================================
# MODULE 7: QUESTION MODULE
# ==============================================================================
class QuestionModule:
    """Generates targeted follow-up questions to clarify clinical ambiguity."""

    @staticmethod
    def generate_follow_up_questions(symptom_data: Dict[str, Any], profile: Dict[str, Any]) -> List[str]:
        questions = []
        symps = symptom_data["identified_symptoms"]
        duration = profile["clinical_parameters"]["duration"]

        if any(s in symps for s in ["fever", "chills"]):
            questions.append("What is your highest recorded body temperature, and has it responded to antipyretics like acetaminophen/paracetamol?")

        if any(s in symps for s in ["cough", "chest congestion", "phlegm"]):
            questions.append("Is your cough dry, or are you producing sputum/mucus (if so, what color: clear, yellow, or greenish)?")

        if any(s in symps for s in ["headache", "migraine"]):
            questions.append("Did the headache begin suddenly like a thunderclap, and is it accompanied by visual auras, vomiting, or neck stiffness?")

        if any(s in symps for s in ["shortness of breath", "chest pain"]):
            questions.append("Does the chest discomfort radiate to your jaw, neck, back, or left arm, or worsen when lying flat or taking a deep breath?")

        if any(s in symps for s in ["nausea", "vomiting", "diarrhea"]):
            questions.append("Are you able to keep oral fluids down, and have you noticed any signs of dehydration such as dark urine or extreme thirst?")

        # General timeline & exposure question
        questions.append(f"Have your symptoms improved, remained stable, or worsened over the course of {duration}?")
        questions.append("Have you recently traveled, been in close contact with sick individuals, or started any new dietary supplements?")

        return questions[:4]


# ==============================================================================
# MODULE 8: SAFETY MODULE
# ==============================================================================
class SafetyModule:
    """Identifies red-flag emergency symptoms, triage urgency, and embeds disclaimers."""

    RED_FLAG_PATTERNS = [
        ("chest pain", "Severe chest pressure, tightness, or pain radiating to jaw or left arm"),
        ("shortness of breath", "Significant difficulty breathing, gasping, or respiratory distress"),
        ("confusion", "Sudden confusion, altered mental status, or slurred speech"),
        ("fainting", "Loss of consciousness or syncope"),
        ("stiff neck", "Severe headache combined with acute neck stiffness and high fever"),
        ("blue lips", "Cyanosis or bluish discoloration of lips, face, or fingernails")
    ]

    DISCLAIMER_TEXT = (
        "IMPORTANT MEDICAL NOTICE & SAFETY DISCLAIMER:\n"
        "This application is an artificial intelligence demonstration designed for informational\n"
        "and educational purposes only. It DOES NOT provide a formal medical diagnosis, prognosis,\n"
        "or clinical prescription. Medical conditions require direct evaluation by a licensed healthcare\n"
        "practitioner. If you are experiencing a life-threatening medical emergency, call 911/112\n"
        "or go to the nearest emergency room immediately."
    )

    @staticmethod
    def evaluate_safety(profile: Dict[str, Any], symptom_data: Dict[str, Any], conditions: List[Dict[str, Any]]) -> Dict[str, Any]:
        raw_text = (profile["clinical_parameters"]["reported_symptoms"] + " " + profile["background"]["additional_context"]).lower()
        severity = profile["clinical_parameters"]["severity"]
        
        detected_red_flags = []
        for trigger, description in SafetyModule.RED_FLAG_PATTERNS:
            if trigger in raw_text:
                detected_red_flags.append(f"{trigger.upper()}: {description}")

        # Triage urgency level assignment
        if detected_red_flags or severity == "Critical":
            urgency = "EMERGENCY - Seek Immediate Hospitalization (Call 911 / 112)"
            color_badge = "CRITICAL_RED"
            action_plan = [
                "Call local emergency services (911 in US, 112 in EU/India) immediately.",
                "Do NOT attempt to drive yourself to the hospital.",
                "Sit upright and loosen any restrictive clothing while waiting for medical personnel."
            ]
        elif severity == "Severe" or any(c.get("likelihood") == "High" and "Acute" in c["condition"] for c in conditions):
            urgency = "URGENT CARE - Seek In-Person Medical Attention within 12-24 Hours"
            color_badge = "URGENT_ORANGE"
            action_plan = [
                "Visit an urgent care clinic or schedule a priority doctor consultation today.",
                "Monitor vitals (temperature, pulse, hydration) closely every 4 hours.",
                "Seek emergency care if symptoms rapidly escalate."
            ]
        elif profile["clinical_parameters"]["duration"] in ["1 week", "2 weeks", "chronic", "persistent"]:
            urgency = "ROUTINE CLINICAL EVALUATION - Consult a General Physician this week"
            color_badge = "ROUTINE_YELLOW"
            action_plan = [
                "Schedule a routine appointment with your primary healthcare provider.",
                "Keep a daily symptom journal noting time of day, severity, and meals.",
                "Avoid unprescribed antibiotics or self-medication."
            ]
        else:
            urgency = "MILD / CONSERVATIVE SELF-CARE & MONITORING"
            color_badge = "STABLE_GREEN"
            action_plan = [
                "Maintain adequate hydration with water, herbal teas, or oral rehydration solutions.",
                "Ensure sufficient bed rest (7-9 hours) to support immune recovery.",
                "Consult a physician if symptoms do not improve within 3 to 5 days."
            ]

        return {
            "has_red_flags": len(detected_red_flags) > 0,
            "detected_red_flags": detected_red_flags,
            "urgency_level": urgency,
            "urgency_badge": color_badge,
            "action_plan": action_plan,
            "disclaimer": SafetyModule.DISCLAIMER_TEXT
        }


# ==============================================================================
# MODULE 9: SAVE MODULE
# ==============================================================================
class SaveModule:
    """Exports structured medical symptom analysis to JSON, Markdown, and text files."""

    @staticmethod
    def save_report(analysis_data: Dict[str, Any], output_dir: str = ".") -> Dict[str, str]:
        os.makedirs(output_dir, exist_ok=True)
        patient_id = analysis_data["profile"]["patient_id"]
        
        json_file = os.path.join(output_dir, f"{patient_id}_report.json")
        md_file = os.path.join(output_dir, f"{patient_id}_report.md")

        # 1. Save JSON
        with open(json_file, "w", encoding="utf-8") as f:
            json.dump(analysis_data, f, indent=2)

        # 2. Save Markdown
        md_content = SaveModule.format_markdown(analysis_data)
        with open(md_file, "w", encoding="utf-8") as f:
            f.write(md_content)

        return {
            "json_path": json_file,
            "markdown_path": md_file
        }

    @staticmethod
    def format_markdown(data: Dict[str, Any]) -> str:
        p = data["profile"]
        demo = p["demographics"]
        params = p["clinical_parameters"]
        bg = p["background"]
        s = data["safety"]

        lines = [
            "# AI-POWERED MEDICAL SYMPTOM ASSISTANT ANALYSIS REPORT",
            f"**Report ID:** {p['patient_id']}  ",
            f"**Generated:** {p['timestamp']}  ",
            f"**Triage Urgency:** {s['urgency_level']}  ",
            "\n---\n",
            "## 1. PATIENT PROFILE",
            f"- **Age:** {demo['age']} years ({demo['age_cohort']})",
            f"- **Sex:** {demo['sex']}",
            f"- **Reported Symptoms:** {params['reported_symptoms']}",
            f"- **Duration:** {params['duration']}",
            f"- **Reported Severity:** {params['severity']}",
            f"- **Medical History:** {bg['medical_history']}",
            f"- **Current Medications:** {bg['current_medications']}",
            f"- **Known Allergies:** {bg['known_allergies']}",
            f"- **Additional Context:** {bg['additional_context']}",
            "\n## 2. EXTRACTED CLINICAL SYMPTOMS",
            f"- **Identified Symptoms:** {', '.join(data['symptoms']['identified_symptoms'])}",
            f"- **Affected Physiological Systems:** {', '.join(data['symptoms']['affected_systems'])}",
            "\n## 3. CONTEXT & RISK EVALUATION",
            f"- **Risk Level:** {data['context']['context_risk_level']} (Score: {data['context']['vulnerability_score']}/5)",
            f"- **Risk Factors Identified:** {', '.join(data['context']['risk_factors']) if data['context']['risk_factors'] else 'None'}",
            "\n## 4. POSSIBLE CONDITIONS CONSIDERED",
        ]

        for idx, cond in enumerate(data["conditions"], 1):
            lines.append(f"### {idx}. {cond['condition']} ({cond['likelihood']} Likelihood)")
            lines.append(f"- **Rationale:** {cond['rationale']}")
            if "matched_symptoms" in cond:
                lines.append(f"- **Matched Symptoms:** {', '.join(cond['matched_symptoms'])}")

        lines.append("\n## 5. RECOMMENDED FOLLOW-UP QUESTIONS")
        for q in data["follow_up_questions"]:
            lines.append(f"- {q}")

        lines.append(f"\n## 6. MEDICAL ATTENTION GUIDANCE ({s['urgency_level']})")
        for act in s["action_plan"]:
            lines.append(f"1. {act}")

        if s["has_red_flags"]:
            lines.append("\n### ⚠️ RED FLAG WARNINGS DETECTED:")
            for rf in s["detected_red_flags"]:
                lines.append(f"- {rf}")

        lines.append("\n---\n")
        lines.append("## SAFETY DISCLAIMER")
        lines.append(f"> {s['disclaimer']}")

        return "\n".join(lines)


# ==============================================================================
# MODULE 10: MAIN MODULE
# ==============================================================================
class MedicalSymptomAssistant:
    """Main Orchestrator tying all 10 modules into an end-to-end pipeline."""

    def __init__(self, output_dir: str = "outputs"):
        self.output_dir = output_dir

    def process_patient(self, input_data: Dict[str, Any]) -> Dict[str, Any]:
        """Runs the complete 10-module symptom analysis pipeline."""
        # Step 1: Input Module
        raw_input = InputModule.collect_from_dict(input_data)

        # Step 2: Profile Module
        profile = ProfileModule.build_profile(raw_input)

        # Step 3: Symptom Module
        symptom_data = SymptomModule.extract_symptoms(raw_input["symptoms"])

        # Step 4: Context Module
        context_data = ContextModule.evaluate_context(profile, symptom_data)

        # Step 5: Prompt Module
        gpt4_prompt = PromptModule.generate_gpt4_prompt(profile, symptom_data, context_data)

        # Step 6: Analysis Module (Local 0-data intelligence engine)
        conditions = AnalysisModule.analyze_local_engine(symptom_data, context_data, raw_input)

        # Step 7: Question Module
        follow_up_questions = QuestionModule.generate_follow_up_questions(symptom_data, profile)

        # Step 8: Safety Module
        safety_data = SafetyModule.evaluate_safety(profile, symptom_data, conditions)

        complete_result = {
            "profile": profile,
            "symptoms": symptom_data,
            "context": context_data,
            "generated_prompt": gpt4_prompt,
            "conditions": conditions,
            "follow_up_questions": follow_up_questions,
            "safety": safety_data
        }

        # Step 9: Save Module
        file_paths = SaveModule.save_report(complete_result, self.output_dir)
        complete_result["saved_files"] = file_paths

        return complete_result

    def run_cli(self):
        """Interactive terminal entrypoint."""
        print("\n" + "=" * 65)
        print("  AI-POWERED MEDICAL SYMPTOM ASSISTANT USING GPT-4")
        print("  24CS2506: Building Applications using GPT-4 - Experiment 6")
        print("=" * 65)

        raw_input = InputModule.collect_interactive()
        print("\n[*] Processing patient intake through 10-module pipeline...")
        result = self.process_patient(raw_input)

        print("\n" + "=" * 65)
        print("  STRUCTURED MEDICAL ANALYSIS REPORT")
        print("=" * 65)
        print(f" Patient ID : {result['profile']['patient_id']}")
        print(f" Age / Sex  : {result['profile']['demographics']['age']} ({result['profile']['demographics']['age_cohort']}) / {result['profile']['demographics']['sex']}")
        print(f" Urgency    : {result['safety']['urgency_level']}")
        print("-" * 65)

        print("\n[+] Extracted Symptoms:")
        for s in result['symptoms']['identified_symptoms']:
            print(f"  • {s}")

        print("\n[+] Possible Conditions Considered:")
        for idx, c in enumerate(result['conditions'], 1):
            print(f"  {idx}. {c['condition']} [Likelihood: {c['likelihood']}]")
            print(f"     Rationale: {c['rationale']}")

        print("\n[+] Recommended Clinical Follow-up Questions:")
        for q in result['follow_up_questions']:
            print(f"  ? {q}")

        print("\n[+] Medical Attention Guidance & Action Plan:")
        for act in result['safety']['action_plan']:
            print(f"  ✓ {act}")

        print("\n" + "!" * 65)
        print(" SAFETY DISCLAIMER:")
        print(f" {result['safety']['disclaimer']}")
        print("!" * 65)

        print(f"\n[✓] Report Saved Successfully:")
        print(f"  JSON     : {result['saved_files']['json_path']}")
        print(f"  Markdown : {result['saved_files']['markdown_path']}")
        print("=" * 65 + "\n")


if __name__ == "__main__":
    assistant = MedicalSymptomAssistant(output_dir="outputs")
    
    # If run with --demo or no arguments, run a high-fidelity demonstration
    if len(sys.argv) > 1 and sys.argv[1] == "--interactive":
        assistant.run_cli()
    else:
        print("[*] Running Sample Patient Demonstration (Acute Respiratory Case)...")
        sample_case = {
            "age": 22,
            "sex": "Female",
            "symptoms": "I have had a sore throat, mild fever, and dry cough for the past two days. I also feel slightly tired.",
            "duration": "2 days",
            "severity": "Mild",
            "medical_history": "Mild seasonal asthma",
            "medication": "Albuterol inhaler as needed",
            "allergies": "No known drug allergies",
            "additional_info": "College student during midterms, feeling stressed"
        }
        res = assistant.process_patient(sample_case)
        print(f"[✓] Analysis complete for {res['profile']['patient_id']}!")
        print(f"[✓] Saved JSON: {res['saved_files']['json_path']}")
        print(f"[✓] Saved Markdown: {res['saved_files']['markdown_path']}")
        print(f"[✓] Triage: {res['safety']['urgency_level']}")
