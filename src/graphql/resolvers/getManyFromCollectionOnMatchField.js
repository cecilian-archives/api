import { collection, query, where, order } from "typesaurus";

const getManyFromCollectionOnMatchField = (collectionName) => (
  fieldNameToMatch,
  argNameToMatch
) => async (parent, args, context, info) => {
  const items = collection(collectionName);
  const matchArg = args[argNameToMatch];
  if (!matchArg) return [];

  const matchingItems = await query(items, [
    where(fieldNameToMatch, "==", matchArg),
    order(args.sortBy || fieldNameToMatch, args.sortOrder || "asc"),
  ]);

  return matchingItems.map((item) => ({
    id: item.ref.id,
    ...item.data,
  }));
};

export default getManyFromCollectionOnMatchField;
