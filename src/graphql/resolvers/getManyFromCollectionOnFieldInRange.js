import { collection, query, where, order } from "typesaurus";

const getManyFromCollectionOnFieldInRange = (collectionName) => (
  rangeFieldAndArgsTuples
) => async (parent, args, context, info) => {
  const items = collection(collectionName);

  const rangeWheres = rangeFieldAndArgsTuples
    .flatMap(({ field, startArg, endArg, dateType }) => {
      const rangeStart = args[startArg] || parent[startArg];
      const rangeEnd = args[endArg] || parent[endArg];
      if (!rangeStart || !rangeEnd) return false;
      return [
        where(field, ">=", dateType ? new Date(rangeStart) : rangeStart),
        where(field, "<=", dateType ? new Date(rangeEnd) : rangeEnd),
      ];
    })
    .filter((element) => Boolean(element));

  const sorts = args.sortBy
    ? [
        order(
          args.sortBy || rangeFieldAndArgsTuples[0].field,
          args.sortOrder || "asc"
        ),
      ]
    : [];

  const matchingItems = await query(items, [...rangeWheres, ...sorts]);
  const returnableItems = matchingItems.filter((item) => !item.data.hidden);

  return returnableItems.map((item) => ({
    id: item.ref.id,
    ...item.data,
  }));
};

export default getManyFromCollectionOnFieldInRange;
