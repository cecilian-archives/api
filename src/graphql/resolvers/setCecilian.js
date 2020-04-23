import { collection, subcollection, add, set, value, ref } from "typesaurus";
import getSubcollectionOnCollection from "./getSubcollectionOnCollection";

const setCecilian = async (parent, args, context, info) => {
  const cecilians = collection("cecilians");
  const { tags: tagArgs, ...cecilianArgs } = args.cecilian;
  const data = { ...cecilianArgs, updatedAt: value("serverDate") };

  const cecilian = cecilianArgs.id
    ? await set(cecilians, cecilianArgs.id, data, { merge: true })
    : await add(cecilians, data);

  const tagGroupType = subcollection("tagGroups", cecilians);
  const tagGroupSubcollection = tagGroupType(cecilian.ref.id);

  await Promise.all(
    tagGroupArgs.map(async (tagGroupInput) => {
      const data = {
        tagIds: value("arrayUnion", tagGroupInput.tagIds),
        addedBy: tagGroupInput.addedById
          ? ref(cecilians, tagGroupInput.addedById)
          : undefined,
        addedAt: value("serverDate"),
      };
      tagGroupInput.id
        ? await set(tagGroupSubcollection, tagGroupInput.id, data, {
            merge: true,
          })
        : await add(tagGroupSubcollection, data);
    })
  );

  const getTagGroups = getSubcollectionOnCollection("tagGroups", "cecilians");
  const tagGroups = await getTagGroups({ id: cecilian.ref.id });

  return {
    id: cecilian.ref.id,
    ...cecilian.data,
    tagGroups,
  };
};

export default setCecilian;
