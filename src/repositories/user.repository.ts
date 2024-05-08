import {
  Firestore,
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  updateDoc,
  where,
} from 'firebase/firestore';
import { IUser } from '../types/user';
import sanitilizeArrayData from '../utils/dataFunctions';

const generateRepositoryError = (message: string, status: number) => {
  throw new Error(`REPOSITORY:${message}-${status}`);
};

export interface IUserRepository {
  Create(email: string, name: string): Promise<{ id: string }>;
  Show(id: string): Promise<IUser>;
  ShowByEmail(email: string): Promise<IUser>;
  ShowSheetIds(id: string): Promise<string[]>;
  Update(user: IUser): Promise<void>;
  Delete(id: string): Promise<void>;
}

export default function getUserRepository(db: Firestore): IUserRepository {
  async function Create(email: string, name: string): Promise<{ id: string }> {
    const usersRef = collection(db, 'users');

    const user = {
      name: name,
      email: email,
      createdAt: new Date(),
      sheetIds: [],
    };

    const docRef = await addDoc(usersRef, user);

    if (!docRef.id) {
      generateRepositoryError('Could not create user', 500);
    }

    return { id: docRef.id };
  }

  async function Show(id: string): Promise<IUser> {
    const usersRef = collection(db, 'users');

    const docRef = doc(usersRef, id);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      generateRepositoryError('Could not find user', 404);
    }

    const user = { id: id, ...docSnap.data() } as IUser;

    return user;
  }

  async function ShowByEmail(email: string): Promise<IUser> {
    const usersRef = collection(db, 'users');

    const userQ = query(usersRef, where('email', '==', email));
    const snapUsers = await getDocs(userQ);

    const users = sanitilizeArrayData<IUser>(snapUsers);

    if (users.length == 0) {
      generateRepositoryError(`USER NOT FOUND - EMAIL: ${email}`, 404);
    }

    if (users.length > 1) {
      generateRepositoryError(
        `MORE THAN ONE USER FOUND - EMAIL: ${email}`,
        500,
      );
    }

    return users[0];
  }

  async function ShowSheetIds(id: string): Promise<string[]> {
    const user = await Show(id);
    return user.sheetIds;
  }

  async function Update(user: IUser): Promise<void> {
    const docRef = doc(db, `users/${user.id}`);
    const retrivedUser = await Show(user.id);

    if (!retrivedUser) {
      generateRepositoryError('USER NOT FOUND', 404);
    }

    await updateDoc(docRef, {
      email: user.email,
      name: user.name,
      sheetIds: user.sheetIds,
    });
  }

  async function Delete(id: string): Promise<void> {
    const docRef = doc(db, `users/${id}`);
    const userRef = await getDoc(docRef);

    if (!userRef.exists()) {
      generateRepositoryError(`USER NOT FOUND - ID: ${id}`, 404);
    }

    await deleteDoc(docRef);
  }

  return {
    Create,
    Show,
    ShowByEmail,
    ShowSheetIds,
    Update,
    Delete,
  };
}
