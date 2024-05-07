import { firebaseTimesStampType } from './utils-types';

export interface INewUser {
  name: string;
  email: string;
}

export interface IUser extends INewUser {
  id: string;
  sheetIds: string[];
  createdAt?: firebaseTimesStampType;
}
