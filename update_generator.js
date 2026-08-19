const fs = require('fs');

let file = fs.readFileSync('src/generator.ts', 'utf8');

// Replace top imports
file = file.replace(
    /import \{ ItemType, Board, Difficulty, CategoryDef, Clue, Puzzle, Column \} from '.\/types';/,
    `import { Board, Difficulty, CategoryDef, Clue, Puzzle, Column, Scenario } from './types';\nimport { scenarios } from './scenarios';`
);

// Remove old constants and getSubject functions
const toRemove = `export const ALL_CATEGORIES: CategoryDef[] = [
  { id: 'camiseta', label: 'Camiseta' },
  { id: 'nome', label: 'Nome' },
  { id: 'hamburguer', label: 'Hambúrguer' },
  { id: 'refrigerante', label: 'Refrigerante' },
  { id: 'idade', label: 'Idade' },
  { id: 'esporte', label: 'Esporte' },
];

export const ALL_OPTIONS: Record<string, string[]> = {
  camiseta: ["Amarela", "Azul", "Preta", "Verde", "Vermelha"],
  nome: ["Damarys", "Emilly", "Isadora", "Nikaelly", "Sara", "Ana", "Bia", "Carol", "Eva", "Lia"],
  hamburguer: ["Bacon extra", "Cheeseburger", "Onion rings", "Sem alface", "Sem cebola", "Picanha", "Vegano"],
  refrigerante: ["Cajuína", "Coca Cola", "Fanta Uva", "Guaraná", "Pepsi", "Sprite", "Soda"],
  idade: ["11", "12", "13", "14", "15", "16", "17", "18", "19", "20"],
  esporte: ["Basquete", "Carimba", "Corrida", "Futebol", "Vôlei", "Tênis", "Natação", "Judô"],
};

const getSubject = (cat: string, val: string) => {
    switch(cat) {
        case 'nome': return \`a \${val}\`;
        case 'camiseta': return \`a garota de camiseta \${val}\`;
        case 'hamburguer': return \`a que come \${val}\`;
        case 'refrigerante': return \`a que bebe \${val}\`;
        case 'idade': return \`a garota de \${val} anos\`;
        case 'esporte': return \`a que pratica \${val}\`;
    }
}

const getSubjectCapitalized = (cat: string, val: string) => {
    const s = getSubject(cat, val);
    return s.charAt(0).toUpperCase() + s.slice(1);
}`;

file = file.replace(/export const ALL_CATEGORIES[\s\S]+?return s\.charAt\(0\)\.toUpperCase\(\) \+ s\.slice\(1\);\n\}/, `
const getSubject = (cat: string, val: string, scenario: Scenario) => {
    const category = scenario.categories.find(c => c.id === cat);
    if (category && category.subjectTemplate) {
        return category.subjectTemplate.replace('{val}', val);
    }
    return \`o(a) \${val}\`;
}

const getSubjectCapitalized = (cat: string, val: string, scenario: Scenario) => {
    const s = getSubject(cat, val, scenario);
    return s.charAt(0).toUpperCase() + s.slice(1);
}
`);

// RawClue needs to refer to 'string' instead of ItemType
file = file.replace(/args: \{cat: ItemType, val: string\}\[\];/g, `args: {cat: string, val: string}[];`);

// translateClue needs to refer to 'string' instead of ItemType
file = file.replace(/function translateClue\(c: RawClue, cats: ItemType\[\], optionsMap: Record<ItemType, string\[\]>\): IntClue \{/g, `function translateClue(c: RawClue, cats: string[], optionsMap: Record<string, string[]>): IntClue {`);

// countSolutions
file = file.replace(/function countSolutions\(cols: number, categories: ItemType\[\], rawClues: RawClue\[\], optionsMap: Record<ItemType, string\[\]>\): number \{/g, `function countSolutions(cols: number, categories: string[], rawClues: RawClue[], optionsMap: Record<string, string[]>): number {`);

// generateAllPossibleClues
file = file.replace(/function generateAllPossibleClues\(solution: Board, cats: ItemType\[\], optionsMap: Record<ItemType, string\[\]>, difficulty: Difficulty\): RawClue\[\] \{/g, `function generateAllPossibleClues(solution: Board, cats: string[], optionsMap: Record<string, string[]>, difficulty: Difficulty, scenario: Scenario): RawClue[] {`);

// In generateAllPossibleClues, replace getSubject and getSubjectCapitalized to pass scenario
file = file.replace(/getSubjectCapitalized\((cat[A-C]), (val[A-C])\)/g, `getSubjectCapitalized($1, $2, scenario)`);
file = file.replace(/getSubject\((cat[A-C]), (val[A-C])\)/g, `getSubject($1, $2, scenario)`);

// In tryGeneratePuzzle, use scenario
const oldTryGeneratePuzzle = `    const catsToUse = [ALL_CATEGORIES[0], ...sampleSize(ALL_CATEGORIES.slice(1), numCats - 1)];
    const catIds = catsToUse.map(c => c.id);
    
    const optionsMap: Record<ItemType, string[]> = {} as any;
    for (const c of catsToUse) {
        optionsMap[c.id] = sampleSize(ALL_OPTIONS[c.id], cols);
    }`;

const newTryGeneratePuzzle = `
    const scenario = scenarios[random(0, scenarios.length - 1)];
    // Make sure the color category (if any) is included, and then sample the rest
    const colorCat = scenario.categories.find(c => c.isColor) || scenario.categories[0];
    const otherCats = scenario.categories.filter(c => c.id !== colorCat.id);
    
    const catsToUse = [colorCat, ...sampleSize(otherCats, numCats - 1)];
    const catIds = catsToUse.map(c => c.id);
    
    const optionsMap: Record<string, string[]> = {};
    for (const c of catsToUse) {
        optionsMap[c.id] = sampleSize(c.options, cols);
    }`;
    
file = file.replace(oldTryGeneratePuzzle, newTryGeneratePuzzle);

// generateAllPossibleClues call in tryGeneratePuzzle
file = file.replace(/let allClues = generateAllPossibleClues\(solution, catIds, optionsMap, difficulty\);/, `let allClues = generateAllPossibleClues(solution, catIds, optionsMap, difficulty, scenario);`);

// Return statement of tryGeneratePuzzle
file = file.replace(/return \{\n        id: Math\.random\(\)\.toString\(36\)\.substring\(7\),\n        difficulty,\n        columnsCount: cols,\n        categories: catsToUse,\n        options: optionsMap,\n        clues: uiClues,\n        solution\n    \};/, `return {
        id: Math.random().toString(36).substring(7),
        difficulty,
        scenario,
        columnsCount: cols,
        categories: catsToUse,
        options: optionsMap,
        clues: uiClues,
        solution
    };`);

// Remove ItemType occurrences in generateAllPossibleClues
file = file.replace(/cat: ItemType/g, `cat: string`);

fs.writeFileSync('src/generator.ts', file);
