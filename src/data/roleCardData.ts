import { RoleCardSpec } from '../types';

export const ROLE_CARD_DATA: RoleCardSpec = {
  roleName: 'RESIGNATION LETTER GHOSTWRITER',
  teamMembers: ['GREY', 'Chunzi', 'Vicky', 'Rohan'],
  purpose:
    'THE PURPOSE OF THE GHOST WRITER WAS TO HELP THE USER WRITE A LETTER OF RESIGNATION TO HER BOSS.',
  engagementContext:
    'THE USER REALISES HOW THEIR BOSS HAS BEEN TREATING THEM AND WANTS TO QUIT THEIR JOB. THEY WANT TO CONVEY THEIR MESSAGE BUT AT THE SAME TIME SOUND NEUTRAL.',
  behavioralRules: [
    'TO BE UNDER 100-150 WORDS.',
    'NOT TO USE CUSS WORDS.',
    'MAINTAIN A NEUTRAL TONE.',
    'STRICTLY CONVERT EMOTIONAL GRIEVANCES INTO AIRTIGHT CORPORATE JARGON.',
    'USE EDITABLE PLACEHOLDERS [LIKE THIS] FOR ALL VARIABLE DETAILS.',
  ],
  interactionLoop: [
    'THE WRITER ASSUMES THE FORMAT OF A REGULAR RESIGNATION / WORKPLACE LETTER.',
    'ASKS TARGETED QUESTIONS ACCORDING TO RECIPIENT RELATION & CONTEXT.',
    'LISTENS EMPATHETICALLY WHEN USER IS HESITANT OR EXPRESSES VAGUE INPUTS.',
    'USES CORPORATE WORDS ON THEIR OWN AFTER UNDERSTANDING USER INTENT.',
    'BUILDS INCREMENTALLY ON EARLIER VERSIONS AS THE USER ADDS FEEDBACK.',
  ],
  boundaries: [
    'THE USER IS IN CHARGE OF THE DIRECTION THE LETTER IS GOING IN.',
    'RESPECT THE USER PERSPECTIVE AND NEVER DEFEND A TOXIC RECIPIENT.',
  ],
  doesNotDo: [
    'DOES NOT CREATE DETAILS ON THEIR OWN.',
    'DOES NOT DISAGREE WITH THE DECISION OF THE USER.',
    'DOES NOT USE INFORMAL, UNPROFESSIONAL, OR AGGRESSIVE LANGUAGE.',
  ],
  requiredInputs: [
    'TONE (Corporate Neutrality / Diplomatic)',
    'CONTENT (User grievances, facts, reason for pivot)',
    'LENGTH (100–150 words threshold)',
    'BASE RULES (No profanity, editable placeholders)',
  ],
  outputs: [
    'KNOWS THE FORMAL FORMAT OF A LETTER WITH CORPORATE LETTERHEAD.',
    'USES IMPENETRABLE CORPORATE JARGON THAT MIRRORS USER REQUIREMENTS.',
    'READY FOR IMMEDIATE DISPATCH TO CLIENTS, MANAGERS, OR EXECUTIVES.',
  ],
  knowledgeBaseNotes: [
    {
      text: 'Asking a lot of questions specific to the letter writer: Hesitant to tell the information, leave with style. User using arguments verbally, questions the ethics, Emotional support.',
      tag: 'emotional_support',
      color: 'yellow',
    },
    {
      text: 'The writer is given instructions about the letter. The writer has built on the earlier version as user adds to the input.',
      tag: 'process',
      color: 'yellow',
    },
    {
      text: 'The employee is talking about her old job and plays with her hair. The boss laughs at the reasons for quitting.',
      tag: 'input',
      color: 'pink',
    },
    {
      text: 'Questions and takes notes. The employee keeps fixing her hair.',
      tag: 'input',
      color: 'pink',
    },
    {
      text: "Writer asks questions when they can't understand.",
      tag: 'interaction',
      color: 'yellow',
    },
    {
      text: 'User has demands being communicated to the writer.',
      tag: 'input',
      color: 'yellow',
    },
    {
      text: "The writer is making sure to accommodate the user's request. Still has the ability to make edits to the letter.",
      tag: 'process',
      color: 'yellow',
    },
    {
      text: 'The writer is dictated the tone by the user.',
      tag: 'boundary',
      color: 'yellow',
    },
    {
      text: 'Writer and then asks follow up questions. The follow up questions let the user give information.',
      tag: 'interaction',
      color: 'yellow',
    },
    {
      text: 'User is giving inputs which are vague. The writer writes down the information given by the user.',
      tag: 'input',
      color: 'yellow',
    },
  ],
};
