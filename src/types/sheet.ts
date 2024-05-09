import { firebaseTimesStampType } from './utils-types';

export default interface ISheet {
  id: string;
  owner: string;
  type: string;
  name: string;
  tiposDeGastos: string[];
  totalValue: number;
}

export interface ISheetItem {
  id: string;
  name: string;
  type: number;
  description: string;
  author: string;
  date?: firebaseTimesStampType;
}

export interface ISheetDisplayData {
  id: string;
  name: string;
  owner: string;
}
