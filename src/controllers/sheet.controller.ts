import { Request, Response, NextFunction } from 'express';
import { ISheetService } from '../services/sheet.service';
import getCheckTaskSvc from '../services/check-task.service';

export interface ISheetController {
  Show(req: Request, res: Response, next: NextFunction): Promise<void>;
  ShowItems(req: Request, res: Response, next: NextFunction): Promise<void>;
  ShowDisplayData(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void>;
  VerifyTask(req: Request, res: Response, next: NextFunction): Promise<void>;
}

const generateHandlerError = (message: string, status: number) => {
  throw new Error(`HANDLER:${message}-${status}`);
};

export default function getSheetController(
  sheetSvc: ISheetService,
): ISheetController {
  async function Show(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { id } = req.params;

      if (!id) {
        generateHandlerError(`INVALID ID: ${id}`, 400);
      }

      const sheet = await sheetSvc.Show(id);

      if (!sheet) {
        generateHandlerError(`SHEET NOT FOUND - ID: ${id}`, 404);
      }

      res.status(200).json(sheet);
    } catch (err) {
      next(err);
    }
  }

  async function ShowItems(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { id } = req.params;

      if (!id) {
        generateHandlerError(`INVALID ID: ${id}`, 400);
      }

      const items = await sheetSvc.ShowItems(id);

      if (!items) {
        generateHandlerError(`ITEMS NOT FOUND - ID: ${id}`, 404);
      }

      res.status(200).json(items);
    } catch (err) {
      next(err);
    }
  }

  async function ShowDisplayData(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { u } = req.params;

      if (!u) {
        generateHandlerError(`INVALID USER ID - ID: ${u}`, 400);
      }

      const metada = await sheetSvc.ShowDisplayData(u);

      res.status(200).json(metada);
    } catch (err) {
      next(err);
    }
  }

  async function VerifyTask(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const sheetId = req.body.sheetId;

      if (!sheetId) {
        generateHandlerError(`INVALID SHEET ID - ID: ${sheetId}`, 400);
      }

      const { checkTask } = getCheckTaskSvc({
        itemsProvider: sheetSvc.ShowItems,
      });

      const hasBeenDone = await checkTask(sheetId);

      res.status(200).json({
        hasBeenDone: hasBeenDone,
      });
    } catch (err) {
      next(err);
    }
  }

  return {
    Show,
    ShowItems,
    ShowDisplayData,
    VerifyTask,
  };
}
