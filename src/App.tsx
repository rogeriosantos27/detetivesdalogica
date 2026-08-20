import React, { useState, useEffect } from 'react';
import { CheckCircle2, XCircle, HelpCircle, RefreshCw, Trophy, AlertCircle, Search, LayoutGrid, Loader2, Play } from 'lucide-react';
import { Column, Board, Difficulty, Puzzle } from './types';
import { generatePuzzle } from './generator';

export default function App() {
  const [puzzle, setPuzzle] = useState<Puzzle | null>(null);
  const [board, setBoard] = useState<Board>([]);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' | null }>({ text: '', type: null });
  const [isGenerating, setIsGenerating] = useState(false);

  const [gameStarted, setGameStarted] = useState(false);

  const startNewGame = async (diff: Difficulty) => {
    setGameStarted(true);
    setIsGenerating(true);
    setMessage({ text: '', type: null });
    
    // Allow UI to update to show loading spinner
    await new Promise(resolve => setTimeout(resolve, 50)); 
    
    try {
      const newPuzzle = generatePuzzle(diff);
      const emptyBoard: Board = Array(newPuzzle.columnsCount).fill(null).map(() => {
        const col: any = {};
        newPuzzle.categories.forEach(c => col[c.id] = "");
        return col;
      });
      setPuzzle(newPuzzle);
      setBoard(emptyBoard);
    } catch (e) {
      console.error(e);
      setMessage({ text: 'Erro ao gerar o desafio. Tente novamente.', type: 'error' });
    } finally {
      setIsGenerating(false);
    }
  };

  const updateBoard = (colIndex: number, type: string, value: string) => {
    const newBoard = [...board];
    
    if (value !== "") {
      const prevIndex = newBoard.findIndex(col => col[type] === value);
      if (prevIndex !== -1 && prevIndex !== colIndex) {
        newBoard[prevIndex] = { ...newBoard[prevIndex], [type]: "" };
      }
    }
    
    newBoard[colIndex] = { ...newBoard[colIndex], [type]: value };
    setBoard(newBoard);
    setMessage({ text: '', type: null });
  };

  const isFilled = puzzle ? puzzle.categories.every(cat => 
      board.every(col => col[cat.id] !== undefined && col[cat.id] !== "")
  ) : false;
  
  const cluesStatus = puzzle ? puzzle.clues.map(c => c.check(board)) : [];
  const isPerfect = isFilled && cluesStatus.length > 0 && cluesStatus.every(s => s === true);

  const handleReset = () => {
    if (!puzzle) return;
    if (confirm('Tem certeza que deseja limpar todo o tabuleiro atual?')) {
      const emptyBoard: Board = Array(puzzle.columnsCount).fill(null).map(() => {
        const col: any = {};
        puzzle.categories.forEach(c => col[c.id] = "");
        return col;
      });
      setBoard(emptyBoard);
      setMessage({ text: '', type: null });
    }
  };

  const getColorForValue = (val?: string) => {
    if (!val) return 'default';
    const lower = val.toLowerCase();
    if (lower.includes('amarel')) return 'amarela';
    if (lower.includes('azul')) return 'azul';
    if (lower.includes('pret')) return 'preta';
    if (lower.includes('verd')) return 'verde';
    if (lower.includes('vermelh')) return 'vermelha';
    if (lower.includes('branc')) return 'branca';
    if (lower.includes('cinz')) return 'cinza';
    if (lower.includes('marrom')) return 'marrom';
    if (lower.includes('rox')) return 'roxa';
    if (lower.includes('ros')) return 'rosa';
    if (lower.includes('laranj')) return 'laranja';
    if (lower.includes('pard')) return 'parda';
    return 'default';
  };

  const getColumnHeaderClass = (val?: string) => {
    switch (getColorForValue(val)) {
      case "amarela": return "bg-gradient-to-b from-yellow-400 to-yellow-500 text-yellow-950 border-yellow-600 shadow-[inset_0_2px_10px_rgba(255,255,255,0.4)]";
      case "azul": return "bg-gradient-to-b from-blue-500 to-blue-700 text-white border-blue-800 shadow-[inset_0_2px_10px_rgba(255,255,255,0.2)]";
      case "preta": return "bg-gradient-to-b from-slate-700 to-slate-900 text-white border-black shadow-[inset_0_2px_10px_rgba(255,255,255,0.1)]";
      case "verde": return "bg-gradient-to-b from-green-500 to-green-700 text-white border-green-800 shadow-[inset_0_2px_10px_rgba(255,255,255,0.2)]";
      case "vermelha": return "bg-gradient-to-b from-red-500 to-red-700 text-white border-red-800 shadow-[inset_0_2px_10px_rgba(255,255,255,0.2)]";
      case "branca": return "bg-gradient-to-b from-slate-50 to-slate-200 text-slate-900 border-slate-300 shadow-[inset_0_2px_10px_rgba(0,0,0,0.1)]";
      case "cinza": return "bg-gradient-to-b from-slate-400 to-slate-600 text-white border-slate-700 shadow-[inset_0_2px_10px_rgba(255,255,255,0.2)]";
      case "marrom": return "bg-gradient-to-b from-amber-700 to-amber-900 text-white border-amber-950 shadow-[inset_0_2px_10px_rgba(255,255,255,0.2)]";
      case "roxa": return "bg-gradient-to-b from-purple-500 to-purple-700 text-white border-purple-800 shadow-[inset_0_2px_10px_rgba(255,255,255,0.2)]";
      case "rosa": return "bg-gradient-to-b from-pink-400 to-pink-600 text-white border-pink-700 shadow-[inset_0_2px_10px_rgba(255,255,255,0.2)]";
      case "laranja": return "bg-gradient-to-b from-orange-400 to-orange-600 text-white border-orange-700 shadow-[inset_0_2px_10px_rgba(255,255,255,0.2)]";
      case "parda": return "bg-gradient-to-b from-stone-400 to-stone-600 text-white border-stone-700 shadow-[inset_0_2px_10px_rgba(255,255,255,0.2)]";
      default: return "bg-slate-800/90 text-yellow-400 border-white/10";
    }
  };

  const getColumnCellClass = (val?: string) => {
    switch (getColorForValue(val)) {
      case "amarela": return "bg-yellow-300 border-yellow-400";
      case "azul": return "bg-blue-500 border-blue-600";
      case "preta": return "bg-slate-600 border-slate-700";
      case "verde": return "bg-green-500 border-green-600";
      case "vermelha": return "bg-red-500 border-red-600";
      case "branca": return "bg-slate-200 border-slate-300";
      case "cinza": return "bg-slate-400 border-slate-500";
      case "marrom": return "bg-amber-800 border-amber-900";
      case "roxa": return "bg-purple-500 border-purple-600";
      case "rosa": return "bg-pink-400 border-pink-500";
      case "laranja": return "bg-orange-400 border-orange-500";
      case "parda": return "bg-stone-400 border-stone-500";
      default: return "bg-white/95 border-black/10";
    }
  };

  const getSelectClass = (val?: string) => {
    if (getColorForValue(val) !== 'default') {
      return "bg-white/95 text-slate-900 border-transparent shadow-md hover:shadow-lg focus:ring-2 focus:ring-white/50";
    }
    return "bg-white text-slate-800 border-slate-300 shadow-sm hover:border-slate-400";
  };

  if (!gameStarted) {
    return (
      <div className="min-h-screen bg-slate-900 bg-cover bg-center bg-fixed text-slate-100 flex flex-col items-center justify-center font-sans p-4" style={{ backgroundImage: "linear-gradient(135deg, rgba(15,23,42,0.95), rgba(30,58,138,0.95)), url('https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=2574&auto=format&fit=crop')" }}>
        <div className="bg-black/60 backdrop-blur-xl p-8 sm:p-12 rounded-3xl border border-white/20 shadow-2xl max-w-2xl w-full text-center animate-in fade-in zoom-in duration-500">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-yellow-400 drop-shadow-lg mb-6 tracking-tight leading-tight">
            Detetives da Lógica
          </h1>
          <p className="text-lg sm:text-xl text-slate-200 mb-10 font-medium leading-relaxed">
            Cada partida é um novo mistério. Analise as pistas e descubra a solução!
          </p>
          
          <div className="flex flex-col sm:flex-row flex-wrap justify-center gap-3 sm:gap-4 max-w-4xl mx-auto">
            {(['MUITO FÁCIL', 'FÁCIL', 'MÉDIO', 'DIFÍCIL', 'MUITO DIFÍCIL'] as Difficulty[]).map(diff => (
              <button
                key={diff}
                onClick={() => startNewGame(diff)}
                disabled={isGenerating}
                className={`px-4 sm:px-6 py-4 sm:py-5 rounded-2xl font-bold transition-all text-sm sm:text-base md:text-lg flex flex-1 min-w-[140px] items-center justify-center gap-2 sm:gap-3 ${isGenerating ? 'opacity-50 cursor-not-allowed bg-slate-800' : 'bg-slate-800 text-slate-100 hover:bg-yellow-400 hover:text-yellow-950 hover:shadow-[0_0_20px_rgba(250,204,21,0.5)] hover:-translate-y-1 border border-slate-600 hover:border-yellow-400'} shadow-lg`}
              >
                {isGenerating ? <Loader2 className="w-5 h-5 animate-spin" /> : <Play className="w-5 h-5" />}
                {diff}
              </button>
            ))}
          </div>
          
          {isGenerating && (
            <div className="mt-8 text-yellow-300 animate-pulse font-semibold">
              Gerando desafio único...
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900 bg-cover bg-center bg-fixed text-slate-100 p-2 sm:p-6 md:p-8 flex flex-col items-center font-sans" style={{ backgroundImage: "linear-gradient(135deg, rgba(15,23,42,0.95), rgba(30,58,138,0.95)), url('https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=2574&auto=format&fit=crop')" }}>
      <div className="w-full max-w-7xl mx-auto flex flex-col gap-4 sm:gap-8 pb-8 sm:pb-12">
        <header className="text-center mt-2 sm:mt-4 px-2 sm:px-0">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-yellow-400 drop-shadow-lg mb-2 sm:mb-4 tracking-tight leading-tight">
            Detetives da Lógica
          </h1>
          <p className="text-sm sm:text-lg text-slate-200 max-w-3xl mx-auto font-medium leading-relaxed drop-shadow px-2">
            Cada partida é um novo mistério. Analise as pistas e descubra a solução!
          </p>
          
          <div className="mt-6 flex flex-wrap justify-center gap-2 sm:gap-3 bg-black/40 p-3 sm:p-4 rounded-2xl backdrop-blur-md border border-white/10 max-w-4xl mx-auto">
            <div className="w-full text-center mb-1 sm:mb-2 text-slate-300 font-semibold text-xs sm:text-sm tracking-wide uppercase">Gerar Novo Desafio</div>
            {(['MUITO FÁCIL', 'FÁCIL', 'MÉDIO', 'DIFÍCIL', 'MUITO DIFÍCIL'] as Difficulty[]).map(diff => (
              <button
                key={diff}
                onClick={() => startNewGame(diff)}
                disabled={isGenerating}
                className={`px-3 sm:px-5 py-1.5 sm:py-2 rounded-xl font-bold transition-all text-[11px] sm:text-sm md:text-base flex items-center gap-1.5 sm:gap-2 ${puzzle?.difficulty === diff && !isGenerating ? 'bg-yellow-400 text-yellow-950 shadow-[0_0_15px_rgba(250,204,21,0.4)]' : 'bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700 hover:border-slate-500'} ${isGenerating ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {isGenerating && puzzle?.difficulty === diff ? <Loader2 className="w-3 h-3 sm:w-4 sm:h-4 animate-spin" /> : <Play className="w-3 h-3 sm:w-4 sm:h-4" />}
                {diff}
              </button>
            ))}
          </div>
        </header>
        
        {isGenerating ? (
          <div className="flex flex-col items-center justify-center py-24 gap-6">
            <Loader2 className="w-16 h-16 text-yellow-400 animate-spin" />
            <h2 className="text-2xl font-bold text-white drop-shadow-md text-center">Gerando um novo desafio único...</h2>
            <p className="text-slate-300 text-center px-4">Testando milhares de combinações para garantir uma solução perfeita.</p>
          </div>
        ) : puzzle ? (
          <div className="flex flex-col gap-4 sm:gap-8 w-full animate-in fade-in duration-500">
            <div className="text-center mb-2 px-2">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white drop-shadow-md">
                {puzzle.scenario.title}
              </h2>
              <p className="text-slate-300 text-sm sm:text-base mt-2 max-w-2xl mx-auto font-medium">
                {puzzle.scenario.description}
              </p>
            </div>
            
            <div className="grid grid-cols-1 xl:grid-cols-12 gap-4 sm:gap-8 items-start px-2 sm:px-0">
            <div className="xl:col-span-4 flex flex-col gap-4">
              <div className="bg-white/10 backdrop-blur-md rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-2xl border border-white/20">
                <div className="flex justify-between items-center mb-4 sm:mb-6">
                  <h2 className="text-xl sm:text-2xl font-bold text-yellow-400 flex items-center gap-2 drop-shadow">
                    <Search className="w-5 h-5 sm:w-6 sm:h-6" /> Pistas
                  </h2>
                  <span className="px-3 py-1 bg-yellow-400/20 text-yellow-300 rounded-full text-xs font-bold border border-yellow-400/30">
                    Nível: {puzzle.difficulty}
                  </span>
                </div>
                
                <ul className="flex flex-col gap-2 sm:gap-3 max-h-[45vh] xl:max-h-[700px] overflow-y-auto pr-2 sm:pr-3 custom-scrollbar">
                  {puzzle.clues.map((clue) => {
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
                  <table className={`w-full border-collapse ${puzzle.columnsCount <= 3 ? 'min-w-[400px]' : puzzle.columnsCount === 4 ? 'min-w-[500px]' : 'min-w-[650px] sm:min-w-[750px]'}`}>
                    <thead>
                      <tr>
                        <th className="sticky left-0 z-20 bg-slate-900 text-yellow-400 p-2 sm:p-4 border border-white/10 text-left font-bold text-sm sm:text-lg rounded-tl-lg sm:rounded-tl-xl border-b-2 shadow-[2px_0_8px_rgba(0,0,0,0.5)]">Categoria</th>
                        {Array(puzzle.columnsCount).fill(0).map((_, i) => {
                          const colorCatId = puzzle.categories.find(c => c.isColor)?.id;
                          const colColor = colorCatId ? board[i]?.[colorCatId] : undefined;
                          return (
                            <th key={i} className={`p-2 sm:p-4 border font-bold text-sm sm:text-lg text-center transition-colors duration-500 border-b-2 ${getColumnHeaderClass(colColor)}`}>
                              {i + 1}º {puzzle.scenario.entityName}
                            </th>
                          );
                        })}
                      </tr>
                    </thead>
                    <tbody>
                      {puzzle.categories.map((cat, rowIdx) => {
                        return (
                          <tr key={cat.id}>
                            <td className={`sticky left-0 z-10 bg-slate-100 text-slate-800 font-extrabold p-2 sm:p-4 border border-black/10 border-r-slate-300 text-left text-[13px] sm:text-base whitespace-nowrap shadow-[2px_0_8px_rgba(0,0,0,0.15)] ${rowIdx === puzzle.categories.length - 1 ? 'rounded-bl-lg sm:rounded-bl-xl' : ''}`}>
                              {cat.label}
                            </td>
                            {board.map((col, colIndex) => {
                              const val = col[cat.id] || "";
                              const colorCatId = puzzle.categories.find(c => c.isColor)?.id;
                              const colColor = colorCatId ? board[colIndex]?.[colorCatId] : undefined;
                              
                              return (
                                <td key={colIndex} className={`p-1.5 sm:p-3 text-center border transition-colors duration-500 ${getColumnCellClass(colColor)}`}>
                                  <select
                                    value={val}
                                    onChange={(e) => updateBoard(colIndex, cat.id, e.target.value)}
                                    className={`w-full p-1.5 sm:p-2.5 rounded sm:rounded-lg text-[16px] sm:text-base leading-tight font-bold border-2 outline-none transition-all cursor-pointer text-center sm:appearance-auto ${getSelectClass(colColor)}`}
                                    style={{ textAlignLast: 'center' }}
                                  >
                                    <option value="" className="bg-slate-100 text-slate-500 font-normal text-[16px]">-- Selecione --</option>
                                    {puzzle.options[cat.id].map(opt => {
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
                
                {isPerfect && (
                  <div className="mt-6 p-6 rounded-2xl flex items-center justify-center gap-4 animate-in fade-in zoom-in slide-in-from-bottom-4 shadow-2xl bg-green-500 text-white border-2 border-green-400">
                    <Trophy className="w-10 h-10 sm:w-12 sm:h-12 flex-shrink-0 text-yellow-300 drop-shadow-md" />
                    <div className="text-left">
                      <div className="text-2xl sm:text-3xl font-black drop-shadow-md text-white">Desafio Resolvido!</div>
                      <div className="text-green-100 font-bold text-sm sm:text-lg">Você completou o enigma com perfeição!</div>
                    </div>
                  </div>
                )}
                
                {message.type && !isPerfect && (
                  <div className={`mt-4 sm:mt-6 p-4 sm:p-5 rounded-xl sm:rounded-2xl flex items-center gap-3 sm:gap-4 font-bold text-sm sm:text-lg animate-in fade-in slide-in-from-bottom-4 shadow-xl ${message.type === 'success' ? 'bg-green-500/20 text-green-200 border border-green-500/50' : 'bg-red-500/20 text-red-200 border border-red-500/50'}`}>
                    {message.type === 'success' ? <Trophy className="w-6 h-6 sm:w-8 sm:h-8 flex-shrink-0 text-green-400" /> : <AlertCircle className="w-6 h-6 sm:w-8 sm:h-8 flex-shrink-0 text-red-400" />}
                    {message.text}
                  </div>
                )}
                
                <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
                  <button onClick={() => setGameStarted(false)} className="px-6 py-3 sm:px-8 sm:py-4 bg-yellow-500 hover:bg-yellow-400 text-yellow-950 font-extrabold rounded-xl sm:rounded-2xl shadow-[0_4px_0_0_#a16207] sm:shadow-[0_6px_0_0_#a16207] hover:shadow-[0_2px_0_0_#a16207] sm:hover:shadow-[0_4px_0_0_#a16207] hover:translate-y-[2px] transition-all active:shadow-none active:translate-y-[4px] sm:active:translate-y-[6px] flex items-center justify-center gap-2 sm:gap-3 text-base sm:text-lg border border-yellow-600">
                    <Play className="w-5 h-5 sm:w-6 sm:h-6" /> Novo Desafio
                  </button>
                  <button onClick={handleReset} className="px-6 py-3 sm:px-8 sm:py-4 bg-slate-700 hover:bg-slate-600 text-white font-bold rounded-xl sm:rounded-2xl shadow-[0_4px_0_0_#334155] sm:shadow-[0_6px_0_0_#334155] hover:shadow-[0_2px_0_0_#334155] sm:hover:shadow-[0_4px_0_0_#334155] hover:translate-y-[2px] transition-all active:shadow-none active:translate-y-[4px] sm:active:translate-y-[6px] flex items-center justify-center gap-2 sm:gap-3 text-base sm:text-lg border border-slate-800">
                    <RefreshCw className="w-5 h-5 sm:w-6 sm:h-6" /> Limpar Tabela
                  </button>
                </div>
              </div>
            </div>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
