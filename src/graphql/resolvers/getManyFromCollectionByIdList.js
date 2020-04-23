import { collection, getMany } from "typesaurus";

const getManyFromCollectionByIdList = (collectionName) => (
  listFieldName
) => async (parent, args, context, info) => {
  const items = collection(collectionName);
  const refs = parent ? parent[listFieldName] : args;
  if (!refs) return null;

  const idList = parent ? refs.map((ref) => ref.id) : args[listFieldName];
  const wantedItems = await getMany(items, idList);
  return wantedItems.map((item) => ({
    id: item.ref.id,
    ...item.data,
  }));
};

export default getManyFromCollectionByIdList;
