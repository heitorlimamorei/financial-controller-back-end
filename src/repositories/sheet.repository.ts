import {
  Firestore,
  collection,
  doc,
  getDoc,
  getDocs,
} from 'firebase/firestore';
import ISheet, { ISheetItem } from '../types/sheet';
import sanitilizeArrayData from '../utils/dataFunctions';

const generateRepositoryError = (message: string, status: number) => {
  throw new Error(`REPOSITORY:${message}-${status}`);
};

export interface ISheetRepository {
  Show(id: string): Promise<ISheet>;
  ShowItems(id: string): Promise<ISheetItem[]>;
}

export default function getSheetRepository(db: Firestore) {
  async function Show(id: string): Promise<ISheet> {
    const docRef = doc(db, `planilhas/${id}`);
    const sheetRef = await getDoc(docRef);

    if (!sheetRef.exists()) {
      generateRepositoryError(`SHEET NOT FOUND - ID: ${id}`, 404);
    }

    return { id: sheetRef.id, ...sheetRef.data() } as ISheet;
  }

  async function ShowItems(id: string): Promise<ISheetItem[]> {
    const itemsRef = collection(db, `planilhas/${id}/items`);

    const itemsSnap = await getDocs(itemsRef);

    const items = sanitilizeArrayData<ISheetItem>(itemsSnap);

    if (items.length == 0) {
      generateRepositoryError(`ITEMS NOT FOUND IN SHEET - ID: ${id}`, 404);
    }

    return items;
  }

  return {
    Show,
    ShowItems,
  };
}
