import { IUserRepository } from '../repositories/user.repository';
import { IUser } from '../types/user';
import isValidEmail from '../utils/email';

export interface IUserService {
  Create(email: string, name: string): Promise<{ id: string }>;
  AddSheetId(id: string, sheetId: string): Promise<void>;
  RemoveSheetId(id: string, sheetId: string): Promise<void>;
  Show(id: string): Promise<IUser>;
  ShowByEmail(email: string): Promise<IUser>;
  ShowSheetIds(id: string): Promise<string[]>;
  Update(user: IUser): Promise<void>;
  Delete(id: string): Promise<void>;
}

const generateServiceError = (message: string, status: number) => {
  throw new Error(`SERVICE:${message}-${status}`);
};

export default function getUserService(
  repository: IUserRepository,
): IUserService {
  async function Create(email: string, name: string): Promise<{ id: string }> {
    if (!isValidEmail(email)) {
      generateServiceError(`INVALID EMAIL: ${email}`, 400);
    }
    const resp = await repository.Create(email, name);

    return resp;
  }

  async function Show(id: string): Promise<IUser> {
    return repository.Show(id);
  }

  async function ShowByEmail(email: string): Promise<IUser> {
    if (!isValidEmail(email)) {
      generateServiceError(`INVALID EMAIL: ${email}`, 400);
    }
    return repository.ShowByEmail(email);
  }

  async function ShowSheetIds(id: string): Promise<string[]> {
    return repository.ShowSheetIds(id);
  }

  async function Update(user: IUser): Promise<void> {
    if (!isValidEmail(user.email)) {
      generateServiceError(`INVALID EMAIL: ${user.email}`, 400);
    }
    await repository.Update(user);
  }

  async function Delete(id: string): Promise<void> {
    await repository.Delete(id);
  }

  async function AddSheetId(id: string, sheetId: string): Promise<void> {
    const user = await Show(id);

    if (!user) {
      generateServiceError(`USER NOT FOUND: ${id}`, 404);
    }

    const sheetIds = [...user.sheetIds];

    if (sheetIds.includes(sheetId)) {
      generateServiceError(`SHEET ALREADY ADDED: ${sheetId}`, 400);
    }

    sheetIds.push(sheetId);

    user.sheetIds = sheetIds;

    await repository.Update(user);
  }

  async function RemoveSheetId(id: string, sheetId: string): Promise<void> {
    const user = await Show(id);

    if (!user) {
      generateServiceError(`USER NOT FOUND: ${id}`, 404);
    }

    let sheetIds = [...user.sheetIds];

    if (!sheetIds.includes(sheetId)) {
      generateServiceError(`SHEET ALREADY NOT ADDED: ${sheetId}`, 400);
    }

    sheetIds = sheetIds.filter((sheet) => sheet !== sheetId);

    user.sheetIds = sheetIds;

    await repository.Update(user);
  }

  return {
    Create,
    Update,
    Delete,
    Show,
    ShowByEmail,
    ShowSheetIds,
    AddSheetId,
    RemoveSheetId,
  };
}
