import { collection, subcollection, all } from "typesaurus";

const getSubcollectionOnCollection = (
  subcollectionName,
  parentCollectionName
) => async (parent, args, context, info) => {
  const parentCollection = collection(parentCollectionName);
  const subcollectionRef = subcollection(subcollectionName, parentCollection);
  const docRef = parent || args;
  if (!docRef) return null;

  const docsOfSubcollection = subcollectionRef(docRef.id);

  const documents = await all(docsOfSubcollection);
  return documents.map(document => ({
    id: document.ref.id,
    ...document.data,
  }));
};

export default getSubcollectionOnCollection;
