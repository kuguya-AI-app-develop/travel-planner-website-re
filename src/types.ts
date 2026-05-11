export interface Trip {
  id: number;
  name: string;
  start: string;
  end: string;
  color: string;
}

export interface Flight {
  id: number;
  airline: string;
  code: string;
  route: string;
  dep: string;
  arr: string;
  price: number;
  cls: string;
  status: 'booked' | 'pending' | 'compare';
  selected: boolean;
}

export interface Hotel {
  id: number;
  name: string;
  location: string;
  price: string;
  priceNum: number;
  scores: number[];
  selected: boolean;
}

export interface ChecklistItem {
  id: number;
  text: string;
  done: boolean;
}

export type TabType = 'calendar' | 'flights' | 'hotels' | 'summary';
