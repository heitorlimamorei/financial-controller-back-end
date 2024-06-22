import { ISheetRepository } from '../repositories/sheet.repository';
import ISheet, { ISheetDisplayData, ISheetItem } from '../types/sheet';
import { PromiseScheduler } from '../utils/promises';
import { IUserService } from './user.service';

const generateServiceError = (message: string, status: number) => {
  throw new Error(`SERVICE:${message}-${status}`);
};

export interface ISheetService {
  Show(id: string): Promise<ISheet>;
  ShowItems(id: string): Promise<ISheetItem[]>;
  ShowDisplayData(userId: string): Promise<ISheetDisplayData[]>;
}

export default function getSheetService(
  repository: ISheetRepository,
  userSvc: IUserService,
): ISheetService {
  async function Show(id: string): Promise<ISheet> {
    const sheet = await repository.Show(id);
    return sheet;
  }

  async function ShowItems(id: string): Promise<ISheetItem[]> {
    const items = await repository.ShowItems(id);
    return items;
  }

  async function ShowDisplayData(userId: string): Promise<ISheetDisplayData[]> {
    const user = await userSvc.Show(userId);

    if (!user) {
      generateServiceError('USER NOT FOUND', 404);
    }

    const sheetIds = user.sheetIds;

    if (sheetIds.length == 0) {
      return [];
    }

    const promises: Promise<ISheet>[] = sheetIds.map((sheetId) =>
      repository.Show(sheetId),
    );

    const sheets = await PromiseScheduler(promises);

    if (sheetIds.length != sheets.length) {
      generateServiceError('SHEET NOT FOUND', 404);
    }

    const displayData: ISheetDisplayData[] = sheets.map((sheet) => {
      return {
        id: sheet.id,
        name: sheet.name,
        owner: sheet.owner,
      };
    });

    return displayData;
  }

  return {
    Show,
    ShowItems,
    ShowDisplayData,
  };
}
