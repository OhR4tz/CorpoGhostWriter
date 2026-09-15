import { LetterDocument, LetterheadConfig } from '../types';

export const DEFAULT_LETTERHEAD: LetterheadConfig = {
  companyName: 'VANGUARD STRATEGIC HOLDINGS',
  division: 'Enterprise Operations & Client Advisory Group',
  tagline: 'Global Solutions • Cross-Functional Governance • Sustainable Value',
  streetAddress: '450 Park Avenue, 28th Floor, Corporate Suite B',
  cityStateZip: 'New York, NY 10022',
  directPhone: '+1 (212) 555-0198',
  officialEmail: 'operations@vanguard-holdings.corp',
  website: 'www.vanguard-holdings.corp',
  confidentialityNotice:
    'CONFIDENTIAL & PROPRIETARY // For Authorized Client & Executive Stakeholders Only. Unauthorized duplication is strictly prohibited under corporate governance bylaws.',
  referenceNumber: 'REF: VSH-EXEC-2026-0909-RT',
};

export const INITIAL_LETTER: LetterDocument = {
  id: 'doc-001',
  title: 'Executive Notice of Operational Realignment & Transition',
  subjectLine: 'Formal Notice of Operational Realignment: [Sender Name] // Strategic Transition',
  date: 'September 10, 2026',
  referenceNumber: 'REF: VSH-EXEC-2026-0909-RT',
  scenario: 'resignation',
  jargonLevel: 'heavy',
  
  recipientName: '[Recipient Name]',
  recipientTitle: '[Recipient Title / Managing Director]',
  recipientOrganization: '[Client / Parent Corporation Name]',
  recipientEmail: 'recipient.executive@corporation.com',
  recipientRelation: 'Direct Supervisor / Department Head',
  
  senderName: '[Sender Name]',
  senderTitle: '[Your Job Title / Senior Operations Lead]',
  senderEmail: 'sender.lead@vanguard-holdings.corp',
  senderPhone: '+1 (212) 555-0144',
  
  letterBody: `Dear [Recipient Name],

Please accept this correspondence as formal notification of my operational realignment and conclusion of tenure as [Sender Title] at [Company Name], effective [Effective Departure Date].

Following an exhaustive evaluation of organizational workstreams and my current professional bandwidth, I have elected to pivot toward an alternative strategic trajectory. To guarantee uninterrupted continuity across all active client deliverables and mission-critical milestones, I am fully committed to executing a rigorous knowledge-transfer matrix through [Transition Period / Two Weeks Notice]. 

I will coordinate closely with [Designated Successor / Team Lead] to catalog core workflow repositories and optimize cross-functional handoffs prior to departure. I acknowledge the collaborative touchpoints established throughout my tenure and wish the enterprise continued cross-functional velocity.

Sincerely,

[Sender Name]
[Sender Title]
[Company Name]`,

  placeholders: {
    '[Recipient Name]': 'Marcus Sterling',
    '[Recipient Title / Managing Director]': 'Executive Vice President of Operations',
    '[Client / Parent Corporation Name]': 'Apex Meridian Holdings',
    '[Sender Name]': 'Alex Mercer',
    '[Sender Title]': 'Senior Strategic Portfolio Lead',
    '[Your Job Title / Senior Operations Lead]': 'Senior Strategic Portfolio Lead',
    '[Company Name]': 'Vanguard Strategic Holdings',
    '[Effective Departure Date]': 'September 25, 2026',
    '[Transition Period / Two Weeks Notice]': 'October 02, 2026',
    '[Designated Successor / Team Lead]': 'Elena Rostova',
  },
  
  wordCount: 122,
  isCompliantWithRoleCard: true,
  corporateHighlights: [
    'Operational Realignment: Replaces emotional quitting with an objective strategic shift.',
    'Bandwidth Evaluation: Neutralizes personal grievance as professional capacity management.',
    'Knowledge-Transfer Matrix: Proves total diligence and safeguards client accounts.',
    'Cross-Functional Velocity: Impeccable boardroom composure with zero room for critique.',
  ],
  adviceNote:
    'Adheres strictly to the 100–150 word rule from the Role Card. By utilizing high-density corporate jargon, your boundary is firm and indisputable while maintaining bulletproof professional diplomacy.',
  status: 'draft',
  lastModified: new Date().toISOString(),
};

export const SAMPLE_SCENARIOS = [
  {
    id: 'resignation',
    title: 'Resignation to Boss (Role Card Spec)',
    description: 'When quitting due to poor management while maintaining 100% neutral composure and corporate armor.',
    defaultPerspective: 'Boss has been dismissing contributions, creating moving goalposts, and laughing at staff concerns. I need to leave immediately without burning bridges or showing emotion.',
    recipientRelation: 'Toxic or Dismissive Boss',
    recipientRole: 'Direct Supervisor / VP',
  },
  {
    id: 'client_transition',
    title: 'Client Departure & Account Handover',
    description: 'Informing a VIP client that you are transitioning off their account to maintain trust and prevent panic.',
    defaultPerspective: 'Leaving the firm; want to reassure high-stakes client that their deliverables and account roadmap remain fully safeguarded.',
    recipientRelation: 'Key Enterprise Client',
    recipientRole: 'Chief Procurement Officer / Client Lead',
  },
  {
    id: 'project_pivot',
    title: 'Strategic Pivot & Scope Realignment',
    description: 'Notifying leadership or external clients that project scope, delivery date, or resources are being restructured.',
    defaultPerspective: 'Leadership expanded scope without budget or staff. Need to formally push back and set hard boundaries using enterprise jargon.',
    recipientRelation: 'Executive Sponsor / Steering Committee',
    recipientRole: 'Steering Committee Chair',
  },
];
