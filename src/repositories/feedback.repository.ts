/* eslint-disable no-unused-vars */
import {
  DocumentData,
  Firestore,
  QuerySnapshot,
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
} from 'firebase/firestore';
import {
  IFinancialAssistantFeedback,
  INewFinancialAssistantFeedback,
} from '../types/feedback';

export interface IFeedbackRepository {
  Index(): Promise<IFinancialAssistantFeedback[]>;
  Create(props: INewFinancialAssistantFeedback): Promise<string>;
  Show(id: string): Promise<IFinancialAssistantFeedback>;
  ShowByEmail(email: string): Promise<IFinancialAssistantFeedback>;
  ShowBySheetId(sheetId: string): Promise<IFinancialAssistantFeedback>;
  ShowByUserId(userId: string): Promise<IFinancialAssistantFeedback>;
}

type ProcessSnapshotsType = <T>(
  data: QuerySnapshot<DocumentData, DocumentData>,
) => T[];

export default class FeedbackRepository implements IFeedbackRepository {
  private ProcessSnapshots: ProcessSnapshotsType;
  private db: Firestore;

  private GenerateRepositoryError(message: string, status: number): void {
    throw new Error(`REPOSITORY:${message}-${status}`);
  }

  constructor(firestore: Firestore, processSnaps: ProcessSnapshotsType) {
    this.ProcessSnapshots = processSnaps;
    this.db = firestore;
    this.Index = this.Index.bind(this);
    this.Create = this.Create.bind(this);
    this.ShowByEmail = this.ShowByEmail.bind(this);
    this.ShowBySheetId = this.ShowBySheetId.bind(this);
    this.ShowByUserId = this.ShowByUserId.bind(this);
  }

  async Index(): Promise<IFinancialAssistantFeedback[]> {
    const collectionRef = collection(this.db, 'assistantfeedback');
    const feedbacksSnapshot = await getDocs(collectionRef);

    if (!feedbacksSnapshot) {
      this.GenerateRepositoryError('No feedback found', 400);
    }

    const feedbacks =
      this.ProcessSnapshots<IFinancialAssistantFeedback>(feedbacksSnapshot);

    return feedbacks;
  }

  async Create(props: INewFinancialAssistantFeedback): Promise<string> {
    const collectionRef = collection(this.db, 'assistantfeedback');

    const feedback = {
      ...props,
      timestamp: new Date(),
    };

    const docRef = await addDoc(collectionRef, feedback);

    if (!docRef.id) {
      this.GenerateRepositoryError('Could not save the feedback', 500);
    }

    return docRef.id;
  }

  async Show(id: string): Promise<IFinancialAssistantFeedback> {
    const collectionRef = collection(this.db, 'assistantfeedback');

    const docRef = doc(collectionRef, id);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      this.GenerateRepositoryError('Could not find feedback', 404);
    }

    const feedback = {
      id: id,
      ...docSnap.data(),
    } as IFinancialAssistantFeedback;

    return feedback;
  }

  async ShowByEmail(email: string): Promise<IFinancialAssistantFeedback> {
    const collectionRef = collection(this.db, 'assistantfeedback');

    const q = query(collectionRef, where('email', '==', email));

    const snashots = await getDocs(q);

    const feedbacks =
      this.ProcessSnapshots<IFinancialAssistantFeedback>(snashots);

    if (feedbacks.length == 0) {
      this.GenerateRepositoryError('Could not find any feedback', 404);
    }

    if (feedbacks.length > 1) {
      this.GenerateRepositoryError(
        'More than one feedback found for this email',
        500,
      );
    }

    return feedbacks[0];
  }

  async ShowBySheetId(sheetId: string): Promise<IFinancialAssistantFeedback> {
    const collectionRef = collection(this.db, 'assistantfeedback');

    const q = query(collectionRef, where('sheetId', '==', sheetId));

    const snashots = await getDocs(q);

    const feedbacks =
      this.ProcessSnapshots<IFinancialAssistantFeedback>(snashots);

    if (feedbacks.length == 0) {
      this.GenerateRepositoryError('Could not find any feedback', 404);
    }

    if (feedbacks.length > 1) {
      this.GenerateRepositoryError(
        'More than one feedback found for this sheet',
        500,
      );
    }

    return feedbacks[0];
  }

  async ShowByUserId(userId: string): Promise<IFinancialAssistantFeedback> {
    const collectionRef = collection(this.db, 'assistantfeedback');

    const q = query(collectionRef, where('userId', '==', userId));

    const snashots = await getDocs(q);

    const feedbacks =
      this.ProcessSnapshots<IFinancialAssistantFeedback>(snashots);

    if (feedbacks.length == 0) {
      this.GenerateRepositoryError('Could not find any feedback', 404);
    }

    if (feedbacks.length > 1) {
      this.GenerateRepositoryError(
        'More than one feedback found for this user',
        500,
      );
    }

    return feedbacks[0];
  }
}
