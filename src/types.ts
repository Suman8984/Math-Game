export type View = 'splash' | 'menu' | 'std1' | 'std2' | 'std3' | 'std4' | 'math_game';

export type Operator = '+' | '-' | '×' | '÷';

export interface Question {
  id: number;
  num1: number;
  num2: number;
  num3?: number; // Optional third number for STD IV Section A
  operator: Operator; // This will be the first operator
  operator2?: Operator; // Optional second operator for STD IV Section A
  intermediateAnswer?: number; // Stores the result of num1 op num2
  answer: number;
}

export interface GameQuestion extends Question {
  x: number;
  y: number;
  speed: number;
}

export type QuizMode = 'std2' | 'std4';

export interface QuizResult {
    question: Question;
    userAnswer: string;
    isCorrect: boolean;
}