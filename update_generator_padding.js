const fs = require('fs');

let file = fs.readFileSync('src/generator.ts', 'utf8');

const replacement = `
    // If we couldn't find exactly 1 solution, return null to retry
    if (countSolutions(cols, catIds, selectedClues, optionsMap) > 1) {
        return null;
    }
    
    // Attempt to reduce redundant clues
    let minimalClues = [...selectedClues];
    for (let i = minimalClues.length - 1; i >= 0; i--) {
        const temp = [...minimalClues];
        temp.splice(i, 1);
        if (countSolutions(cols, catIds, temp, optionsMap) === 1) {
            minimalClues = temp;
        }
    }
    
    let targetClueCount = 0;
    if (difficulty === 'MUITO FÁCIL') targetClueCount = 5;
    else if (difficulty === 'FÁCIL') targetClueCount = 12;
    else if (difficulty === 'MÉDIO') targetClueCount = 20;
    else if (difficulty === 'DIFÍCIL') targetClueCount = 25;
    else if (difficulty === 'MUITO DIFÍCIL') targetClueCount = 30;

    if (minimalClues.length > targetClueCount) {
        return null;
    }

    let finalClues = [...minimalClues];
    const unusedClues = shuffle(allClues.filter(c => !minimalClues.includes(c)));
    
    while (finalClues.length < targetClueCount && unusedClues.length > 0) {
        finalClues.push(unusedClues.pop()!);
    }
    
    if (finalClues.length !== targetClueCount) {
        return null;
    }

    finalClues = shuffle(finalClues);
    
    // Convert RawClues to UI Clues
    const uiClues: Clue[] = finalClues.map((c, i) => {
`;

file = file.replace(/    \/\/ If we couldn't find exactly 1 solution, return null to retry[\s\S]+?    \/\/ Convert RawClues to UI Clues\n    const uiClues: Clue\[\] = finalClues\.map\(\(c, i\) => \{/, replacement);

fs.writeFileSync('src/generator.ts', file);
