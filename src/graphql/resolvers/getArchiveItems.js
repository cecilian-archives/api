import { collection, all } from "typesaurus";

const getArchiveItems = async () => {
  const archiveItems = collection("archiveItems");
  const allItems = await all(archiveItems);
  return allItems.map(item => ({
    id: item.ref.id,
    ...item.data,
  }));
};

export default getArchiveItems;
