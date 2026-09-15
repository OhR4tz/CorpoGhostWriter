export interface JargonEntry {
  term: string;
  plainMeaning: string;
  corporateContext: string;
  category: 'departure' | 'operations' | 'diplomacy' | 'strategy';
}

export const CORPORATE_JARGON_GLOSSARY: JargonEntry[] = [
  {
    term: 'operational realignment',
    plainMeaning: "I am quitting because things are disorganized and unmanageable.",
    corporateContext: 'Frames an abrupt exit as a high-level strategic optimization.',
    category: 'departure',
  },
  {
    term: 'bandwidth re-allocation',
    plainMeaning: "I am completely burned out and refuse to do 3 people's jobs.",
    corporateContext: 'Cites capacity constraints rather than personal overwhelm.',
    category: 'operations',
  },
  {
    term: 'strategic trajectory pivot',
    plainMeaning: "I found a much better opportunity elsewhere.",
    corporateContext: 'Neutral, forward-looking terminology that avoids comparisons.',
    category: 'departure',
  },
  {
    term: 'knowledge-transfer matrix',
    plainMeaning: "A list of notes left so you don't call me after I leave.",
    corporateContext: 'Assures clients and leadership of flawless operational continuity.',
    category: 'operations',
  },
  {
    term: 'cross-functional continuity',
    plainMeaning: "Making sure client accounts don't implode when I walk out.",
    corporateContext: 'Reassures stakeholders that workflows remain intact.',
    category: 'operations',
  },
  {
    term: 'streamlining core deliverables',
    plainMeaning: "Cutting out useless meetings and micromanagement.",
    corporateContext: 'Presents efficiency as the core rationale.',
    category: 'strategy',
  },
  {
    term: 'stakeholder alignment',
    plainMeaning: "Getting everyone to agree on something without yelling.",
    corporateContext: 'High-level diplomatic framing for communication harmony.',
    category: 'diplomacy',
  },
  {
    term: 'proactive decoupling',
    plainMeaning: "Resigning before this environment causes more damage.",
    corporateContext: 'Sterile boardroom language for ending an employment agreement.',
    category: 'departure',
  },
  {
    term: 'human capital reallocation',
    plainMeaning: "Staff turnover / switching positions.",
    corporateContext: 'Detached macroeconomic enterprise phrasing.',
    category: 'strategy',
  },
  {
    term: 'value-accretive synergy',
    plainMeaning: "Something that actually makes sense and brings real results.",
    corporateContext: 'Classic executive corporate buzzword.',
    category: 'strategy',
  },
];
