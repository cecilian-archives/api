import { collection, all } from "typesaurus";

const getAllItemsInCollection = (collectionName) => async () => {
  const items = collection(collectionName);
  const allItems = await all(items);
  const returnableItems = allItems.filter((item) => !item.data.hidden);
  return returnableItems.map((item) => ({
    id: item.ref.id,
    ...item.data,
  }));
};

export default getAllItemsInCollection;
