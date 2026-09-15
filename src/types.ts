export type JargonLevel = 'moderate' | 'heavy' | 'maximum';

export type LetterScenario =
  | 'resignation'
  | 'client_transition'
  | 'project_pivot'
  | 'workplace_grievance_neutral'
  | 'scope_realignment';

export interface LetterheadConfig {
  companyName: string;
  division: string;
  tagline: string;
  streetAddress: string;
  cityStateZip: string;
  directPhone: string;
  officialEmail: string;
  website: string;
  confidentialityNotice: string;
  referenceNumber: string;
}

export interface LetterDocument {
  id: string;
  title: string;
  subjectLine: string;
  date: string;
  referenceNumber: string;
  scenario: LetterScenario;
  jargonLevel: JargonLevel;
  
  // Recipient details & perspective
  recipientName: string;
  recipientTitle: string;
  recipientOrganization: string;
  recipientEmail: string;
  recipientRelation: string; // e.g., 'Toxic Boss', 'Demanding Supervisor', 'Key Enterprise Client', 'Board Member'
  
  // Sender details
  senderName: string;
  senderTitle: string;
  senderEmail: string;
  senderPhone: string;
  
  // Raw draft & placeholders
  letterBody: string;
  placeholders: Record<string, string>; // e.g. { "[Recipient Name]": "Sarah Jenkins", "[Effective Date]": "October 14, 2026" }
  
  // Status & analytics
  wordCount: number;
  isCompliantWithRoleCard: boolean; // Under 100-150 words
  corporateHighlights: string[];
  adviceNote?: string;
  status: 'draft' | 'finalized' | 'sent';
  lastModified: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: string;
  suggestedDraft?: string;
}

export interface RoleCardSpec {
  roleName: string;
  teamMembers: string[];
  purpose: string;
  engagementContext: string;
  behavioralRules: string[];
  interactionLoop: string[];
  boundaries: string[];
  doesNotDo: string[];
  requiredInputs: string[];
  outputs: string[];
  knowledgeBaseNotes: {
    text: string;
    tag: 'input' | 'process' | 'emotional_support' | 'boundary' | 'interaction';
    color: 'yellow' | 'pink';
  }[];
}
