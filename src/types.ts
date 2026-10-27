export interface FlashCard {
  id: string;
  question: string;
  answer: string;
}

export type CardOutcome = 'got-it' | 'missed';
