import getManyFromCollectionOnMatchFields from "./getManyFromCollectionOnMatchFields";
import setItemOnCollection from "./setItemOnCollection";

const setItemByMatchFields = (collectionName) => ({
  itemArgName,
  subcollectionName = null,
  parentId = null,
}) => async (parent, args, context, info) => {
  const reference = args?.item?.archiveId;
  if (!reference) return null;

  const matchingItems = await getManyFromCollectionOnMatchFields(
    collectionName
  )([{ field: "archiveId", arg: "reference" }])(
    parent,
    { reference },
    context,
    info
  );

  if (matchingItems.length !== 1) return null;

  return await setItemOnCollection(collectionName)({
    itemArgName,
  })(
    parent,
    { item: { ...args.item, id: matchingItems[0].id } },
    context,
    info
  );
};

export default setItemByMatchFields;
