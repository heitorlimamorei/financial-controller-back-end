import { DocumentData, QuerySnapshot } from "firebase/firestore/lite";

export default function sanitilizeArrayData<T>(data: QuerySnapshot<DocumentData, DocumentData>): T[] {
    let resp: T[] = [];
    data.docs.forEach((doc) => {
        resp.push({
          id: doc.id,
          ...doc.data(),
        } as T);
    });
    return resp;
}
