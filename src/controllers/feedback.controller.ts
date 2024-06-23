/* eslint-disable no-inner-declarations */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextFunction, Request, Response } from 'express';
import { IFeedbackService } from '../services/feedback.service';
import { INewFinancialAssistantFeedback } from '../types/feedback';

interface IShowQuery {
  u?: string;
  s?: string;
  e?: string;
  id?: string;
}

export interface IFeedbackController {
  Index(req: Request, res: Response, next: NextFunction): Promise<void>;
  Create(req: Request, res: Response, next: NextFunction): Promise<void>;
  Show(req: Request, res: Response, next: NextFunction): Promise<void>;
}

export default class FeedbackController implements IFeedbackController {
  private Service: IFeedbackService;

  private GenerateHandlerError = (message: string, status: number) => {
    throw new Error(`HANDLER:${message}-${status}`);
  };

  constructor(svc: IFeedbackService) {
    this.Service = svc;
    this.Create = this.Create.bind(this);
    this.Show = this.Show.bind(this);
    this.Index = this.Index.bind(this);
  }

  async Index(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const feedbacks = await this.Service.Index();

      res.status(200).json(feedbacks);
    } catch (err) {
      next(err);
    }
  }

  async Create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const body = req.body;

      if (!body) {
        this.GenerateHandlerError('Invalid request body', 400);
      }

      function isValidFinancialAssistantFeedback(
        obj: any,
      ): obj is INewFinancialAssistantFeedback {
        return (
          typeof obj === 'object' &&
          obj !== null &&
          typeof obj.sheetId == 'string' &&
          typeof obj.chatId == 'string' &&
          typeof obj.email == 'string' &&
          typeof obj.anyError == 'boolean' &&
          typeof obj.easyToUse == 'boolean' &&
          typeof obj.goodAtAll == 'boolean' &&
          typeof obj.sugestions == 'string'
        );
      }

      if (!isValidFinancialAssistantFeedback(body)) {
        this.GenerateHandlerError('Invalid Feedback body request', 400);
      }

      const feedback = await this.Service.Create({
        sheetId: body.sheetId,
        chatId: body.chatId,
        email: body.email,
        easyToUse: body.easyToUse,
        goodAtAll: body.goodAtAll,
        sugestions: body.sugestions,
        anyError: body.anyError,
      });

      res
        .status(201)
        .json({ message: 'Feedback created successfully', id: feedback });
    } catch (err) {
      next(err);
    }
  }

  async Show(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const query = req.query as IShowQuery;
      if (query?.id) {
        const feedback = await this.Service.Show(query.id);
        res.status(200).json(feedback);
        return;
      }
      if (query?.e) {
        const feedback = await this.Service.ShowByEmail(query.e);
        res.status(200).json(feedback);
        return;
      }
      if (query?.u) {
        const feedback = await this.Service.ShowByUserId(query.u);
        res.status(200).json(feedback);
        return;
      }
      if (query?.s) {
        const feedback = await this.Service.ShowBySheetId(query.s);
        res.status(200).json(feedback);
        return;
      }
      this.GenerateHandlerError(`MALFORMED REQUEST must have a query`, 400);
    } catch (err) {
      next(err);
    }
  }
}
