import { GoogleGenAI, Type } from '@google/genai';

let geminiClient: GoogleGenAI | null = null;

export function getGemini(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!geminiClient && apiKey) {
    geminiClient = new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return geminiClient;
}

export interface GenerateLetterParams {
  scenario?: string;
  recipientName?: string;
  recipientRole?: string;
  recipientRelation?: string;
  userPerspective?: string;
  tone?: string;
  jargonLevel?: 'moderate' | 'heavy' | 'maximum';
  enforceLength?: boolean;
  senderName?: string;
  senderTitle?: string;
  companyName?: string;
  customDemands?: string;
  keyDates?: string;
}

export async function handleGenerateLetter(params: GenerateLetterParams) {
  const {
    scenario = 'resignation',
    recipientName = '[Recipient Name]',
    recipientRole = 'Direct Supervisor / Department Head',
    recipientRelation = 'Manager / Boss',
    userPerspective = 'Frustrated with lack of respect, micromanagement, and broken commitments, but must remain composed and strictly neutral.',
    tone = 'Ultra-Corporate & Neutral',
    jargonLevel = 'heavy',
    enforceLength = true,
    senderName = '[Sender Name]',
    senderTitle = '[Sender Title]',
    companyName = 'Vanguard Strategic Holdings',
    customDemands = '',
    keyDates = '[Effective Date / Two Weeks Notice]',
  } = params;

  const ai = getGemini();

  const jargonInstructions =
    jargonLevel === 'maximum'
      ? 'Use saturated corporate buzzwords and high-synergy enterprise vernacular (e.g., bandwidth realignment, proactive decoupling, paradigm shift, operational cadence, core competency reallocation, human capital restructuring, stakeholder consensus, cross-functional continuity).'
      : jargonLevel === 'heavy'
        ? 'Infuse authentic high-level corporate jargon (bandwidth constraints, operational realignment, seamless transition matrix, strategic offboarding, knowledge transfer stewardship, mutual deliverables).'
        : 'Maintain polished, diplomatic, boardroom-ready corporate phrasing.';

  const lengthRule = enforceLength
    ? 'CRITICAL BEHAVIORAL RULE FROM ROLE CARD: The body text MUST strictly be under 100-150 words. Do not ramble. Keep it concise, punchy, and professional.'
    : 'Keep the letter concise and structured within 150-200 words.';

  const systemPrompt = `You are a specialized Corporate Workplace Ghostwriter operating under strict behavioral rules from the "Resignation Letter Ghostwriter" Role Card:
1. PURPOSE: Help the user draft workplace correspondence (resignation to boss, client transition notification, corporate handover) fully adopting the user's perspective.
2. EMPATHY & PERSPECTIVE: The user may be experiencing mistreatment, burnout, micromanagement, or corporate shifts. Validate their feelings silently and convert their genuine grievance into impenetrable, neutral corporate diplomacy.
3. BEHAVIORAL RULES:
   - ${lengthRule}
   - ABSOLUTELY NO CUSS WORDS or unprofessional outbursts.
   - MAINTAIN STRICT CORPORATE NEUTRALITY. Do not sound overtly aggressive or apologetic.
   - HEAVY CORPORATE JARGON: The user specifically requested: "make them feel more corporate and use a bunch of jargon."
   - EDITABLE PLACEHOLDERS: Use bracketed uppercase placeholders for dynamic values like [Recipient Name], [Recipient Title], [Effective Date], [Transition Period], [Sender Name], [Sender Title], [Company Name], [Project / Client Account], [Knowledge Transfer Lead], etc.
   - TAILOR TO RECIPIENT: Explicitly tailor tone to the recipient's role (${recipientRole}) and their relationship to the user (${recipientRelation}).
4. BOUNDARIES: The user is in charge of direction. Do not invent contradictory personal details. Provide a polished corporate letter suitable for formal letterhead.`;

  const userPrompt = `Draft a workplace letter with the following parameters:
- Scenario: ${scenario}
- Recipient Name: ${recipientName}
- Recipient Title/Role: ${recipientRole}
- Relation to Sender: ${recipientRelation}
- Sender Name: ${senderName} (${senderTitle})
- Company: ${companyName}
- Key Dates / Transition: ${keyDates}
- User's Unfiltered Perspective / Context: "${userPerspective}"
- Specific Demands/Terms: "${customDemands || 'Standard transition of active deliverables'}"
- Tone: ${tone}
- Jargon Directive: ${jargonInstructions}

Return a JSON object matching this schema:
{
  "subjectLine": "Formal subject line (e.g. Formal Notice of Transition: [Sender Name] // Operational Decoupling)",
  "letterBody": "The full body text of the letter with editable placeholders in brackets [Like This]. Ensure it strictly meets word count constraints and starts with formal salutation Dear [Recipient Name], and ends with formal signoff Sincerely, [Sender Name].",
  "placeholders": ["List of all detected bracketed placeholder strings like [Recipient Name], [Effective Date]"],
  "wordCount": 125,
  "corporateHighlights": ["3-4 corporate jargon highlights used and their strategic purpose"],
  "adviceNote": "A brief empathetic note validating the user perspective and explaining how the corporate jargon protects their professional standing."
}`;

  if (ai) {
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: userPrompt,
        config: {
          systemInstruction: systemPrompt,
          responseMimeType: 'application/json',
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              subjectLine: { type: Type.STRING },
              letterBody: { type: Type.STRING },
              placeholders: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
              },
              wordCount: { type: Type.NUMBER },
              corporateHighlights: {
                type: Type.ARRAY,
                items: { type: Type.STRING },
              },
              adviceNote: { type: Type.STRING },
            },
            required: [
              'subjectLine',
              'letterBody',
              'placeholders',
              'wordCount',
              'corporateHighlights',
              'adviceNote',
            ],
          },
        },
      });

      const parsed = JSON.parse(response.text || '{}');
      return { success: true, ...parsed };
    } catch (apiErr) {
      console.warn('Gemini API call failed, using intelligent template fallback:', apiErr);
      // Fall through to fallback
    }
  }

  // Robust Rule-Based Fallback Generator (Guarantees zero downtime on Vercel if API key is not yet set)
  return createFallbackLetter(params);
}

export function createFallbackLetter(params: GenerateLetterParams) {
  const {
    scenario = 'resignation',
    recipientName = '[Recipient Name]',
    recipientRole = 'Direct Supervisor / Department Head',
    recipientRelation = 'Manager / Boss',
    userPerspective = '',
    jargonLevel = 'heavy',
    senderName = '[Sender Name]',
    senderTitle = '[Sender Title]',
    companyName = 'Vanguard Strategic Holdings',
    keyDates = '[Effective Departure Date]',
  } = params;

  let body = '';
  let subject = '';
  let highlights: string[] = [];

  if (scenario === 'client_transition') {
    subject = `Executive Notice of Account Leadership Realignment: [Client Account] // Strategic Continuity`;
    body = `Dear ${recipientName},

Please accept this correspondence as formal notification of an executive portfolio realignment regarding [Client Account / Project Milestone] at ${companyName}, effective ${keyDates}.

To guarantee uninterrupted continuity and accelerate high-velocity deliverables across your strategic milestones, I am orchestrating a comprehensive knowledge-transfer matrix. I will be collaborating closely with [Designated Successor / Team Lead], who brings deep domain acumen to stewardship of our joint roadmap.

Our team remains steadfastly aligned with your enterprise KPIs. We will finalize all active sprint artifacts prior to my strategic transition.

Sincerely,

${senderName}
${senderTitle}
${companyName}`;
    highlights = [
      'Portfolio realignment: Frames personnel transition as proactive resource optimization.',
      'Knowledge-transfer matrix: Reassures client of zero account disruption.',
      'High-velocity deliverables: Reaffirms commitment to client milestones.',
    ];
  } else if (scenario === 'project_pivot') {
    subject = `Formal Stakeholder Notice: Scope Realignment & Operational Cadence Optimization`;
    body = `Dear ${recipientName},

Following a strategic diagnostic of our current initiative bandwidth and deliverable commitments at ${companyName}, I am formally initiating an operational scope realignment, effective ${keyDates}.

To safeguard core value creation and mitigate workstream friction, we are reallocating technical resources toward primary milestones. I am coordinating directly with [Designated Successor / Team Lead] to synchronize stakeholder expectations and institute an airtight knowledge-transfer protocol.

This calibrated prioritization guarantees that our essential outcomes are achieved without compromising deliverable integrity. Thank you for your continued cross-functional alignment.

Sincerely,

${senderName}
${senderTitle}
${companyName}`;
    highlights = [
      'Strategic diagnostic: Objectively establishes necessity of boundary setting.',
      'Mitigate workstream friction: Defuses interpersonal debate through operational jargon.',
      'Cross-functional alignment: Reinforces enterprise composure.',
    ];
  } else {
    // Standard resignation
    subject = `Formal Notice of Operational Realignment: ${senderName} // Strategic Transition`;
    body = `Dear ${recipientName},

Please accept this correspondence as formal notification of my operational realignment and conclusion of tenure as ${senderTitle} at ${companyName}, effective ${keyDates}.

Following an exhaustive evaluation of organizational workstreams and my current professional bandwidth, I have elected to pivot toward an alternative strategic trajectory. To guarantee uninterrupted continuity across all active client deliverables and mission-critical milestones, I am fully committed to executing a rigorous knowledge-transfer matrix through [Transition Period / Two Weeks Notice].

I will coordinate closely with [Designated Successor / Team Lead] to catalog core workflow repositories and optimize cross-functional handoffs prior to departure. I acknowledge the collaborative touchpoints established throughout my tenure and wish the enterprise continued cross-functional velocity.

Sincerely,

${senderName}
${senderTitle}
${companyName}`;
    highlights = [
      'Operational realignment: Replaces quitting with objective strategic restructuring.',
      'Bandwidth evaluation: Neutralizes grievances into professional capacity prioritization.',
      'Knowledge-transfer matrix: Guarantees complete diligence and client protection.',
      'Cross-functional velocity: Sterile boardroom composure with zero room for critique.',
    ];
  }

  const words = body.trim().split(/\s+/).length;
  const detectedPlaceholders = Array.from(new Set(body.match(/\[[^\]]+\]/g) || []));

  return {
    success: true,
    subjectLine: subject,
    letterBody: body,
    placeholders: detectedPlaceholders,
    wordCount: words,
    corporateHighlights: highlights,
    adviceNote:
      'Crafted strictly according to the Role Card (under 150 words, neutral tone, zero profanity). High-density corporate jargon converts your perspective into bulletproof professional diplomacy.',
  };
}

export async function handleChatAssistant(messages: any[], currentDraft: string, userContext: any) {
  const ai = getGemini();

  const systemPrompt = `You are an empathetic workplace Ghostwriter Assistant helping the user draft and refine a corporate letter (such as a resignation letter to an unfair boss or a client transition notice).
Refer directly to the "RESIGNATION LETTER GHOSTWRITER" Role Card:
- User Perspective: The user often feels undervalued, mistreated, or burnt out, but needs to remain impeccably composed and neutral in written corporate form.
- Your Persona: Warm, validating, insightful, perceptive, and an expert in high-stakes corporate bureaucracy.
- Interaction Loop: Ask targeted follow-up questions to understand the exact situation (why leaving, relationship with recipient, exit timeline, specific concessions or handover demands), accommodate vague or emotional inputs, and offer concrete suggestions to turn emotional frustration into airtight corporate jargon.
- Behavioral Rules: Under 100-150 words for letters, zero profanity, neutral tone.
- When suggesting drafts or revisions, always wrap editable placeholders in brackets [Like This]. Keep your conversational responses concise (under 120 words), actionable, and supportive.`;

  if (ai) {
    try {
      const conversationHistory = messages.map((m: any) => `${m.role.toUpperCase()}: ${m.content}`).join('\n\n');
      const prompt = `Current Letter Draft:\n"""\n${currentDraft || 'No draft yet'}\n"""\n\nUser Context:\n${JSON.stringify(userContext || {})}\n\nConversation:\n${conversationHistory}\n\nProvide the next helpful ghostwriter response. If you are proposing an updated letter draft, include it clearly delineated with [DRAFT_START] and [DRAFT_END].`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          systemInstruction: systemPrompt,
        },
      });

      return { reply: response.text || '' };
    } catch (err) {
      console.warn('Gemini chat failed, using fallback response:', err);
    }
  }

  return {
    reply:
      "I hear you completely. When leadership fails to acknowledge your contributions, leaving with unshakeable professional composure is the ultimate power move. Let's frame your message so they cannot find a single flaw to critique.\n\nWould you like me to dial up the corporate jargon further—for instance, framing your exit as an 'executive bandwidth reallocation'—or would you like to specify a firm handover date?",
  };
}

export async function handleJargonBoost(text: string, level: string = 'heavy') {
  const ai = getGemini();

  if (ai && text) {
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: `Rewrite this sentence or paragraph into heavy, elegant corporate jargon and enterprise diplomacy. Keep all bracketed placeholders intact (e.g. [Date], [Name]). Maintain strict professional neutrality.\n\nOriginal text:\n"${text}"`,
        config: {
          systemInstruction:
            'You are a corporate jargon specialist. Translate plain language into high-synergy corporate prose without exceeding 100 words.',
        },
      });
      return { transformed: response.text?.trim() || text };
    } catch (err) {
      console.warn('Gemini jargon boost failed, using fallback:', err);
    }
  }

  return {
    transformed:
      text +
      ' In alignment with our overarching operational roadmap, we are actively orchestrating cross-functional synergy to safeguard stakeholder value.',
  };
}
