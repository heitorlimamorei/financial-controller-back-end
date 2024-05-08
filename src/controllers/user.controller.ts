import { IUserService } from '../services/user.service';
import { Request, Response, NextFunction } from 'express';
import { IUser, INewUser } from '../types/user';

export interface IUserController {
  Create(req: Request, res: Response, next: NextFunction): Promise<void>;
  AddSheetId(req: Request, res: Response, next: NextFunction): Promise<void>;
  RemoveSheetId(req: Request, res: Response, next: NextFunction): Promise<void>;
  Show(req: Request, res: Response, next: NextFunction): Promise<void>;
  Update(req: Request, res: Response, next: NextFunction): Promise<void>;
  Delete(req: Request, res: Response, next: NextFunction): Promise<void>;
}

const generateHandlerError = (message: string, status: number) => {
  throw new Error(`HANDLER:${message}-${status}`);
};

interface IShowQuery {
  shids?: string;
  id?: string;
  email?: string;
  tokenscount?: string;
}

export default function getUserController(
  service: IUserService,
): IUserController {
  async function Create(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { email, name } = req.body as INewUser;
      if (!email || !name) {
        generateHandlerError(`MALFORMED BODY: ${req.body}`, 400);
      }
      if (name.length < 3) {
        generateHandlerError(`INVALID NAME: ${name}`, 400);
      }
      const user = await service.Create(email, name);

      res.status(201).json({
        message: 'User created successfully',
        userId: user.id,
      });
    } catch (err: unknown) {
      next(err);
    }
  }
  async function Show(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const query = req.query as IShowQuery;
      if (query?.id) {
        const user = await service.Show(query.id);
        res.status(200).json(user);
        return;
      }
      if (query?.email) {
        const user = await service.ShowByEmail(query.email);
        res.status(200).json(user);
        return;
      }
      if (query?.shids) {
        const user = await service.ShowSheetIds(query.shids);
        res.status(200).json(user);
        return;
      }
      generateHandlerError(`MALFORMED REQUEST must have a query`, 400);
    } catch (err: unknown) {
      next(err);
    }
  }
  async function Update(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const user = req.body as IUser;
      if (!user.email || !user.name || !user.id || !user.sheetIds) {
        generateHandlerError(`MALFORMED BODY: ${req.body}`, 400);
      }
      await service.Update(user);
      res.status(201).json({
        message: 'User updated successfully',
      });
    } catch (err: unknown) {
      next(err);
    }
  }
  async function Delete(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const id = req.params.id;
      if (!id) {
        generateHandlerError(`MALFORMED REQUEST must have an id`, 400);
      }
      await service.Delete(id);
      res.status(201).json({
        message: 'User deleted successfully',
      });
    } catch (err: unknown) {
      next(err);
    }
  }

  async function AddSheetId(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { id, sheetId } = req.body as { id: string; sheetId: string };
      if (!id || !sheetId) {
        generateHandlerError(`MALFORMED BODY: ${req.body}`, 400);
      }
      await service.AddSheetId(id, sheetId);
      res.status(201).json({
        message: 'Sheet added successfully',
      });
    } catch (err: unknown) {
      next(err);
    }
  }

  async function RemoveSheetId(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const { id, sheetId } = req.body as { id: string; sheetId: string };
      if (!id || !sheetId) {
        generateHandlerError(`MALFORMED BODY: ${req.body}`, 400);
      }
      await service.RemoveSheetId(id, sheetId);
      res.status(201).json({
        message: 'Sheet removed successfully',
      });
    } catch (err: unknown) {
      next(err);
    }
  }

  return {
    Create,
    AddSheetId,
    RemoveSheetId,
    Show,
    Update,
    Delete,
  };
}
