import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  updateDoc,
} from "firebase/firestore";

import { db } from "../firebase";

export const addDocument = async (collectionName, data) => {
  const docRef = await addDoc(
    collection(db, collectionName),
    data
  );

  return docRef.id;
};

export const updateDocument = async (
  collectionName,
  documentId,
  data
) => {
  const docRef = doc(
    db,
    collectionName,
    documentId
  );

  await updateDoc(docRef, data);
};

export const deleteDocument = async (
  collectionName,
  documentId
) => {
  const docRef = doc(
    db,
    collectionName,
    documentId
  );

  await deleteDoc(docRef);
};