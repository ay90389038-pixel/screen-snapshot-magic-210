// All data here is DEMO data for the prototype — not verified exam information.
export const BOARDS = ["CBSE", "ICSE", "State"] as const;
export const CLASSES = ["9", "10", "11", "12"] as const;
export const SUBJECTS: Record<string, string[]> = {
  "9": ["Mathematics", "Science", "Social Science", "English"],
  "10": ["Mathematics", "Science", "Social Science", "English"],
  "11": ["Physics", "Chemistry", "Mathematics", "Biology"],
  "12": ["Physics", "Chemistry", "Mathematics", "Biology"],
};

export const CHAPTERS: Record<string, { name: string; acc: number }[]> = {
  Science: [
    { name: "Chemical Reactions", acc: 82 },
    { name: "Acids, Bases & Salts", acc: 71 },
    { name: "Carbon Compounds", acc: 48 },
    { name: "Life Processes", acc: 77 },
    { name: "Light – Reflection", acc: 59 },
  ],
  Mathematics: [
    { name: "Real Numbers", acc: 88 },
    { name: "Quadratic Equations", acc: 74 },
    { name: "Trigonometry", acc: 52 },
    { name: "Statistics", acc: 80 },
    { name: "Coordinate Geometry", acc: 63 },
  ],
};
export const chaptersFor = (s: string) => CHAPTERS[s] ?? CHAPTERS["Science"]!;

export type Q = {
  id: number; type: string; difficulty: "Easy" | "Medium" | "Hard"; chapter: string;
  q: string; options: string[]; answer: number; explain: string;
};
export const QUESTIONS: Q[] = [
  { id: 1, type: "MCQ", difficulty: "Easy", chapter: "Carbon Compounds", q: "Which is the general formula of alkanes?", options: ["CnH2n", "CnH2n+2", "CnH2n-2", "CnHn"], answer: 1, explain: "Alkanes are saturated hydrocarbons: CnH2n+2 (e.g. CH₄, C₂H₆)." },
  { id: 2, type: "MCQ", difficulty: "Medium", chapter: "Carbon Compounds", q: "The functional group present in ethanol is:", options: ["–CHO", "–COOH", "–OH", "–CO–"], answer: 2, explain: "Ethanol (C₂H₅OH) contains the hydroxyl (–OH) group, making it an alcohol." },
  { id: 3, type: "Assertion & Reason", difficulty: "Medium", chapter: "Carbon Compounds", q: "A: Carbon forms covalent bonds. R: Carbon cannot gain or lose 4 electrons easily.", options: ["Both true, R explains A", "Both true, R doesn't explain A", "A true, R false", "A false, R true"], answer: 0, explain: "Gaining/losing 4 electrons is energetically unfavourable, so carbon shares electrons — R correctly explains A." },
  { id: 4, type: "MCQ", difficulty: "Easy", chapter: "Acids, Bases & Salts", q: "pH of a neutral solution at 25°C is:", options: ["0", "7", "14", "1"], answer: 1, explain: "Neutral solutions have [H⁺] = 10⁻⁷ M, so pH = 7." },
  { id: 5, type: "Case-based", difficulty: "Hard", chapter: "Light – Reflection", q: "A concave mirror forms a real image of the same size as the object. Where is the object placed?", options: ["At F", "Between F and P", "At C", "Beyond C"], answer: 2, explain: "Object at the centre of curvature (C) gives a real, inverted, same-size image at C." },
  { id: 6, type: "Numerical", difficulty: "Medium", chapter: "Light – Reflection", q: "A mirror has focal length 15 cm. Its radius of curvature is:", options: ["7.5 cm", "15 cm", "30 cm", "45 cm"], answer: 2, explain: "R = 2f = 2 × 15 = 30 cm." },
];

export const PYQS = [
  { year: 2024, chapter: "Carbon Compounds", topic: "Homologous series", marks: 3, type: "Short", difficulty: "Medium", q: "What is a homologous series? Give two characteristics.", freq: 5 },
  { year: 2023, chapter: "Carbon Compounds", topic: "Esterification", marks: 5, type: "Long", difficulty: "Hard", q: "Describe esterification with a balanced equation and one use of esters.", freq: 4 },
  { year: 2023, chapter: "Acids, Bases & Salts", topic: "pH scale", marks: 2, type: "Short", difficulty: "Easy", q: "Why does tooth decay start when mouth pH falls below 5.5?", freq: 6 },
  { year: 2022, chapter: "Light – Reflection", topic: "Mirror formula", marks: 3, type: "Numerical", difficulty: "Medium", q: "An object 4 cm tall is placed 25 cm from a concave mirror (f = 15 cm). Find image position.", freq: 7 },
  { year: 2022, chapter: "Life Processes", topic: "Nephron", marks: 5, type: "Long", difficulty: "Medium", q: "Draw a labelled diagram of a nephron and explain its function.", freq: 5 },
  { year: 2021, chapter: "Chemical Reactions", topic: "Types of reactions", marks: 1, type: "MCQ", difficulty: "Easy", q: "Identify the type of reaction: Fe + CuSO₄ → FeSO₄ + Cu.", freq: 8 },
  { year: 2020, chapter: "Carbon Compounds", topic: "Saponification", marks: 3, type: "Short", difficulty: "Medium", q: "Explain the cleansing action of soap.", freq: 6 },
];

export const UPDATES = [
  { date: "Demo", title: "Sample notice: Date sheet for Class 10 & 12 board exams", board: "CBSE", source: "https://www.cbse.gov.in" },
  { date: "Demo", title: "Sample notice: Practical exam guidelines", board: "CISCE", source: "https://cisce.org" },
  { date: "Demo", title: "Sample notice: Revised sample question papers released", board: "CBSE", source: "https://cbseacademic.nic.in" },
];
