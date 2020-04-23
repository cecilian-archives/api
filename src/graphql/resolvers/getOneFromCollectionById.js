import { collection, get } from "typesaurus";

const getOneFromCollectionById = (collectionName) => async (
  parent,
  args,
  context,
  info
) => {
  const items = collection(collectionName);
  const ref = parent ? parent[info.fieldName] : args;
  if (!ref) return null;

  const item = await get(items, ref.id);
  return {
    id: item.ref.id,
    ...item.data,
  };
};

export default getOneFromCollectionById;
