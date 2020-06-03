import { collection, group, query, where, ref } from "typesaurus";
import getManyFromCollectionByIdList from "./getManyFromCollectionByIdList";

const getItemsByTag = (collectionName) => async (
  parent,
  args,
  context,
  info
) => {
  const { tagType, tagValueId } = args;
  const items = collection(collectionName);
  const primaryTagField = tagType.toLowerCase();
  const relatedCollection = {
    year: collection("years"),
    event: collection("events"),
    role: collection("roles"),
    person: collection("cecilians"),
  }[primaryTagField];

  const allItems = group("tags", [items]);
  const matchingItems = await query(allItems, [
    where("type", "==", tagType),
    where(primaryTagField, "==", ref(relatedCollection, tagValueId)),
  ]);

  // Extract the path to each matching item's containing subcollection
  // and then parse this to extract the ID of the parent document
  const parentIds = Array.from(
    new Set(
      matchingItems
        .map((item) => {
          const path = item.ref.collection.path;
          const pathElements = path.split("/");
          // The check for matching collection name is to work around
          // an apparent bug in Typesaurus' `group` function
          // where the second argument has no effect.
          // This means we also retrieve e.g. tagged Cecilians
          // when we only want archiveItems.
          return pathElements[0] === collectionName && pathElements[1];
        })
        .filter((id) => Boolean(id))
    )
  );

  // No direct "returnable items" filter on Boolean hidden here
  // because this is dealt with in the called method
  return getManyFromCollectionByIdList(collectionName)("parentIds")(null, {
    parentIds,
  });
};

export default getItemsByTag;
