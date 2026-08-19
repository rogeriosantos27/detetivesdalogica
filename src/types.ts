export type Difficulty = 'MUITO FÁCIL' | 'FÁCIL' | 'MÉDIO' | 'DIFÍCIL' | 'MUITO DIFÍCIL';

export interface CategoryDef {
  id: string;
  label: string;
  options: string[];
  subjectTemplate: string;
  isColor?: boolean;
}

export interface Scenario {
  id: string;
  title: string;
  description: string;
  entityName: string; // e.g. "Cliente", "Aluna"
  categories: CategoryDef[];
}

export type Column = Record<string, string>;
export type Board = Column[];

export interface Clue {
  id: number;
  text: string;
  check: (board: Board) => boolean | null;
}

export interface Puzzle {
  id: string;
  difficulty: Difficulty;
  scenario: Scenario;
  columnsCount: number;
  categories: CategoryDef[];
  options: Record<string, string[]>;
  clues: Clue[];
  solution: Board;
}
