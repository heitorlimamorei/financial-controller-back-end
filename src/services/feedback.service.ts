import { IFeedbackRepository } from '../repositories/feedback.repository';
import { IFinancialAssistantFeedback } from '../types/feedback';
import { IUserService } from './user.service';

interface FeedbackDto {
  sheetId: string;
  chatId: string;
  email: string;
  anyError: boolean;
  easyToUse: boolean;
  goodAtAll: boolean;
  sugestions: string;
}

export interface IFeedbackService {
  Index(): Promise<IFinancialAssistantFeedback[]>;
  Create(props: FeedbackDto): Promise<string>;
  Show(id: string): Promise<IFinancialAssistantFeedback>;
  ShowByEmail(email: string): Promise<IFinancialAssistantFeedback>;
  ShowBySheetId(sheetId: string): Promise<IFinancialAssistantFeedback>;
  ShowByUserId(userId: string): Promise<IFinancialAssistantFeedback>;
}

export default class FeedbackService implements IFeedbackService {
  private UserService: IUserService;
  private Repository: IFeedbackRepository;

  private GenerateServiceError(message: string, status: number): void {
    throw new Error(`SERVICE:${message}-${status}`);
  }

  constructor(userSvc: IUserService, repo: IFeedbackRepository) {
    this.UserService = userSvc;
    this.Repository = repo;
    this.Index = this.Index.bind(this);
    this.Create = this.Create.bind(this);
    this.Show = this.Show.bind(this);
    this.ShowByEmail = this.ShowByEmail.bind(this);
    this.ShowBySheetId = this.ShowBySheetId.bind(this);
    this.ShowByUserId = this.ShowByUserId.bind(this);
  }

  async Index(): Promise<IFinancialAssistantFeedback[]> {
    const feedbacks = await this.Repository.Index();
    return feedbacks;
  }

  async Create(props: FeedbackDto): Promise<string> {
    const user = await this.UserService.ShowByEmail(props.email);

    if (!user) {
      this.GenerateServiceError('Cannot find this user: ' + props.email, 400);
    }

    const feedbackId = await this.Repository.Create({
      ...props,
      userId: user.id,
    });

    return feedbackId;
  }

  async Show(id: string): Promise<IFinancialAssistantFeedback> {
    const feedback = await this.Repository.Show(id);
    return feedback;
  }

  async ShowByEmail(email: string): Promise<IFinancialAssistantFeedback> {
    const feedback = await this.Repository.ShowByEmail(email);
    return feedback;
  }

  async ShowBySheetId(sheetId: string): Promise<IFinancialAssistantFeedback> {
    const feedback = await this.Repository.ShowBySheetId(sheetId);
    return feedback;
  }

  async ShowByUserId(userId: string): Promise<IFinancialAssistantFeedback> {
    const feedback = await this.Repository.ShowByUserId(userId);
    return feedback;
  }
}
