import { GenerateLetterParams } from '../server/letterLogic';

export function generateClientSideLetter(params: GenerateLetterParams) {
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
    customDemands = '',
  } = params;

  let body = '';
  let subject = '';
  let highlights: string[] = [];

  const effectiveRecipient = recipientName.trim() || '[Recipient Name]';
  const effectiveSender = senderName.trim() || '[Sender Name]';
  const effectiveTitle = senderTitle.trim() || '[Sender Title]';
  const effectiveCompany = companyName.trim() || 'Vanguard Strategic Holdings';
  const effectiveDates = keyDates.trim() || '[Effective Departure Date]';

  if (scenario === 'client_transition') {
    subject = `Executive Notice of Account Portfolio Realignment: [Client Account] // Strategic Continuity`;
    body = `Dear ${effectiveRecipient},

Please accept this correspondence as formal notification of an executive portfolio realignment regarding [Client Account / Project Milestone] at ${effectiveCompany}, effective ${effectiveDates}.

To guarantee uninterrupted continuity and accelerate high-velocity deliverables across your strategic milestones, I am orchestrating a comprehensive knowledge-transfer matrix. I will be collaborating closely with [Designated Successor / Team Lead], who brings deep domain acumen to stewardship of our joint roadmap.

Our team remains steadfastly aligned with your enterprise KPIs. We will finalize all active sprint artifacts prior to my strategic transition.

Sincerely,

${effectiveSender}
${effectiveTitle}
${effectiveCompany}`;
    highlights = [
      'Portfolio realignment: Frames personnel transition as proactive resource optimization.',
      'Knowledge-transfer matrix: Reassures client of zero account disruption.',
      'High-velocity deliverables: Reaffirms commitment to client milestones.',
    ];
  } else if (scenario === 'project_pivot') {
    subject = `Formal Stakeholder Notice: Scope Realignment & Operational Cadence Optimization`;
    body = `Dear ${effectiveRecipient},

Following a strategic diagnostic of our current initiative bandwidth and deliverable commitments at ${effectiveCompany}, I am formally initiating an operational scope realignment, effective ${effectiveDates}.

To safeguard core value creation and mitigate workstream friction, we are reallocating technical resources toward primary milestones. I am coordinating directly with [Designated Successor / Team Lead] to synchronize stakeholder expectations and institute an airtight knowledge-transfer protocol.

This calibrated prioritization guarantees that our essential outcomes are achieved without compromising deliverable integrity. Thank you for your continued cross-functional alignment.

Sincerely,

${effectiveSender}
${effectiveTitle}
${effectiveCompany}`;
    highlights = [
      'Strategic diagnostic: Objectively establishes necessity of boundary setting.',
      'Mitigate workstream friction: Defuses interpersonal debate through operational jargon.',
      'Cross-functional alignment: Reinforces enterprise composure.',
    ];
  } else {
    // Resignation
    subject = `Formal Notice of Operational Realignment: ${effectiveSender} // Strategic Transition`;
    body = `Dear ${effectiveRecipient},

Please accept this correspondence as formal notification of my operational realignment and conclusion of tenure as ${effectiveTitle} at ${effectiveCompany}, effective ${effectiveDates}.

Following an exhaustive evaluation of organizational workstreams and my current professional bandwidth, I have elected to pivot toward an alternative strategic trajectory. To guarantee uninterrupted continuity across all active client deliverables and mission-critical milestones, I am fully committed to executing a rigorous knowledge-transfer matrix through [Transition Period / Two Weeks Notice].

I will coordinate closely with [Designated Successor / Team Lead] to catalog core workflow repositories and optimize cross-functional handoffs prior to departure. I acknowledge the collaborative touchpoints established throughout my tenure and wish the enterprise continued cross-functional velocity.

Sincerely,

${effectiveSender}
${effectiveTitle}
${effectiveCompany}`;
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
    subjectLine: subject,
    letterBody: body,
    placeholders: detectedPlaceholders,
    wordCount: words,
    corporateHighlights: highlights,
    adviceNote:
      'Crafted strictly according to the Role Card (under 150 words, neutral tone, zero profanity). High-density corporate jargon converts your perspective into bulletproof professional diplomacy.',
    isClientGenerated: true,
  };
}
