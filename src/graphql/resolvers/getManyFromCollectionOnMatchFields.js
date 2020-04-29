import { collection, query, where, ref, order } from "typesaurus";

const getManyFromCollectionOnMatchFields = (collectionName) => (
  matchFieldAndArgTuples
) => async (parent, args, context, info) => {
  const items = collection(collectionName);

  const matchWheres = matchFieldAndArgTuples
    .map(({ field, arg, hardValue, refArg }) => {
      const extractArg = hardValue ? arg : args[arg] || parent[arg];
      if (!extractArg) return false;
      const matchArg = refArg
        ? ref(collection(refArg), extractArg)
        : extractArg;
      return where(field, "==", matchArg);
    })
    .filter((element) => Boolean(element));

  const sorts = args.sortBy
    ? [order(args.sortBy, args.sortOrder || "asc")]
    : [];

  const matchingItems = await query(items, [...matchWheres, ...sorts]);

  return matchingItems.map((item) => ({
    id: item.ref.id,
    ...item.data,
  }));
};

export default getManyFromCollectionOnMatchFields;
