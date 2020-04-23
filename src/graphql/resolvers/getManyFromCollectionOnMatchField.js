import { collection, query, where } from "typesaurus";

const getManyFromCollectionOnMatchField = (collectionName) => (
  fieldNameToMatch,
  argNameToMatch
) => async (parent, args, context, info) => {
  const items = collection(collectionName);
  const matchArg = args[argNameToMatch];
  if (!matchArg) return [];

  const matchingItems = await query(items, [
    where(fieldNameToMatch, "==", matchArg),
  ]);

  return matchingItems.map((item) => ({
    id: item.ref.id,
    ...item.data,
  }));
};

export default getManyFromCollectionOnMatchField;
