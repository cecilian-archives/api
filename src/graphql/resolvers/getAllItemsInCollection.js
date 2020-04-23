import { collection, all } from "typesaurus";

const getAllItemsInCollection = (collectionName) => async () => {
  const items = collection(collectionName);
  const allItems = await all(items);
  return allItems.map((item) => ({
    id: item.ref.id,
    ...item.data,
  }));
};

export default getAllItemsInCollection;
