/**
 * MediSense AI: AI-Powered Medical Symptom Assistant using GPT-4
 * Course: 24CS2506 - Experiment 6
 * Client-Side Application Engine (100% Offline / Zero Mobile Data Consumed)
 */

// ==============================================================================
// 1. PRESET CLINICAL CASES (Instant Zero-Data Demonstrations)
// ==============================================================================
const CLINICAL_PRESETS = {
  respiratory: {
    age: 22,
    sex: "Female",
    duration: "2 days",
    symptoms: "I have had a sore throat, mild fever, and dry cough for the past two days. I also feel slightly tired and have a mild headache.",
    severity: "Mild",
    history: "Mild seasonal asthma",
    medications: "Albuterol inhaler as needed",
    allergies: "No known drug allergies",
    additional: "College student during midterms, feeling mildly stressed"
  },
  migraine: {
    age: 34,
    sex: "Female",
    duration: "1 day",
    symptoms: "Severe throbbing headache on the right side of my head, accompanied by nausea, sensitivity to bright lights, and visual zigzag flashes.",
    severity: "Severe",
    history: "Occasional tension headaches",
    medications: "Ibuprofen occasionally",
    allergies: "Penicillin (causes hives)",
    additional: "Spent long hours looking at computer monitors without adequate sleep"
  },
  gastro: {
    age: 29,
    sex: "Male",
    duration: "24 hours",
    symptoms: "Frequent nausea, watery diarrhea, abdominal cramping, and low-grade chills. Unable to keep solid foods down.",
    severity: "Moderate",
    history: "None reported",
    medications: "None",
    allergies: "No known allergies",
    additional: "Ate seafood at an outdoor street market 2 days ago"
  },
  allergy: {
    age: 19,
    sex: "Male",
    duration: "1 week",
    symptoms: "Persistent sneezing, itchy and watery eyes, clear runny nose, and nasal congestion with no fever or body ache.",
    severity: "Mild",
    history: "Eczema in childhood",
    medications: "None",
    allergies: "Pollen and cat dander",
    additional: "Spring season, high tree pollen count reported in area"
  },
  cardiac: {
    age: 58,
    sex: "Male",
    duration: "2 hours",
    symptoms: "Severe crushing chest pain radiating into the left arm and jaw, severe shortness of breath, cold sweat, dizziness, and palpitations.",
    severity: "Critical",
    history: "Hypertension, Hyperlipidemia (High cholesterol)",
    medications: "Amlodipine 5mg, Atorvastatin 20mg",
    allergies: "Aspirin (mild stomach upset)",
    additional: "Smoker (1 pack/day for 20 years), experienced symptoms while walking upstairs"
  }
};

// ==============================================================================
// 2. CLINICAL ONTOLOGY & DIFFERENTIAL DATABASE
// ==============================================================================
const SYMPTOM_DICTIONARY = {
  respiratory: {
    name: "Respiratory System",
    icon: "🫁",
    terms: ["cough", "sore throat", "runny nose", "congestion", "sneezing", "wheezing", "shortness of breath", "chest congestion", "phlegm", "nasal congestion"]
  },
  constitutional: {
    name: "Constitutional / Systemic",
    icon: "🌡️",
    terms: ["fever", "chills", "fatigue", "weakness", "night sweats", "malaise", "lethargy", "tired", "cold sweat"]
  },
  neurological: {
    name: "Neurological System",
    icon: "🧠",
    terms: ["headache", "migraine", "dizziness", "vertigo", "confusion", "lightheadedness", "fainting", "throbbing headache", "visual zigzag", "sensitivity to light"]
  },
  gastrointestinal: {
    name: "Gastrointestinal System",
    icon: "🤢",
    terms: ["nausea", "vomiting", "diarrhea", "abdominal pain", "abdominal cramping", "stomach cramps", "acid reflux", "loss of appetite"]
  },
  cardiovascular: {
    name: "Cardiovascular System",
    icon: "🫀",
    terms: ["chest pain", "palpitations", "rapid heartbeat", "chest tightness", "irregular heartbeat", "crushing chest pain", "radiating"]
  },
  dermatological: {
    name: "Dermatological & Allergic",
    icon: "🌸",
    terms: ["rash", "itching", "itchy eyes", "hives", "redness", "skin lesions", "swelling"]
  }
};

const DIFFERENTIAL_DATABASE = [
  {
    condition: "Viral Upper Respiratory Tract Infection (Common Cold)",
    category: "respiratory",
    key_symptoms: ["cough", "sore throat", "runny nose", "congestion", "sneezing", "fever", "tired", "fatigue", "headache"],
    rationale: "Classic presentation of mucosal inflammation, rhinorrhea, and mild systemic fatigue.",
    urgency: "Routine Self-Care & Monitoring",
    urgencyLevel: "routine"
  },
  {
    condition: "Influenza (Flu)",
    category: "constitutional",
    key_symptoms: ["fever", "chills", "body ache", "fatigue", "headache", "cough", "weakness"],
    rationale: "Rapid onset of high pyrexia, profound systemic myalgia, headache, and persistent exhaustion.",
    urgency: "Routine Medical Evaluation within 48 Hours",
    urgencyLevel: "routine"
  },
  {
    condition: "Acute Migraine Episode with Aura",
    category: "neurological",
    key_symptoms: ["headache", "throbbing headache", "migraine", "nausea", "vomiting", "dizziness", "visual zigzag", "sensitivity to light"],
    rationale: "Unilateral pulsating cephalalgia accompanied by sensory photophobia, visual scotoma, and nausea.",
    urgency: "Physician Evaluation / Neurological Care",
    urgencyLevel: "urgent"
  },
  {
    condition: "Acute Viral Gastroenteritis",
    category: "gastrointestinal",
    key_symptoms: ["nausea", "vomiting", "diarrhea", "abdominal pain", "abdominal cramping", "stomach cramps", "chills"],
    rationale: "Enteric pathogen irritation triggering acute hypermotility, nausea, and fluid-electrolyte dehydration risk.",
    urgency: "Routine Clinical Evaluation if Dehydration Occurs",
    urgencyLevel: "routine"
  },
  {
    condition: "Seasonal Allergic Rhinitis",
    category: "dermatological",
    key_symptoms: ["sneezing", "runny nose", "congestion", "nasal congestion", "itchy eyes", "itching"],
    rationale: "Aeroallergen-triggered mast-cell histamine cascade without pyretic infection markers.",
    urgency: "Self-Care & Antihistamine Consultation",
    urgencyLevel: "routine"
  },
  {
    condition: "Acute Coronary Syndrome / Myocardial Infarction (EMERGENCY)",
    category: "cardiovascular",
    key_symptoms: ["chest pain", "crushing chest pain", "radiating", "shortness of breath", "cold sweat", "dizziness", "palpitations"],
    rationale: "Critical cardiac ischemia signs requiring immediate electrocardiogram, troponin testing, and hemodynamic triage.",
    urgency: "EMERGENCY - Call 911 / 112 Immediately",
    urgencyLevel: "emergency"
  },
  {
    condition: "Acute Bronchitis / Tracheobronchial Irritation",
    category: "respiratory",
    key_symptoms: ["cough", "phlegm", "chest congestion", "shortness of breath", "sore throat", "fever"],
    rationale: "Lower airway bronchial hyperresponsiveness and mucosal secretions following viral prodrome.",
    urgency: "Routine Medical Consultation",
    urgencyLevel: "routine"
  }
];

// Emergency red flag terms
const RED_FLAG_TRIGGERS = [
  { trigger: "chest pain", detail: "Severe chest pain, pressure, or tightness radiating to arm or jaw" },
  { trigger: "crushing chest pain", detail: "Crushing chest discomfort indicative of acute cardiac ischemia" },
  { trigger: "shortness of breath", detail: "Acute respiratory distress or severe breathing difficulty" },
  { trigger: "radiating", detail: "Pain radiating across chest, jaw, neck, or left arm" },
  { trigger: "confusion", detail: "Sudden cognitive confusion or altered mental state" },
  { trigger: "fainting", detail: "Syncope or sudden loss of consciousness" }
];

// ==============================================================================
// 3. APPLICATION STATE
// ==============================================================================
let currentCase = null;
let currentResult = null;

// ==============================================================================
// 4. CORE PIPELINE MODULES (Client-Side Implementation)
// ==============================================================================

// Module 1 & 2: Input & Profile Module
function buildPatientProfile() {
  const age = parseInt(document.getElementById("patientAge").value) || 25;
  const sex = document.getElementById("patientSex").value;
  const duration = document.getElementById("symptomDuration").value.trim() || "2 days";
  const symptoms = document.getElementById("symptomText").value.trim();
  
  let severity = "Moderate";
  const sevRadios = document.getElementsByName("severity");
  for (const r of sevRadios) {
    if (r.checked) {
      severity = r.value;
      break;
    }
  }

  const history = document.getElementById("medHistory").value.trim() || "None reported";
  const medications = document.getElementById("currentMeds").value.trim() || "None reported";
  const allergies = document.getElementById("allergies").value.trim() || "No known allergies";
  const additional = document.getElementById("additionalInfo").value.trim() || "None";

  // Determine age cohort
  let cohort = "Adult";
  if (age < 2) cohort = "Infant";
  else if (age < 12) cohort = "Child";
  else if (age < 18) cohort = "Adolescent";
  else if (age >= 65) cohort = "Elderly / Geriatric";

  const caseId = "PAT-" + new Date().toISOString().slice(0, 10).replace(/-/g, "") + "-" + Math.floor(100 + Math.random() * 900);

  return {
    caseId,
    timestamp: new Date().toLocaleString(),
    age,
    ageCohort: cohort,
    sex,
    duration,
    symptoms,
    severity,
    history,
    medications,
    allergies,
    additional
  };
}

// Module 3: Symptom Module (NLP Extraction)
function extractSymptoms(profile) {
  const text = (profile.symptoms + " " + profile.additional).toLowerCase();
  const extracted = [];
  const organSystems = {};

  for (const [key, category] of Object.entries(SYMPTOM_DICTIONARY)) {
    const matchedTerms = [];
    for (const term of category.terms) {
      const regex = new RegExp(`\\b${term}\\b`, "i");
      if (regex.test(text)) {
        matchedTerms.push(term);
        if (!extracted.includes(term)) {
          extracted.push(term);
        }
      }
    }
    if (matchedTerms.length > 0) {
      organSystems[key] = {
        name: category.name,
        icon: category.icon,
        matched: matchedTerms
      };
    }
  }

  // Fallback if no exact dictionary match
  if (extracted.length === 0) {
    const tokens = profile.symptoms.split(/\s+/).filter(t => t.length > 3).slice(0, 3);
    extracted.push(...tokens);
    organSystems["general"] = {
      name: "General Discomfort",
      icon: "🩺",
      matched: tokens
    };
  }

  return {
    identifiedSymptoms: extracted,
    organSystems: organSystems,
    primarySymptom: extracted[0] || "General discomfort"
  };
}

// Module 4: Context Module (Comorbidity & Vulnerability)
function analyzeContext(profile, symptomData) {
  let vulnScore = 1;
  const modifiers = [];

  if (profile.age <= 2 || profile.age >= 65) {
    vulnScore += 1;
    modifiers.push(`Age cohort vulnerability: ${profile.ageCohort} (${profile.age} years)`);
  }

  if (profile.severity === "Severe") {
    vulnScore += 1;
    modifiers.push("Reported severity is marked as Severe");
  } else if (profile.severity === "Critical") {
    vulnScore += 2;
    modifiers.push("Reported severity is marked as Critical (Urgent Escalation)");
  }

  const histLower = profile.history.toLowerCase();
  const comorbidities = [];
  const highRiskConditions = ["asthma", "diabetes", "hypertension", "heart disease", "copd", "immunocompromised", "hyperlipidemia"];
  for (const c of highRiskConditions) {
    if (histLower.includes(c)) {
      comorbidities.push(c.toUpperCase());
    }
  }

  if (comorbidities.length > 0) {
    vulnScore += 1;
    modifiers.push(`Identified clinical comorbidities: ${comorbidities.join(", ")}`);
  }

  const allergLower = profile.allergies.toLowerCase();
  let hasAllergyAlert = false;
  if (allergLower !== "none" && allergLower !== "no known allergies" && allergLower !== "no" && allergLower !== "") {
    hasAllergyAlert = true;
    modifiers.push(`Known allergies noted: ${profile.allergies}`);
  }

  vulnScore = Math.min(vulnScore, 5);
  const riskLabels = {
    1: { label: "Low Risk", class: "badge-tag" },
    2: { label: "Mild Risk", class: "badge-tag" },
    3: { label: "Moderate Risk", class: "badge-offline" },
    4: { label: "Elevated Risk", class: "badge-tag" },
    5: { label: "High / Urgent Risk", class: "badge-tag" }
  };

  return {
    score: vulnScore,
    riskInfo: riskLabels[vulnScore],
    comorbidities: comorbidities,
    hasAllergies: hasAllergyAlert,
    modifiers: modifiers
  };
}

// Module 5: Prompt Module
function generatePrompt(profile, symptomData, contextData) {
  return `You are MediSense AI, an advanced Medical Symptom Assistant built for clinical triage guidance.
IMPORTANT CLINICAL GUARDRAILS:
1. You DO NOT provide a definitive diagnosis or medical prescription.
2. Communicate diagnostic uncertainty clearly (e.g. "Possible conditions to discuss with your physician...").
3. Contextualize symptoms with patient age, duration, severity, and medical history.
4. Detect and escalate emergency red-flag triggers immediately.
5. Formulate 3-4 targeted clinical follow-up questions.
6. Provide supportive self-care recommendations and clear escalation triggers.

PATIENT INTAKE RECORD:
- Patient ID: ${profile.caseId}
- Demographics: Age ${profile.age} (${profile.ageCohort}) | Biological Sex: ${profile.sex}
- Reported Symptoms: "${profile.symptoms}"
- Normalized Clinical Symptoms: ${symptomData.identifiedSymptoms.join(", ")}
- Duration: ${profile.duration} | Severity: ${profile.severity}
- Medical History: ${profile.history}
- Current Medications: ${profile.medications}
- Known Allergies: ${profile.allergies}
- Additional Context: ${profile.additional}
- Vulnerability Score: ${contextData.score}/5 (${contextData.riskInfo.label})

REQUIRED STRUCTURED JSON SCHEMA:
{
  "reported_symptoms_summary": "string",
  "triage_urgency": "Emergency | Urgent Care | Routine Evaluation | Self-Care",
  "possible_conditions": [
    {
      "condition": "string",
      "likelihood": "High | Moderate | Low",
      "rationale": "string",
      "matched_symptoms": ["string"]
    }
  ],
  "follow_up_questions": [
    {
      "question": "string",
      "clinical_reason": "string"
    }
  ],
  "medical_attention_guidance": {
    "urgency": "string",
    "self_care_recommendations": ["string"],
    "immediate_escalation_triggers": ["string"]
  },
  "safety_disclaimer": "This is an informational AI analysis and not a medical diagnosis. Consult a licensed healthcare professional."
}`;
}

// Module 6, 7 & 8: Analysis, Question & Safety Modules
function runClinicalAnalysis(profile, symptomData, contextData) {
  const sympSet = new Set(symptomData.identifiedSymptoms.map(s => s.toLowerCase()));
  const scored = [];

  // Emergency red-flag evaluation
  const rawCombined = (profile.symptoms + " " + profile.additional).toLowerCase();
  const detectedRedFlags = [];
  for (const rf of RED_FLAG_TRIGGERS) {
    if (rawCombined.includes(rf.trigger)) {
      detectedRedFlags.push(rf.detail);
    }
  }

  // Condition differential matching
  for (const item of DIFFERENTIAL_DATABASE) {
    let matches = 0;
    const matchedTerms = [];
    for (const keySymp of item.key_symptoms) {
      if (sympSet.has(keySymp) || rawCombined.includes(keySymp)) {
        matches++;
        matchedTerms.push(keySymp);
      }
    }

    if (matches > 0) {
      let score = matches * 2.0;
      if (item.urgencyLevel === "emergency" && (profile.severity === "Critical" || detectedRedFlags.length > 0)) {
        score += 6.0;
      }
      scored.push({
        condition: item.condition,
        category: item.category,
        matchedSymptoms: matchedTerms,
        score: score,
        rationale: item.rationale,
        urgency: item.urgency,
        urgencyLevel: item.urgencyLevel
      });
    }
  }

  scored.sort((a, b) => b.score - a.score);
  let topConditions = scored.slice(0, 3);

  if (topConditions.length === 0) {
    topConditions = [
      {
        condition: "Non-specific Viral Prodrome / General Malaise",
        category: "constitutional",
        matchedSymptoms: symptomData.identifiedSymptoms,
        score: 1.0,
        rationale: "Symptoms are non-specific and commonly accompany mild viral infections or transient physiological fatigue.",
        urgency: "Routine Self-Care & Monitoring",
        urgencyLevel: "routine"
      }
    ];
  }

  // Determine Likelihoods
  const conditions = topConditions.map((c, idx) => {
    let likelihood = "Low";
    if (idx === 0 && c.score >= 3.5) likelihood = "High";
    else if (c.score >= 2.0) likelihood = "Moderate";
    return {
      condition: c.condition,
      likelihood: likelihood,
      rationale: c.rationale,
      matchedSymptoms: c.matchedSymptoms
    };
  });

  // Triage determination
  let triage = {
    level: "Routine Self-Care & Monitoring",
    code: "routine",
    badgeClass: "badge-offline",
    title: "Clinical Triage: Routine Evaluation & Self-Care",
    description: "Symptoms are consistent with a mild or standard acute presentation. Conservative self-care and monitoring are advised.",
    borderColor: "var(--primary)"
  };

  if (detectedRedFlags.length > 0 || profile.severity === "Critical") {
    triage = {
      level: "EMERGENCY HOSPITAL CARE REQUIRED",
      code: "emergency",
      badgeClass: "badge-tag",
      title: "🚨 EMERGENCY ALERT: Seek Immediate Emergency Care",
      description: "Critical red-flag symptoms detected. Do NOT wait. Call 911 / 112 or proceed immediately to the nearest Emergency Room.",
      borderColor: "var(--danger)"
    };
  } else if (profile.severity === "Severe" || contextData.score >= 4) {
    triage = {
      level: "Urgent Medical Care (Within 12-24 Hours)",
      code: "urgent",
      badgeClass: "badge-tag",
      title: "⚠️ Urgent In-Person Medical Evaluation Recommended",
      description: "Significant symptom intensity or clinical vulnerability identified. Priority evaluation at an urgent care clinic is advised.",
      borderColor: "var(--warning)"
    };
  }

  // Follow-up questions
  const questions = [];
  const sympsLower = symptomData.identifiedSymptoms.join(" ").toLowerCase();
  
  if (sympsLower.includes("fever") || sympsLower.includes("chills")) {
    questions.push({
      question: "What is your highest measured body temperature, and does it reduce with fever medications like acetaminophen/paracetamol?",
      clinicalReason: "Differentiates mild viral pyrexia from high-grade bacterial or systemic infection."
    });
  }

  if (sympsLower.includes("cough") || sympsLower.includes("phlegm") || sympsLower.includes("congestion")) {
    questions.push({
      question: "Is your cough completely dry, or are you coughing up thick clear, yellow, or greenish sputum?",
      clinicalReason: "Helps assess potential bacterial superinfection or lower bronchial involvement."
    });
  }

  if (sympsLower.includes("headache") || sympsLower.includes("migraine")) {
    questions.push({
      question: "Did the headache onset abruptly like a 'thunderclap', and is it accompanied by severe neck stiffness or confusion?",
      clinicalReason: "Screens for neurological red-flags like subarachnoid hemorrhage or meningitis."
    });
  }

  if (sympsLower.includes("chest") || sympsLower.includes("breath")) {
    questions.push({
      question: "Does the chest pain change with deep breathing, exertion, or position, or radiate into your jaw or arm?",
      clinicalReason: "Distinguishes musculoskeletal/pleuritic chest pain from ischemic coronary syndrome."
    });
  }

  if (sympsLower.includes("nausea") || sympsLower.includes("diarrhea") || sympsLower.includes("vomiting")) {
    questions.push({
      question: "Are you maintaining fluid intake, and have you noticed decreased urination, dark urine, or extreme dry mouth?",
      clinicalReason: "Monitors acute dehydration risks and fluid electrolyte depletion."
    });
  }

  questions.push({
    question: `Have your symptoms worsened, stabilized, or improved during the ${profile.duration} timeframe?`,
    clinicalReason: "Evaluates the disease trajectory and response to natural immune clearance."
  });

  // Supportive self-care & escalation triggers
  let selfCare = [
    "Maintain adequate oral hydration with water, herbal teas, or electrolyte solutions.",
    "Ensure sufficient physical rest (8+ hours of sleep) to support cellular recovery.",
    "Monitor vital signs (temperature, pulse) twice daily and record changes."
  ];

  let escalationTriggers = [
    "Development of severe shortness of breath or persistent chest pressure.",
    "Fever exceeding 103°F (39.4°C) or fever lasting more than 3 consecutive days.",
    "Confusion, severe dizziness, inability to keep fluids down, or fainting.",
    "Rapid worsening of symptoms or development of a new spreading rash."
  ];

  if (triage.code === "emergency") {
    selfCare = [
      "Keep patient seated in an upright, comfortable position.",
      "Loosen restrictive collars, neckties, or tight waistbands.",
      "Stay calm and avoid any physical exertion while waiting for emergency services."
    ];
    escalationTriggers = [
      "Loss of consciousness or unresponsiveness.",
      "Cyanosis (bluish tint around lips, face, or fingernails).",
      "Severe crushing chest pain radiating to left arm, neck, or back."
    ];
  }

  return {
    triage,
    detectedRedFlags,
    conditions,
    questions: questions.slice(0, 4),
    selfCare,
    escalationTriggers
  };
}

// Module 9: Save Module (Formatting JSON & Markdown)
function generateMarkdownReport(profile, symptomData, contextData, analysisResult) {
  const p = profile;
  const s = symptomData;
  const c = contextData;
  const a = analysisResult;

  let md = `# MEDICAL SYMPTOM ASSISTANT CLINICAL ANALYSIS REPORT
**Case ID:** ${p.caseId}  
**Date & Time:** ${p.timestamp}  
**Triage Urgency:** ${a.triage.level}  

---

## 1. PATIENT INTAKE & PROFILE
- **Age:** ${p.age} years (${p.ageCohort})
- **Biological Sex:** ${p.sex}
- **Reported Symptoms:** ${p.symptoms}
- **Duration:** ${p.duration}
- **Reported Severity:** ${p.severity}
- **Medical History:** ${p.history}
- **Current Medications:** ${p.medications}
- **Known Allergies:** ${p.allergies}
- **Additional Information:** ${p.additional}

## 2. EXTRACTED CLINICAL SYMPTOMS
- **Identified Entities:** ${s.identifiedSymptoms.join(", ")}
- **Organ Systems:** ${Object.values(s.organSystems).map(o => o.name).join(", ")}

## 3. CONTEXT & RISK ANALYSIS
- **Vulnerability Score:** ${c.score} / 5 (${c.riskInfo.label})
- **Identified Modifiers:**
${c.modifiers.map(m => `  - ${m}`).join("\n")}

## 4. POSSIBLE ASSOCIATED CONDITIONS CONSIDERED
`;

  a.conditions.forEach((cond, idx) => {
    md += `### ${idx + 1}. ${cond.condition} [${cond.likelihood} Likelihood]\n`;
    md += `- **Rationale:** ${cond.rationale}\n`;
    md += `- **Matched Symptoms:** ${cond.matchedSymptoms.join(", ")}\n\n`;
  });

  md += `## 5. RECOMMENDED CLINICAL FOLLOW-UP QUESTIONS\n`;
  a.questions.forEach((q, idx) => {
    md += `${idx + 1}. **${q.question}**\n   *(Clinical Rationale: ${q.clinicalReason})*\n`;
  });

  md += `\n## 6. MEDICAL ATTENTION GUIDANCE & ACTION PLAN\n`;
  md += `### Supportive Self-Care:\n`;
  a.selfCare.forEach(sc => {
    md += `- ${sc}\n`;
  });

  md += `\n### Immediate Medical Escalation Triggers:\n`;
  a.escalationTriggers.forEach(et => {
    md += `- ⚠️ ${et}\n`;
  });

  if (a.detectedRedFlags.length > 0) {
    md += `\n### 🚨 CRITICAL RED-FLAG WARNINGS:\n`;
    a.detectedRedFlags.forEach(rf => {
      md += `- **${rf}**\n`;
    });
  }

  md += `\n---\n## OFFICIAL SAFETY DISCLAIMER\n`;
  md += `> **NOT A MEDICAL DIAGNOSIS:** This artificial intelligence analysis is provided for informational and educational purposes only. It does not constitute a clinical diagnosis, medical advice, or treatment plan. Always consult a licensed physician or medical professional for diagnosis and treatment. In an emergency, dial 911 or 112 immediately.`;

  return md;
}

// ==============================================================================
// 5. DOM RENDERING & UI UPDATES
// ==============================================================================
function renderUI(profile, symptomData, contextData, promptText, analysisResult) {
  // 1. Red Flag Banner
  const redBanner = document.getElementById("redFlagBanner");
  const redDetails = document.getElementById("redFlagDetails");
  if (analysisResult.detectedRedFlags.length > 0) {
    redBanner.style.display = "flex";
    redDetails.innerHTML = `<strong>Critical Red Flags Detected:</strong> ${analysisResult.detectedRedFlags.join("; ")}. Please seek urgent hospital medical care immediately (call 911 / 112).`;
  } else {
    redBanner.style.display = "none";
  }

  // 2. Tab 3: Symptom Extraction
  document.getElementById("rawSymptomDisplay").textContent = `"${profile.symptoms}"`;
  const chipContainer = document.getElementById("symptomChipsContainer");
  chipContainer.innerHTML = "";
  symptomData.identifiedSymptoms.forEach(symp => {
    const chip = document.createElement("div");
    chip.className = "symptom-tag";
    chip.innerHTML = `<span>✓</span> ${symp}`;
    chipContainer.appendChild(chip);
  });

  const sysContainer = document.getElementById("systemsContainer");
  sysContainer.innerHTML = "";
  Object.values(symptomData.organSystems).forEach(sys => {
    const card = document.createElement("div");
    card.className = "symptom-category-card";
    card.innerHTML = `
      <div class="symptom-category-title">
        <span>${sys.icon}</span> ${sys.name}
      </div>
      <div style="font-size: 0.88rem; color: var(--text-secondary);">
        Correlated Terms: <strong>${sys.matched.join(", ")}</strong>
      </div>
    `;
    sysContainer.appendChild(card);
  });

  // 3. Tab 4: Context & Risk
  const vulnScoreDisplay = document.getElementById("vulnScoreDisplay");
  const vulnScoreDesc = document.getElementById("vulnScoreDesc");
  vulnScoreDisplay.textContent = `${contextData.score} / 5`;
  const riskBadge = document.getElementById("riskBadge");
  riskBadge.textContent = contextData.riskInfo.label;
  riskBadge.className = contextData.riskInfo.class;

  const descMap = {
    1: "Minimal vulnerability. Patient is an adult with no identified chronic comorbidities.",
    2: "Mild vulnerability. Baseline health is stable with mild acute symptoms.",
    3: "Moderate vulnerability. Comorbidities or extended symptom duration require monitoring.",
    4: "Elevated vulnerability. Marked symptom intensity or comorbidity interaction alert.",
    5: "High / Urgent vulnerability. Critical severity or high-risk demographic interaction."
  };
  vulnScoreDesc.textContent = descMap[contextData.score];

  document.getElementById("comorbiditiesDisplay").textContent = contextData.comorbidities.length > 0
    ? `Pre-existing conditions identified: ${contextData.comorbidities.join(", ")}.`
    : "No major pre-existing chronic conditions reported in medical history.";

  document.getElementById("allergyDisplay").textContent = contextData.hasAllergies
    ? `Allergies on file: ${profile.allergies}. Caution advised against allergen triggers.`
    : "No known drug or environmental allergies reported.";

  const modUl = document.getElementById("contextModifiersList");
  modUl.innerHTML = "";
  if (contextData.modifiers.length > 0) {
    contextData.modifiers.forEach(m => {
      const li = document.createElement("li");
      li.textContent = m;
      modUl.appendChild(li);
    });
  } else {
    modUl.innerHTML = "<li>No adverse contextual risk modifiers detected.</li>";
  }

  // 4. Tab 5: Prompt Preview
  document.getElementById("promptPreview").textContent = promptText;

  // 5. Tab 6: Raw Engine Output
  const rawPayload = {
    case_id: profile.caseId,
    timestamp: profile.timestamp,
    patient_intake: {
      demographics: { age: profile.age, sex: profile.sex, cohort: profile.ageCohort },
      reported_symptoms: profile.symptoms,
      duration: profile.duration,
      severity: profile.severity,
      medical_history: profile.history,
      allergies: profile.allergies
    },
    nlp_symptoms: symptomData.identifiedSymptoms,
    vulnerability_score: contextData.score,
    differential_analysis: analysisResult.conditions,
    follow_up_questions: analysisResult.questions,
    triage_guidance: {
      urgency_level: analysisResult.triage.level,
      self_care: analysisResult.selfCare,
      triggers: analysisResult.escalationTriggers
    },
    safety_disclaimer: "Informational AI analysis only. Not a medical diagnosis."
  };
  document.getElementById("rawEngineOutput").textContent = JSON.stringify(rawPayload, null, 2);

  // 6. Tab 7: Clinical Analysis
  const triageCard = document.getElementById("triageCard");
  const triageTitle = document.getElementById("triageTitle");
  const triageBadge = document.getElementById("triageBadge");
  const triageDesc = document.getElementById("triageDescription");

  triageCard.style.borderLeftColor = analysisResult.triage.borderColor;
  triageTitle.innerHTML = `<span>🩺</span> ${analysisResult.triage.title}`;
  triageBadge.textContent = analysisResult.triage.level;
  triageBadge.className = analysisResult.triage.badgeClass;
  triageDesc.textContent = analysisResult.triage.description;

  const condList = document.getElementById("conditionsList");
  condList.innerHTML = "";
  analysisResult.conditions.forEach(c => {
    const card = document.createElement("div");
    card.className = "condition-card";
    const pillClass = c.likelihood === "High" ? "likelihood-high" : c.likelihood === "Moderate" ? "likelihood-moderate" : "likelihood-low";
    card.innerHTML = `
      <div class="condition-top">
        <div class="condition-name">${c.condition}</div>
        <span class="likelihood-pill ${pillClass}">${c.likelihood} Likelihood</span>
      </div>
      <p style="font-size: 0.88rem; color: var(--text-secondary); margin-bottom: 0.5rem;">
        <strong>Clinical Rationale:</strong> ${c.rationale}
      </p>
      <div style="font-size: 0.82rem; color: var(--text-muted);">
        Matched Symptoms: <strong>${c.matchedSymptoms.join(", ")}</strong>
      </div>
    `;
    condList.appendChild(card);
  });

  const qList = document.getElementById("questionsList");
  qList.innerHTML = "";
  analysisResult.questions.forEach((q, idx) => {
    const item = document.createElement("div");
    item.className = "question-item";
    item.innerHTML = `
      <div class="question-q-icon">${idx + 1}</div>
      <div>
        <div class="question-text">${q.question}</div>
        <div class="question-why">Clinical Rationale: ${q.clinicalReason}</div>
      </div>
    `;
    qList.appendChild(item);
  });

  const selfCareUl = document.getElementById("selfCareList");
  selfCareUl.innerHTML = "";
  analysisResult.selfCare.forEach(sc => {
    const li = document.createElement("li");
    li.textContent = sc;
    selfCareUl.appendChild(li);
  });

  const trigUl = document.getElementById("triggersList");
  trigUl.innerHTML = "";
  analysisResult.escalationTriggers.forEach(et => {
    const li = document.createElement("li");
    li.textContent = et;
    trigUl.appendChild(li);
  });

  // 7. Tab 8: Reports & Export
  document.getElementById("reportCaseId").textContent = profile.caseId;
  document.getElementById("reportTimestamp").textContent = profile.timestamp;
  document.getElementById("reportTriageLevel").textContent = analysisResult.triage.level;
  document.getElementById("reportSymptomsSummary").textContent = symptomData.identifiedSymptoms.join(", ");
  document.getElementById("reportSafetyStatus").textContent = analysisResult.detectedRedFlags.length > 0 ? "RED FLAG ACTIVE" : "Cleared";

  const md = generateMarkdownReport(profile, symptomData, contextData, analysisResult);
  document.getElementById("markdownPreview").textContent = md;
}

// ==============================================================================
// 6. PIPELINE ORCHESTRATION & EVENT HANDLERS
// ==============================================================================
function runPipeline() {
  const profile = buildPatientProfile();
  const symptomData = extractSymptoms(profile);
  const contextData = analyzeContext(profile, symptomData);
  const promptText = generatePrompt(profile, symptomData, contextData);
  const analysisResult = runClinicalAnalysis(profile, symptomData, contextData);

  currentCase = { profile, symptomData, contextData, promptText };
  currentResult = analysisResult;

  renderUI(profile, symptomData, contextData, promptText, analysisResult);
}

// Preset Loader
function loadPreset(key) {
  const p = CLINICAL_PRESETS[key];
  if (!p) return;

  document.getElementById("patientAge").value = p.age;
  document.getElementById("patientSex").value = p.sex;
  document.getElementById("symptomDuration").value = p.duration;
  document.getElementById("symptomText").value = p.symptoms;

  const sevRadios = document.getElementsByName("severity");
  for (const r of sevRadios) {
    r.checked = (r.value === p.severity);
  }

  document.getElementById("medHistory").value = p.history;
  document.getElementById("currentMeds").value = p.medications;
  document.getElementById("allergies").value = p.allergies;
  document.getElementById("additionalInfo").value = p.additional;

  showToast(`Loaded Preset: ${key.toUpperCase()}`);
  runPipeline();
}

// Toast Helper
function showToast(msg) {
  const toast = document.getElementById("toastMsg");
  toast.textContent = msg;
  toast.style.display = "block";
  setTimeout(() => {
    toast.style.display = "none";
  }, 2500);
}

// File Download Helper
function downloadFile(content, fileName, contentType) {
  const a = document.createElement("a");
  const file = new Blob([content], { type: contentType });
  a.href = URL.createObjectURL(file);
  a.download = fileName;
  a.click();
  URL.revokeObjectURL(a.href);
}

// Navigation Tabs
function switchTab(tabId) {
  document.querySelectorAll(".step-tab").forEach(tab => {
    if (tab.getAttribute("data-tab") === tabId) {
      tab.classList.add("active");
    } else {
      tab.classList.remove("active");
    }
  });

  document.querySelectorAll(".tab-content").forEach(content => {
    if (content.id === tabId) {
      content.classList.add("active");
    } else {
      content.classList.remove("active");
    }
  });

  window.scrollTo({ top: 0, behavior: "smooth" });
}

// ==============================================================================
// 7. INITIALIZATION
// ==============================================================================
document.addEventListener("DOMContentLoaded", () => {
  // Tab click listeners
  document.querySelectorAll(".step-tab").forEach(tab => {
    tab.addEventListener("click", () => {
      const tabId = tab.getAttribute("data-tab");
      switchTab(tabId);
    });
  });

  // Presets buttons
  document.querySelectorAll(".preset-chip").forEach(chip => {
    chip.addEventListener("click", () => {
      const presetKey = chip.getAttribute("data-preset");
      loadPreset(presetKey);
      switchTab("tab-analysis");
    });
  });

  // Analyze Button
  document.getElementById("analyzeBtn").addEventListener("click", () => {
    runPipeline();
    showToast("Symptoms Analyzed & Triage Generated!");
    switchTab("tab-analysis");
  });

  // Quick Demo Button
  document.getElementById("quickDemoBtn").addEventListener("click", () => {
    loadPreset("respiratory");
    switchTab("tab-analysis");
  });

  // Reset Form Button
  document.getElementById("clearFormBtn").addEventListener("click", () => {
    document.getElementById("patientForm").reset();
    document.getElementById("patientAge").value = 25;
    document.getElementById("symptomDuration").value = "1 day";
    document.getElementById("symptomText").value = "";
    document.getElementById("medHistory").value = "None reported";
    document.getElementById("currentMeds").value = "None";
    document.getElementById("allergies").value = "None";
    document.getElementById("additionalInfo").value = "None";
    showToast("Form cleared.");
  });

  // Copy Prompt
  document.getElementById("copyPromptBtn").addEventListener("click", () => {
    const text = document.getElementById("promptPreview").textContent;
    navigator.clipboard.writeText(text).then(() => {
      showToast("Clinical Prompt copied to clipboard!");
    });
  });

  // Download JSON
  document.getElementById("downloadJsonBtn").addEventListener("click", () => {
    if (!currentCase) runPipeline();
    const payload = document.getElementById("rawEngineOutput").textContent;
    downloadFile(payload, `${currentCase.profile.caseId}_analysis.json`, "application/json");
    showToast("JSON report downloaded!");
  });

  // Download Markdown
  document.getElementById("downloadMdBtn").addEventListener("click", () => {
    if (!currentCase) runPipeline();
    const md = document.getElementById("markdownPreview").textContent;
    downloadFile(md, `${currentCase.profile.caseId}_analysis.md`, "text/markdown");
    showToast("Markdown report downloaded!");
  });

  // Print PDF
  document.getElementById("printReportBtn").addEventListener("click", () => {
    window.print();
  });

  // Copy Lab Record Tables
  document.getElementById("copyLabTablesBtn").addEventListener("click", () => {
    const labContent = `COURSE: 24CS2506 - Building Applications using GPT-4
EXPERIMENT 6: AI-POWERED MEDICAL SYMPTOM ASSISTANT USING GPT-4

Aim:
To develop an AI-powered medical symptom assistant using GPT-4 that analyzes user-reported symptoms, identifies possible associated conditions, generates relevant follow-up questions and provides general guidance regarding professional medical attention.

Problem Statement:
Design and develop an AI-powered medical symptom assistant using GPT-4. The application should collect basic user information and symptoms, analyze the reported symptoms, identify possible conditions, generate follow-up questions and present the results in a structured format. The system should include appropriate safety instructions and clearly state that the generated output is not a medical diagnosis.

Software Requirements:
- Python: 3.11.x
- Ollama: 0.3.x
- VS Code: 1.90.x
- Pandas: 2.2.x
- Sentence Transformers: 3.0.x

Input Parameters:
- Age: Age of patient to evaluate age cohort vulnerability
- Sex: Biological sex for physiological differential correlation
- Symptoms: Free-text descriptions of reported symptoms
- Duration: Time elapsed since symptom onset
- Severity: Patient-rated intensity (Mild, Moderate, Severe, Critical)
- Medical History: Pre-existing chronic illnesses
- Medication: Currently prescribed pharmaceuticals
- Allergies: Known drug and allergen sensitivities
- Additional Information: Contextual lifestyle, stress, exposure, and travel

Module Design:
1. Input Module: Collects patient demographics and symptoms
2. Profile Module: Validates and structures patient schema
3. Symptom Module: Extracts and normalizes clinical symptoms
4. Context Module: Evaluates comorbidity interactions and risk
5. Prompt Module: Generates clinical prompt with guardrails
6. Analysis Module: Differential condition reasoning
7. Question Module: Generates clinical follow-up questions
8. Safety Module: Emergency red-flag detection and disclaimers
9. Save Module: Exports JSON, Markdown, and PDF reports
10. Main Module: End-to-end orchestration and execution

Result:
Thus, an AI-powered medical symptom assistant using GPT-4 was successfully developed.`;

    navigator.clipboard.writeText(labContent).then(() => {
      showToast("Lab Record text copied to clipboard!");
    });
  });

  // Engine Mode Toggle (Offline vs API)
  const engineSelect = document.getElementById("engineModeSelect");
  const apiPanel = document.getElementById("apiConfigPanel");
  engineSelect.addEventListener("change", (e) => {
    if (e.target.value === "api") {
      apiPanel.style.display = "block";
    } else {
      apiPanel.style.display = "none";
    }
  });

  // Theme Toggle
  const themeBtn = document.getElementById("themeToggleBtn");
  const themeLabel = document.getElementById("themeLabel");
  let currentTheme = localStorage.getItem("medisense_theme") || "dark";
  if (currentTheme === "light") {
    document.documentElement.setAttribute("data-theme", "light");
    themeLabel.textContent = "Light";
  }

  themeBtn.addEventListener("click", () => {
    currentTheme = currentTheme === "dark" ? "light" : "dark";
    if (currentTheme === "light") {
      document.documentElement.setAttribute("data-theme", "light");
      themeLabel.textContent = "Light";
    } else {
      document.documentElement.removeAttribute("data-theme");
      themeLabel.textContent = "Dark";
    }
    localStorage.setItem("medisense_theme", currentTheme);
  });

  // Initial Run
  runPipeline();
});
