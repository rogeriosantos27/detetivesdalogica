import { shuffle, sampleSize, random } from 'lodash';
import { Board, Difficulty, CategoryDef, Clue, Puzzle, Column, Scenario } from './types';
import { scenarios } from './scenarios';
import { checkExactIndex, checkExactLeft, checkExactRight, checkSame, checkNextTo, checkLeftOf, checkRightOf, checkBetweenInOrder } from './validators';

const getSubject = (cat: string, val: string, scenario: Scenario) => {
    const category = scenario.categories.find(c => c.id === cat);
    if (category && category.subjectTemplate) {
        return category.subjectTemplate.replace('{val}', val);
    }
    return `o(a) ${val}`;
}

const getSubjectCapitalized = (cat: string, val: string, scenario: Scenario) => {
    const s = getSubject(cat, val, scenario);
    return s.charAt(0).toUpperCase() + s.slice(1);
}

const applyDe = (subject: string) => {
    if (/^[oaOA] /.test(subject)) return 'd' + subject;
    if (subject.startsWith('o(a) ')) return 'd' + subject;
    if (subject.startsWith('quem ')) return 'de ' + subject;
    return 'de ' + subject;
};

const cleanText = (text: string) => {
    let t = text.replace(/\s+/g, ' ').trim();
    if (t.includes('undefined') || t.includes('null')) return null;
    return t.charAt(0).toUpperCase() + t.slice(1);
};

interface RawClue {
    type: string;
    args: {cat: string, val: string}[];
    index?: number;
    text: string;
}

interface IntClue {
    type: string;
    cA: number; vA: number;
    cB: number; vB: number;
    cC?: number; vC?: number;
    idx?: number;
}

function translateClue(c: RawClue, cats: string[], optionsMap: Record<string, string[]>): IntClue {
    const cA = cats.indexOf(c.args[0].cat);
    const vA = optionsMap[c.args[0].cat].indexOf(c.args[0].val);
    let cB = -1, vB = -1, cC = -1, vC = -1;
    
    if (c.args.length > 1) {
        cB = cats.indexOf(c.args[1].cat);
        vB = optionsMap[c.args[1].cat].indexOf(c.args[1].val);
    }
    if (c.args.length > 2) {
        cC = cats.indexOf(c.args[2].cat);
        vC = optionsMap[c.args[2].cat].indexOf(c.args[2].val);
    }
    return { type: c.type, cA, vA, cB, vB, cC, vC, idx: c.index };
}

function checkPartial(assign: number[][], clues: IntClue[]): boolean {
    for (const c of clues) {
        const colA = assign[c.cA][c.vA];
        const colB = c.cB !== -1 ? assign[c.cB][c.vB] : -1;
        const colC = c.cC !== undefined && c.cC !== -1 ? assign[c.cC][c.vC!] : -1;
        
        if (c.type === 'Same') {
            if (colA !== -1 && colB !== -1 && colA !== colB) return false;
        } else if (c.type === 'NextTo') {
            if (colA !== -1 && colB !== -1 && Math.abs(colA - colB) !== 1) return false;
        } else if (c.type === 'ExactLeft') {
            if (colA !== -1 && colB !== -1 && colA !== colB - 1) return false;
        } else if (c.type === 'LeftOf') {
            if (colA !== -1 && colB !== -1 && colA >= colB) return false;
        } else if (c.type === 'ExactIndex') {
            if (colA !== -1 && colA !== c.idx) return false;
        } else if (c.type === 'BetweenInOrder') {
            if (colA !== -1 && colB !== -1 && colC !== -1) {
                if (!(colA < colB && colB < colC)) return false;
            }
            if (colA !== -1 && colB !== -1 && colA >= colB) return false;
            if (colA !== -1 && colC !== -1 && colA >= colC) return false;
            if (colB !== -1 && colC !== -1 && colB >= colC) return false;
        }
    }
    return true;
}

function getClueSignature(c: RawClue): string {
    const ents = c.args.map(a => `${a.cat}:${a.val}`);
    if (c.type === 'ExactIndex') {
        ents.push(`pos:${c.index}`);
    }
    ents.sort();
    return ents.join('|');
}

function countSolutions(cols: number, categories: string[], rawClues: RawClue[], optionsMap: Record<string, string[]>): number {
    let solutions = 0;
    const assignment: number[][] = [];
    for (let c = 0; c < categories.length; c++) {
        assignment[c] = Array(cols).fill(-1);
    }
    for(let i=0; i<cols; i++) assignment[0][i] = i;
    
    const intClues = rawClues.map(c => translateClue(c, categories, optionsMap));
    
    function backtrack(catIdx: number, valIdx: number) {
        if (solutions > 1) return;
        if (catIdx === categories.length) {
            solutions++;
            return;
        }
        const nextCat = valIdx === cols - 1 ? catIdx + 1 : catIdx;
        const nextVal = valIdx === cols - 1 ? 0 : valIdx + 1;
        
        for (let col = 0; col < cols; col++) {
            let used = false;
            for (let i = 0; i < valIdx; i++) {
                if (assignment[catIdx][i] === col) { used = true; break; }
            }
            if (used) continue;
            
            assignment[catIdx][valIdx] = col;
            if (checkPartial(assignment, intClues)) {
                backtrack(nextCat, nextVal);
            }
            assignment[catIdx][valIdx] = -1;
        }
    }
    backtrack(1, 0);
    return solutions;
}

function generateAllPossibleClues(solution: Board, cats: string[], optionsMap: Record<string, string[]>, difficulty: Difficulty, scenario: Scenario): RawClue[] {
    const clues: RawClue[] = [];
    const cols = solution.length;
    const getCol = (cat: string, val: string) => solution.findIndex(c => c[cat] === val);
    
    for (let c1 = 0; c1 < cats.length; c1++) {
        const catA = cats[c1];
        for (let v1 = 0; v1 < cols; v1++) {
            const valA = optionsMap[catA][v1];
            const colA = getCol(catA, valA);
            
            clues.push({
                type: 'ExactIndex',
                args: [{cat: catA, val: valA}],
                index: colA,
                text: cleanText(`${getSubjectCapitalized(catA, valA, scenario)} está na ${colA + 1}ª posição.`)!
            });
            
            for (let c2 = c1 + 1; c2 < cats.length; c2++) {
                const catB = cats[c2];
                for (let v2 = 0; v2 < cols; v2++) {
                    const valB = optionsMap[catB][v2];
                    const colB = getCol(catB, valB);
                    
                    if (colA === colB) {
                        clues.push({
                            type: 'Same',
                            args: [{cat: catA, val: valA}, {cat: catB, val: valB}],
                            text: cleanText(`${getSubjectCapitalized(catA, valA, scenario)} é ${getSubject(catB, valB, scenario)}.`)!
                        });
                    }
                    if (difficulty !== 'MUITO FÁCIL') {
                        if (Math.abs(colA - colB) === 1) {
                            clues.push({
                                type: 'NextTo',
                                args: [{cat: catA, val: valA}, {cat: catB, val: valB}],
                                text: cleanText(`${getSubjectCapitalized(catA, valA, scenario)} está ao lado ${applyDe(getSubject(catB, valB, scenario))}.`)!
                            });
                        }
                        if (colA === colB - 1) {
                            clues.push({
                                type: 'ExactLeft',
                                args: [{cat: catA, val: valA}, {cat: catB, val: valB}],
                                text: cleanText(`${getSubjectCapitalized(catA, valA, scenario)} está exatamente à esquerda ${applyDe(getSubject(catB, valB, scenario))}.`)!
                            });
                        }
                        if (colB === colA - 1) {
                            clues.push({
                                type: 'ExactLeft',
                                args: [{cat: catB, val: valB}, {cat: catA, val: valA}],
                                text: cleanText(`${getSubjectCapitalized(catB, valB, scenario)} está exatamente à esquerda ${applyDe(getSubject(catA, valA, scenario))}.`)!
                            });
                        }
                    }
                    
                    if (difficulty === 'DIFÍCIL' || difficulty === 'MUITO DIFÍCIL') {
                        if (colA < colB) {
                            clues.push({
                                type: 'LeftOf',
                                args: [{cat: catA, val: valA}, {cat: catB, val: valB}],
                                text: cleanText(`${getSubjectCapitalized(catA, valA, scenario)} está em algum lugar à esquerda ${applyDe(getSubject(catB, valB, scenario))}.`)!
                            });
                        }
                        if (colB < colA) {
                            clues.push({
                                type: 'LeftOf',
                                args: [{cat: catB, val: valB}, {cat: catA, val: valA}],
                                text: cleanText(`${getSubjectCapitalized(catB, valB, scenario)} está em algum lugar à esquerda ${applyDe(getSubject(catA, valA, scenario))}.`)!
                            });
                        }
                    }
                }
            }
        }
    }
    
    if (difficulty === 'MUITO DIFÍCIL') {
       for (let i=0; i<50; i++) {
           const cA = cats[random(0, cats.length-1)];
           const cB = cats[random(0, cats.length-1)];
           const cC = cats[random(0, cats.length-1)];
           if (cA === cB || cB === cC || cA === cC) continue;
           
           const vA = optionsMap[cA][random(0, cols-1)];
           const vB = optionsMap[cB][random(0, cols-1)];
           const vC = optionsMap[cC][random(0, cols-1)];
           
           const colA = getCol(cA, vA);
           const colB = getCol(cB, vB);
           const colC = getCol(cC, vC);
           
           if (colA < colB && colB < colC) {
               clues.push({
                   type: 'BetweenInOrder',
                   args: [{cat: cA, val: vA}, {cat: cB, val: vB}, {cat: cC, val: vC}],
                   text: cleanText(`${getSubjectCapitalized(cB, vB, scenario)} está em algum lugar entre ${getSubject(cA, vA, scenario)} e ${getSubject(cC, vC, scenario)}, nessa ordem.`)!
               });
           }
       }
    }
    
    return shuffle(clues.filter(c => c.text !== null));
}

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

function tryGeneratePuzzle(difficulty: Difficulty): Puzzle | null {
    let cols = 5;
    let numCats = 6;
    
    if (difficulty === 'MUITO FÁCIL') {
        cols = 3;
        numCats = 3;
    } else if (difficulty === 'FÁCIL') {
        cols = 4;
        numCats = 4;
    } else if (difficulty === 'MÉDIO') {
        cols = 4;
        numCats = 5;
    } else if (difficulty === 'DIFÍCIL') {
        cols = 5;
        numCats = 5;
    } else if (difficulty === 'MUITO DIFÍCIL') {
        cols = 5;
        numCats = 6;
    }
    
    let availableScenarios = scenarios.filter(s => !recentScenarios.includes(s.id));
    if (availableScenarios.length === 0) availableScenarios = scenarios;
    const scenario = availableScenarios[random(0, availableScenarios.length - 1)];
    const colorCat = scenario.categories.find(c => c.isColor) || scenario.categories[0];
    const otherCats = scenario.categories.filter(c => c.id !== colorCat.id);
    
    const catsToUse = [colorCat, ...sampleSize(otherCats, numCats - 1)];
    const catIds = catsToUse.map(c => c.id);
    
    const optionsMap: Record<string, string[]> = {};
    for (const c of catsToUse) {
        optionsMap[c.id] = sampleSize(c.options, cols);
    }
    
    // Generate Solution
    const solution: Board = Array(cols).fill(null).map(() => ({} as Column));
    for (const c of catsToUse) {
        const shuffled = shuffle(optionsMap[c.id]);
        for (let i = 0; i < cols; i++) {
            solution[i][c.id] = shuffled[i];
        }
    }
    
    let allClues = generateAllPossibleClues(solution, catIds, optionsMap, difficulty, scenario);
    let selectedClues: RawClue[] = [];
    
    // We add clues until we have exactly 1 solution
    for (const clue of allClues) {
        selectedClues.push(clue);
        const count = countSolutions(cols, catIds, selectedClues, optionsMap);
        if (count === 1) {
            break;
        }
        if (count === 0) {
            // Should never happen since the solution is always valid
            selectedClues.pop(); 
        }
    }
    
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
    const usedSignatures = new Set(finalClues.map(getClueSignature));
    
    const unusedClues = shuffle(allClues.filter(c => !minimalClues.includes(c)));
    
    for (const clue of unusedClues) {
        if (finalClues.length >= targetClueCount) break;
        
        const sig = getClueSignature(clue);
        if (!usedSignatures.has(sig)) {
            usedSignatures.add(sig);
            finalClues.push(clue);
        }
    }
    
    if (finalClues.length !== targetClueCount) {
        return null;
    }

    finalClues = shuffle(finalClues);
    
    // Convert RawClues to UI Clues
    const uiClues: Clue[] = finalClues.map((c, i) => {
        return {
            id: i + 1,
            text: c.text,
            check: (board: Board) => {
                if (c.type === 'ExactIndex') return checkExactIndex(board, c.args[0].cat, c.args[0].val, c.index!);
                if (c.type === 'Same') return checkSame(board, c.args[0].cat, c.args[0].val, c.args[1].cat, c.args[1].val);
                if (c.type === 'NextTo') return checkNextTo(board, c.args[0].cat, c.args[0].val, c.args[1].cat, c.args[1].val);
                if (c.type === 'ExactLeft') return checkExactLeft(board, c.args[0].cat, c.args[0].val, c.args[1].cat, c.args[1].val);
                if (c.type === 'LeftOf') return checkLeftOf(board, c.args[0].cat, c.args[0].val, c.args[1].cat, c.args[1].val);
                if (c.type === 'BetweenInOrder') return checkBetweenInOrder(board, c.args[0].cat, c.args[0].val, c.args[1].cat, c.args[1].val, c.args[2].cat, c.args[2].val);
                return null;
            }
        };
    });
    
    return {
        id: Math.random().toString(36).substring(7),
        difficulty,
        scenario,
        columnsCount: cols,
        categories: catsToUse,
        options: optionsMap,
        clues: uiClues,
        solution
    };
}
