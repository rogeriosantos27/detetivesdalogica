const fs = require('fs');

let file = fs.readFileSync('src/generator.ts', 'utf8');

// Insert history tracking
const historyLogic = `
const recentScenarios: string[] = [];

export function generatePuzzle(difficulty: Difficulty): Puzzle {
    while (true) {
        const puzzle = tryGeneratePuzzle(difficulty);
        if (puzzle) {
            recentScenarios.push(puzzle.scenario.id);
            if (recentScenarios.length > 2) recentScenarios.shift();
            return puzzle;
        }
    }
}
`;

file = file.replace(/export function generatePuzzle[\s\S]+?\}\n\}/, historyLogic);

// Modify tryGeneratePuzzle to avoid recent scenarios
file = file.replace(/const scenario = scenarios\[random\(0, scenarios\.length - 1\)\];/, `
    let availableScenarios = scenarios.filter(s => !recentScenarios.includes(s.id));
    if (availableScenarios.length === 0) availableScenarios = scenarios;
    const scenario = availableScenarios[random(0, availableScenarios.length - 1)];
`);

fs.writeFileSync('src/generator.ts', file);
