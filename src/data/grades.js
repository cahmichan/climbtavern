export const GRADES = ['VB', 'V0', 'V1', 'V2', 'V3', 'V4', 'V5', 'V6', 'V7', 'V8+'];

export const GRADE_COLORS = {
  VB:    '#FF69B4',
  V0:    '#00BFFF',
  V1:    '#FFD700',
  V2:    '#FFA500',
  V3:    '#228B22',
  V4:    '#006400',
  V5:    '#800080',
  V6:    '#FF0000',
  V7:    '#000000',
  'V8+': '#1a1a1a',
};

export const GRADE_INDEX = Object.fromEntries(GRADES.map((g, i) => [g, i]));

export const DISCIPLINES = {
  NORMAL:   { id: 'normal',   label: 'Normal',   metaphor: "Adventurer's Path",  icon: 'rope'  },
  OVERHANG: { id: 'overhang', label: 'Overhang', metaphor: "Dragon's Lair",      icon: 'claw'  },
  SLAB:     { id: 'slab',     label: 'Slab',     metaphor: 'Monastery',          icon: 'stone' },
  BOARD:    { id: 'board',    label: 'Board',     metaphor: "Blacksmith's Trial", icon: 'anvil' },
};

export const DISCIPLINE_IDS = Object.values(DISCIPLINES).map((d) => d.id);

export const STYLES = {
  TECHNICAL: { id: 'technical', label: 'Technical',   school: "Alchemist's School", icon: '\u2697\uFE0F' },
  POWERFUL:  { id: 'powerful',  label: 'Powerful',    school: "Berserker's School", icon: '\uD83D\uDCA5' },
  COMP:      { id: 'comp',     label: 'Comp/Coordi', school: "Acrobat's Guild",    icon: '\uD83C\uDFAD' },
  OLDSCHOOL: { id: 'oldschool', label: 'Old School',  school: "Elder's Way",        icon: '\uD83E\uDEA8' },
};

export const STYLE_IDS = Object.values(STYLES).map((s) => s.id);

export const BOARDS = {
  TENSION: { id: 'tension', label: 'Tension Board', defaultAngle: 20 },
  KILTER:  { id: 'kilter',  label: 'Kilterboard',   defaultAngle: 40 },
  MOON:    { id: 'moon',    label: 'Moonboard',     defaultAngle: 40 },
};
