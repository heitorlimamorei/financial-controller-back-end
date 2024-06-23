import { firebaseTimesStampType } from './utils-types';

export interface INewFinancialAssistantFeedback {
  userId: string;
  sheetId: string;
  chatId: string;
  email: string;
  anyError: boolean;
  easyToUse: boolean;
  goodAtAll: boolean;
  sugestions: string;
}

export interface IFinancialAssistantFeedback
  extends INewFinancialAssistantFeedback {
  id: string;
  timestamp: firebaseTimesStampType;
}
