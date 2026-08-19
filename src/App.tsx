import React, { useState } from 'react';
import { CheckCircle2, XCircle, HelpCircle, RefreshCw, Trophy, AlertCircle, Search, LayoutGrid } from 'lucide-react';

type ItemType = 'camiseta' | 'nome' | 'hamburguer' | 'refrigerante' | 'idade' | 'esporte';
type Column = Record<ItemType, string>;
type Board = Column[];

const CATEGORIES: { id: ItemType; label: string }[] = [
  { id: 'camiseta', label: 'Camiseta' },
  { id: 'nome', label: 'Nome' },
  { id: 'hamburguer', label: 'Hambúrguer' },
  { id: 'refrigerante', label: 'Refrigerante' },
  { id: 'idade', label: 'Idade' },
  { id: 'esporte', label: 'Esporte' },
];

const OPTIONS: Record<ItemType, string[]> = {
  camiseta: ["", "Amarela", "Azul", "Preta", "Verde", "Vermelha"],
  nome: ["", "Damarys", "Emilly", "Isadora", "Nikaelly", "Sara"],
  hamburguer: ["", "Bacon extra", "Cheeseburger", "Onion rings", "Sem alface", "Sem cebola"],
  refrigerante: ["", "Cajuína", "Coca Cola", "Fanta Uva", "Guaraná", "Pepsi"],
  idade: ["", "11", "12", "13", "14", "15"],
  esporte: ["", "Basquete", "Carimba", "Corrida", "Futebol", "Vôlei"],
};

function getIndex(board: Board, type: ItemType, value: string): number {
  return board.findIndex(col => col[type] === value);
}

// LÓGICA DE VALIDAÇÃO MATEMÁTICA EXAUSTIVA (RACHA CUCA)
// Retorna true (Satisfeita), false (Violada/Impossível), ou null (Pendente)

function checkExactIndex(board: Board, type: ItemType, value: string, exactIndex: number) {
  const i = getIndex(board, type, value);
  if (i === exactIndex) return true;
  if (i !== -1 && i !== exactIndex) return false;
  if (board[exactIndex][type] !== "" && board[exactIndex][type] !== value) return false;
  return null;
}

function checkExactLeft(board: Board, tA: ItemType, vA: string, tB: ItemType, vB: string) {
  const iA = getIndex(board, tA, vA);
  const iB = getIndex(board, tB, vB);
  
  if (iA !== -1 && iB !== -1) return iA === iB - 1;
  
  let possible = false;
  for (let i = 0; i < 4; i++) {
    const canPlaceA = (iA === -1 && (board[i][tA] === "" || board[i][tA] === vA)) || iA === i;
    const canPlaceB = (iB === -1 && (board[i + 1][tB] === "" || board[i + 1][tB] === vB)) || iB === i + 1;
    if (canPlaceA && canPlaceB) {
      possible = true;
      break;
    }
  }
  if (!possible) return false;
  return null;
}

function checkExactRight(board: Board, tA: ItemType, vA: string, tB: ItemType, vB: string) {
  return checkExactLeft(board, tB, vB, tA, vA);
}

function checkSame(board: Board, tA: ItemType, vA: string, tB: ItemType, vB: string) {
  const iA = getIndex(board, tA, vA);
  const iB = getIndex(board, tB, vB);
  
  if (iA !== -1 && iB !== -1) return iA === iB;
  
  let possible = false;
  for (let i = 0; i < 5; i++) {
    const canPlaceA = (iA === -1 && (board[i][tA] === "" || board[i][tA] === vA)) || iA === i;
    const canPlaceB = (iB === -1 && (board[i][tB] === "" || board[i][tB] === vB)) || iB === i;
    if (canPlaceA && canPlaceB) {
      possible = true;
      break;
    }
  }
  if (!possible) return false;
  return null;
}

function checkNextTo(board: Board, tA: ItemType, vA: string, tB: ItemType, vB: string) {
  const iA = getIndex(board, tA, vA);
  const iB = getIndex(board, tB, vB);
  
  if (iA !== -1 && iB !== -1) return Math.abs(iA - iB) === 1;
  
  let possible = false;
  for (let i = 0; i < 4; i++) {
    const canPlaceA1 = (iA === -1 && (board[i][tA] === "" || board[i][tA] === vA)) || iA === i;
    const canPlaceB1 = (iB === -1 && (board[i + 1][tB] === "" || board[i + 1][tB] === vB)) || iB === i + 1;
    if (canPlaceA1 && canPlaceB1) { possible = true; break; }
    
    const canPlaceB2 = (iB === -1 && (board[i][tB] === "" || board[i][tB] === vB)) || iB === i;
    const canPlaceA2 = (iA === -1 && (board[i + 1][tA] === "" || board[i + 1][tA] === vA)) || iA === i + 1;
    if (canPlaceB2 && canPlaceA2) { possible = true; break; }
  }
  if (!possible) return false;
  return null;
}

function checkLeftOf(board: Board, tA: ItemType, vA: string, tB: ItemType, vB: string) {
  const iA = getIndex(board, tA, vA);
  const iB = getIndex(board, tB, vB);
  
  if (iA !== -1 && iB !== -1) return iA < iB;
  
  let possible = false;
  for (let i = 0; i < 4; i++) {
    for (let j = i + 1; j < 5; j++) {
      const canPlaceA = (iA === -1 && (board[i][tA] === "" || board[i][tA] === vA)) || iA === i;
      const canPlaceB = (iB === -1 && (board[j][tB] === "" || board[j][tB] === vB)) || iB === j;
      if (canPlaceA && canPlaceB) {
        possible = true;
        break;
      }
    }
    if (possible) break;
  }
  if (!possible) return false;
  return null;
}

function checkRightOf(board: Board, tA: ItemType, vA: string, tB: ItemType, vB: string) {
  return checkLeftOf(board, tB, vB, tA, vA);
}

function checkBetweenInOrder(board: Board, tA: ItemType, vA: string, tB: ItemType, vB: string, tC: ItemType, vC: string) {
  const iA = getIndex(board, tA, vA);
  const iB = getIndex(board, tB, vB);
  const iC = getIndex(board, tC, vC);
  
  if (iA !== -1 && iB !== -1 && iC !== -1) return iB < iA && iA < iC;
  
  let possible = false;
  for (let i = 0; i < 3; i++) {
    for (let j = i + 1; j < 4; j++) {
      for (let k = j + 1; k < 5; k++) {
        const canPlaceB = (iB === -1 && (board[i][tB] === "" || board[i][tB] === vB)) || iB === i;
        const canPlaceA = (iA === -1 && (board[j][tA] === "" || board[j][tA] === vA)) || iA === j;
        const canPlaceC = (iC === -1 && (board[k][tC] === "" || board[k][tC] === vC)) || iC === k;
        if (canPlaceB && canPlaceA && canPlaceC) {
          possible = true;
          break;
        }
      }
      if (possible) break;
    }
    if (possible) break;
  }
  if (!possible) return false;
  return null;
}

const CLUES = [
  { id: 1, text: "Quem está bebendo Coca Cola está em algum lugar entre Nikaelly e quem está bebendo Fanta Uva, nessa ordem.", check: (b: Board) => checkBetweenInOrder(b, 'refrigerante', 'Coca Cola', 'nome', 'Nikaelly', 'refrigerante', 'Fanta Uva') },
  { id: 2, text: "Isadora está exatamente à esquerda da garota de 12 anos.", check: (b: Board) => checkExactLeft(b, 'nome', 'Isadora', 'idade', '12') },
  { id: 3, text: "Na quarta posição está a garota de 14 anos.", check: (b: Board) => checkExactIndex(b, 'idade', '14', 3) },
  { id: 4, text: "A garota que gosta de Futebol está exatamente à direita de quem está bebendo Cajuína.", check: (b: Board) => checkExactRight(b, 'esporte', 'Futebol', 'refrigerante', 'Cajuína') },
  { id: 5, text: "A garota de camiseta Vermelha está bebendo Fanta Uva.", check: (b: Board) => checkSame(b, 'camiseta', 'Vermelha', 'refrigerante', 'Fanta Uva') },
  { id: 6, text: "Quem gosta de Basquete está em algum lugar entre quem gosta de Futebol e quem gosta de Carimba, nessa ordem.", check: (b: Board) => checkBetweenInOrder(b, 'esporte', 'Basquete', 'esporte', 'Futebol', 'esporte', 'Carimba') },
  { id: 7, text: "A garota mais velha (15 anos) está ao lado de quem está bebendo Guaraná.", check: (b: Board) => checkNextTo(b, 'idade', '15', 'refrigerante', 'Guaraná') },
  { id: 8, text: "Na terceira posição está quem pediu um hambúrguer com Bacon extra.", check: (b: Board) => checkExactIndex(b, 'hamburguer', 'Bacon extra', 2) },
  { id: 9, text: "A garota de 12 anos está exatamente à direita de quem está com a camiseta Preta.", check: (b: Board) => checkExactRight(b, 'idade', '12', 'camiseta', 'Preta') },
  { id: 10, text: "Quem gosta de Corrida está exatamente à esquerda de quem gosta de Basquete.", check: (b: Board) => checkExactLeft(b, 'esporte', 'Corrida', 'esporte', 'Basquete') },
  { id: 11, text: "Quem pediu um hambúrguer com Onion rings está ao lado de quem está com a camiseta Verde.", check: (b: Board) => checkNextTo(b, 'hamburguer', 'Onion rings', 'camiseta', 'Verde') },
  { id: 12, text: "Quem gosta de Carimba está na quinta posição.", check: (b: Board) => checkExactIndex(b, 'esporte', 'Carimba', 4) },
  { id: 13, text: "Quem está de Verde está bebendo Pepsi.", check: (b: Board) => checkSame(b, 'camiseta', 'Verde', 'refrigerante', 'Pepsi') },
  { id: 14, text: "A garota mais nova (11 anos) está exatamente à esquerda da garota de 14 anos.", check: (b: Board) => checkExactLeft(b, 'idade', '11', 'idade', '14') },
  { id: 15, text: "Quem está de Amarela está em algum lugar entre quem pediu um hambúrguer Sem alface e quem está de Vermelha, nessa ordem.", check: (b: Board) => checkBetweenInOrder(b, 'camiseta', 'Amarela', 'hamburguer', 'Sem alface', 'camiseta', 'Vermelha') },
  { id: 16, text: "Quem está bebendo Fanta Uva está exatamente à esquerda de quem está bebendo Pepsi.", check: (b: Board) => checkExactLeft(b, 'refrigerante', 'Fanta Uva', 'refrigerante', 'Pepsi') },
  { id: 17, text: "Emilly está em algum lugar à direita de quem está com a camiseta Azul.", check: (b: Board) => checkRightOf(b, 'nome', 'Emilly', 'camiseta', 'Azul') },
  { id: 18, text: "Damarys está exatamente à esquerda de quem pediu um hambúrguer Sem cebola.", check: (b: Board) => checkExactLeft(b, 'nome', 'Damarys', 'hamburguer', 'Sem cebola') },
  { id: 19, text: "Nikaelly está ao lado de quem está com a camiseta Azul.", check: (b: Board) => checkNextTo(b, 'nome', 'Nikaelly', 'camiseta', 'Azul') }
];

const getDuplicates = (board: Board, category: ItemType) => {
  const values = board.map(col => col[category]).filter(v => v !== "");
  return values.filter((item, index) => values.indexOf(item) !== index);
};

export default function App() {
  const [board, setBoard] = useState<Board>(
    Array(5).fill(null).map(() => ({
      camiseta: "",
      nome: "",
      hamburguer: "",
      refrigerante: "",
      idade: "",
      esporte: "",
    }))
  );
  
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' | null }>({ text: '', type: null });

  const updateBoard = (colIndex: number, type: ItemType, value: string) => {
    const newBoard = [...board];
    newBoard[colIndex] = { ...newBoard[colIndex], [type]: value };
    setBoard(newBoard);
    setMessage({ text: '', type: null });
  };

  const handleVerify = () => {
    const isFilled = board.every(col => Object.values(col).every(val => val !== ""));
    if (!isFilled) {
      setMessage({ text: 'Preencha todas as opções antes de verificar!', type: 'error' });
      return;
    }
    
    const hasDuplicates = CATEGORIES.some(cat => getDuplicates(board, cat.id).length > 0);
    if (hasDuplicates) {
      setMessage({ text: 'Existem itens repetidos na mesma categoria. Corrija-os!', type: 'error' });
      return;
    }
    
    const cluesStatus = CLUES.map(c => c.check(board));
    if (cluesStatus.every(s => s === true)) {
      setMessage({ text: 'Parabéns! Você resolveu o enigma perfeitamente!', type: 'success' });
    } else {
      setMessage({ text: 'Ops! Algumas respostas não estão corretas. Revise as pistas que estão em vermelho.', type: 'error' });
    }
  };

  const handleReset = () => {
    if (confirm('Tem certeza que deseja limpar todo o tabuleiro?')) {
      setBoard(Array(5).fill(null).map(() => ({
        camiseta: "",
        nome: "",
        hamburguer: "",
        refrigerante: "",
        idade: "",
        esporte: "",
      })));
      setMessage({ text: '', type: null });
    }
  };

  const getColumnHeaderClass = (camiseta: string) => {
    switch (camiseta) {
      case "Amarela": return "bg-gradient-to-b from-yellow-400 to-yellow-500 text-yellow-950 border-yellow-600 shadow-[inset_0_2px_10px_rgba(255,255,255,0.4)]";
      case "Azul": return "bg-gradient-to-b from-blue-500 to-blue-700 text-white border-blue-800 shadow-[inset_0_2px_10px_rgba(255,255,255,0.2)]";
      case "Preta": return "bg-gradient-to-b from-slate-700 to-slate-900 text-white border-black shadow-[inset_0_2px_10px_rgba(255,255,255,0.1)]";
      case "Verde": return "bg-gradient-to-b from-green-500 to-green-700 text-white border-green-800 shadow-[inset_0_2px_10px_rgba(255,255,255,0.2)]";
      case "Vermelha": return "bg-gradient-to-b from-red-500 to-red-700 text-white border-red-800 shadow-[inset_0_2px_10px_rgba(255,255,255,0.2)]";
      default: return "bg-slate-800/90 text-yellow-400 border-white/10";
    }
  };

  const getColumnCellClass = (camiseta: string) => {
    switch (camiseta) {
      case "Amarela": return "bg-yellow-300 border-yellow-400";
      case "Azul": return "bg-blue-500 border-blue-600";
      case "Preta": return "bg-slate-600 border-slate-700";
      case "Verde": return "bg-green-500 border-green-600";
      case "Vermelha": return "bg-red-500 border-red-600";
      default: return "bg-white/95 border-black/10";
    }
  };

  const getSelectClass = (camiseta: string) => {
    if (camiseta) {
      return "bg-white/95 text-slate-900 border-transparent shadow-md hover:shadow-lg focus:ring-2 focus:ring-white/50";
    }
    return "bg-white text-slate-800 border-slate-300 shadow-sm hover:border-slate-400";
  };

  return (
    <div className="min-h-screen bg-slate-900 bg-cover bg-center bg-fixed text-slate-100 p-2 sm:p-6 md:p-8 flex flex-col items-center font-sans" style={{ backgroundImage: "linear-gradient(135deg, rgba(15,23,42,0.95), rgba(30,58,138,0.95)), url('https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=2574&auto=format&fit=crop')" }}>
      <div className="w-full max-w-7xl mx-auto flex flex-col gap-4 sm:gap-8 pb-8 sm:pb-12">
        <header className="text-center mt-2 sm:mt-4 px-2 sm:px-0">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-yellow-400 drop-shadow-lg mb-2 sm:mb-4 tracking-tight leading-tight">
            Amigas na Lanchonete
          </h1>
          <p className="text-sm sm:text-lg text-slate-200 max-w-3xl mx-auto font-medium leading-relaxed drop-shadow px-2">
            Use a lógica e siga as pistas para descobrir a combinação perfeita entre as camisetas, nomes, idades, esportes e pedidos das nossas amigas! As pistas validarão automaticamente suas respostas.
          </p>
        </header>
        
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-4 sm:gap-8 items-start px-2 sm:px-0">
          <div className="xl:col-span-4 flex flex-col gap-4">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-2xl border border-white/20">
              <h2 className="text-xl sm:text-2xl font-bold text-yellow-400 mb-4 sm:mb-6 flex items-center gap-2 drop-shadow">
                <Search className="w-5 h-5 sm:w-6 sm:h-6" /> Pistas
              </h2>
              <ul className="flex flex-col gap-2 sm:gap-3 max-h-[45vh] xl:max-h-[700px] overflow-y-auto pr-2 sm:pr-3 custom-scrollbar">
                {CLUES.map((clue) => {
                  const status = clue.check(board);
                  let itemClass = "bg-white text-slate-800 border-l-[4px] sm:border-l-[6px] border-yellow-400 shadow-sm sm:shadow-md";
                  let Icon = HelpCircle;
                  let iconClass = "text-yellow-500 opacity-60";
                  
                  if (status === true) {
                    itemClass = "bg-slate-100 text-slate-400 border-l-[4px] sm:border-l-[6px] border-slate-300 line-through opacity-80 shadow-none";
                    Icon = CheckCircle2;
                    iconClass = "text-slate-400";
                  } else if (status === false) {
                    itemClass = "bg-red-50 text-red-800 border-l-[4px] sm:border-l-[6px] border-red-500 font-bold shadow-sm sm:shadow-md ring-1 ring-red-500";
                    Icon = XCircle;
                    iconClass = "text-red-600";
                  }
                  
                  return (
                    <li key={clue.id} className={`p-3 sm:p-4 rounded-lg sm:rounded-xl transition-all duration-300 flex items-start gap-2 sm:gap-3 ${itemClass}`}>
                      <Icon className={`w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0 mt-0.5 sm:mt-1 transition-colors ${iconClass}`} />
                      <span className="text-[13px] sm:text-[0.95rem] leading-snug">{clue.id}. {clue.text}</span>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
          
          <div className="xl:col-span-8 flex flex-col gap-6 w-full max-w-full overflow-hidden">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl sm:rounded-3xl p-3 sm:p-6 shadow-2xl border border-white/20 w-full">
              <h2 className="text-xl sm:text-2xl font-bold text-yellow-400 mb-4 sm:mb-6 flex items-center gap-2 drop-shadow px-1">
                <LayoutGrid className="w-5 h-5 sm:w-6 sm:h-6" /> Tabela de Respostas
              </h2>
              
              <div className="w-full overflow-x-auto rounded-lg sm:rounded-xl shadow-inner border border-white/10 bg-black/20 pb-2 sm:pb-4 custom-scrollbar" style={{ WebkitOverflowScrolling: 'touch' }}>
                <table className="w-full border-collapse min-w-[650px] sm:min-w-[750px]">
                  <thead>
                    <tr>
                      <th className="bg-slate-800/90 text-yellow-400 p-2 sm:p-4 border border-white/10 text-left font-bold text-sm sm:text-lg rounded-tl-lg sm:rounded-tl-xl border-b-2">Categoria</th>
                      {[1, 2, 3, 4, 5].map(i => {
                        const colColor = board[i-1].camiseta;
                        return (
                          <th key={i} className={`p-2 sm:p-4 border font-bold text-sm sm:text-lg text-center transition-colors duration-500 border-b-2 ${getColumnHeaderClass(colColor)}`}>
                            {i}ª Amiga
                          </th>
                        );
                      })}
                    </tr>
                  </thead>
                  <tbody>
                    {CATEGORIES.map((cat, rowIdx) => {
                      const duplicates = getDuplicates(board, cat.id);
                      return (
                        <tr key={cat.id}>
                          <td className={`bg-slate-100 text-slate-800 font-extrabold p-2 sm:p-4 border border-black/10 text-left text-[13px] sm:text-base whitespace-nowrap ${rowIdx === CATEGORIES.length - 1 ? 'rounded-bl-lg sm:rounded-bl-xl' : ''}`}>
                            {cat.label}
                          </td>
                          {board.map((col, colIndex) => {
                            const val = col[cat.id] || "";
                            const isDuplicate = val !== "" && duplicates.includes(val);
                            const colColor = board[colIndex].camiseta;
                            
                            return (
                              <td key={colIndex} className={`p-1.5 sm:p-3 text-center border transition-colors duration-500 ${getColumnCellClass(colColor)}`}>
                                <select
                                  value={val}
                                  onChange={(e) => updateBoard(colIndex, cat.id, e.target.value)}
                                  className={`w-full p-1.5 sm:p-2.5 rounded sm:rounded-lg text-[16px] sm:text-base leading-tight font-bold border-2 outline-none transition-all cursor-pointer text-center sm:appearance-auto ${getSelectClass(colColor)} ${isDuplicate ? '!border-red-500 !shadow-[0_0_8px_rgba(239,68,68,0.9)] sm:!shadow-[0_0_12px_rgba(239,68,68,0.9)] !text-red-700 animate-pulse' : ''}`}
                                  style={{ textAlignLast: 'center' }}
                                >
                                  <option value="" className="bg-slate-100 text-slate-500 font-normal text-[16px]">-- Selecione --</option>
                                  {OPTIONS[cat.id].map(opt => {
                                    if (!opt) return null;
                                    return (
                                      <option key={opt} value={opt} className="bg-white text-black font-bold text-[16px]">{opt}</option>
                                    );
                                  })}
                                </select>
                              </td>
                            );
                          })}
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              
              {message.type && (
                <div className={`mt-4 sm:mt-6 p-4 sm:p-5 rounded-xl sm:rounded-2xl flex items-center gap-3 sm:gap-4 font-bold text-sm sm:text-lg animate-in fade-in slide-in-from-bottom-4 shadow-xl ${message.type === 'success' ? 'bg-green-500/20 text-green-200 border border-green-500/50' : 'bg-red-500/20 text-red-200 border border-red-500/50'}`}>
                  {message.type === 'success' ? <Trophy className="w-6 h-6 sm:w-8 sm:h-8 flex-shrink-0 text-green-400" /> : <AlertCircle className="w-6 h-6 sm:w-8 sm:h-8 flex-shrink-0 text-red-400" />}
                  {message.text}
                </div>
              )}
              
              <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
                <button onClick={handleVerify} className="px-6 py-3 sm:px-8 sm:py-4 bg-green-600 hover:bg-green-500 text-white font-extrabold rounded-xl sm:rounded-2xl shadow-[0_4px_0_0_#166534] sm:shadow-[0_6px_0_0_#166534] hover:shadow-[0_2px_0_0_#166534] sm:hover:shadow-[0_4px_0_0_#166534] hover:translate-y-[2px] transition-all active:shadow-none active:translate-y-[4px] sm:active:translate-y-[6px] flex items-center justify-center gap-2 sm:gap-3 text-base sm:text-lg border border-green-700">
                  <CheckCircle2 className="w-5 h-5 sm:w-6 sm:h-6" /> Verificar Respostas
                </button>
                <button onClick={handleReset} className="px-6 py-3 sm:px-8 sm:py-4 bg-slate-700 hover:bg-slate-600 text-white font-bold rounded-xl sm:rounded-2xl shadow-[0_4px_0_0_#334155] sm:shadow-[0_6px_0_0_#334155] hover:shadow-[0_2px_0_0_#334155] sm:hover:shadow-[0_4px_0_0_#334155] hover:translate-y-[2px] transition-all active:shadow-none active:translate-y-[4px] sm:active:translate-y-[6px] flex items-center justify-center gap-2 sm:gap-3 text-base sm:text-lg border border-slate-800">
                  <RefreshCw className="w-5 h-5 sm:w-6 sm:h-6" /> Reiniciar
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

