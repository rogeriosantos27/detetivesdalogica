const fs = require('fs');

let file = fs.readFileSync('src/generator.ts', 'utf8');

// Insert applyDe and cleanText functions
const grammarHelpers = `
const applyDe = (subject: string) => {
    if (/^[oaOA] /.test(subject)) return 'd' + subject;
    if (subject.startsWith('o(a) ')) return 'd' + subject;
    return 'de ' + subject;
};

const cleanText = (text: string) => {
    let t = text.replace(/\\s+/g, ' ').trim();
    if (t.includes('undefined') || t.includes('null')) return null;
    return t.charAt(0).toUpperCase() + t.slice(1);
};

interface RawClue {
`;

file = file.replace(/interface RawClue \{/, grammarHelpers);

// Update ExactIndex text 
file = file.replace(/text: \`\$\{getSubjectCapitalized\(catA, valA, scenario\)\} está na \$\{colA \+ 1\}ª posição\.\`/g, 
    "text: cleanText(`${getSubjectCapitalized(catA, valA, scenario)} está na ${colA + 1}ª posição.`)!");

// Update Same text
file = file.replace(/text: \`\$\{getSubjectCapitalized\(catA, valA, scenario\)\} é \$\{getSubject\(catB, valB, scenario\)\}\.\`/g, 
    "text: cleanText(`${getSubjectCapitalized(catA, valA, scenario)} é ${getSubject(catB, valB, scenario)}.`)!");

// Update NextTo text
file = file.replace(/text: \`\$\{getSubjectCapitalized\(catA, valA, scenario\)\} está ao lado d\$\{getSubject\(catB, valB, scenario\)\}\.\`/g, 
    "text: cleanText(`${getSubjectCapitalized(catA, valA, scenario)} está ao lado ${applyDe(getSubject(catB, valB, scenario))}.`)!");

// Update ExactLeft texts
file = file.replace(/text: \`\$\{getSubjectCapitalized\(catA, valA, scenario\)\} está exatamente à esquerda d\$\{getSubject\(catB, valB, scenario\)\}\.\`/g, 
    "text: cleanText(`${getSubjectCapitalized(catA, valA, scenario)} está exatamente à esquerda ${applyDe(getSubject(catB, valB, scenario))}.`)!");

file = file.replace(/text: \`\$\{getSubjectCapitalized\(catB, valB, scenario\)\} está exatamente à esquerda d\$\{getSubject\(catA, valA, scenario\)\}\.\`/g, 
    "text: cleanText(`${getSubjectCapitalized(catB, valB, scenario)} está exatamente à esquerda ${applyDe(getSubject(catA, valA, scenario))}.`)!");

// Update LeftOf texts
file = file.replace(/text: \`\$\{getSubjectCapitalized\(catA, valA, scenario\)\} está em algum lugar à esquerda d\$\{getSubject\(catB, valB, scenario\)\}\.\`/g, 
    "text: cleanText(`${getSubjectCapitalized(catA, valA, scenario)} está em algum lugar à esquerda ${applyDe(getSubject(catB, valB, scenario))}.`)!");

file = file.replace(/text: \`\$\{getSubjectCapitalized\(catB, valB, scenario\)\} está em algum lugar à esquerda d\$\{getSubject\(catA, valA, scenario\)\}\.\`/g, 
    "text: cleanText(`${getSubjectCapitalized(catB, valB, scenario)} está em algum lugar à esquerda ${applyDe(getSubject(catA, valA, scenario))}.`)!");

// Update BetweenInOrder text
file = file.replace(/text: \`\$\{getSubjectCapitalized\(cB, vB, scenario\)\} está em algum lugar entre \$\{getSubject\(cA, vA, scenario\)\} e \$\{getSubject\(cC, vC, scenario\)\}, nessa ordem\.\`/g, 
    "text: cleanText(`${getSubjectCapitalized(cB, vB, scenario)} está em algum lugar entre ${getSubject(cA, vA, scenario)} e ${getSubject(cC, vC, scenario)}, nessa ordem.`)!");

// Filter clues where text is null (meaning undefined or null was in it)
file = file.replace(/return shuffle\(clues\);/, `return shuffle(clues.filter(c => c.text !== null));`);

fs.writeFileSync('src/generator.ts', file);
