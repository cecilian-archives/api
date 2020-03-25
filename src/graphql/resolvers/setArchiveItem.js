import { collection, subcollection, add, set, value, ref } from "typesaurus";
import getSubcollectionOnCollection from "./getSubcollectionOnCollection";

const setArchiveItem = async (parent, args, context, info) => {
  const archiveItems = collection("archiveItems");
  const { tagGroups: tagGroupArgs, files: fileArgs, ...itemArgs } = args.item;
  // TODO: turn these into Cecilian userIds, and use ref type
  const {
    acquiredBy: acquiredByFreeform,
    createdBy,
    uploadedBy: uploadedByFreeform,
    ...itemExtraction
  } = itemArgs;
  const data = {
    ...itemExtraction,
    acquiredByFreeform,
    uploadedByFreeform,
    ...(itemArgs.id ? {} : { createdAt: value("serverDate") }),
    updatedAt: value("serverDate"),
  };

  const archiveItem = itemArgs.id
    ? await set(archiveItems, itemArgs.id, data, { merge: true })
    : await add(archiveItems, data);

  const itemId = archiveItem.ref.id;

  const tagGroupType = subcollection("tagGroups", archiveItems);
  const tagGroupSubcollection = tagGroupType(itemId);

  const filesType = subcollection("files", archiveItems);
  const filesSubcollection = filesType(itemId);

  await Promise.all([
    // Set tag groups
    ...(tagGroupArgs
      ? tagGroupArgs.map(async tagGroupInput => {
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
      : []),
    // Set files
    ...(fileArgs
      ? fileArgs.map(async fileInput => {
          await set(
            filesSubcollection,
            fileInput.kind,
            {
              ...fileInput,
              addedAt: value("serverDate"),
            },
            {
              merge: true,
            }
          );
        })
      : []),
  ]);

  const getTagGroups = getSubcollectionOnCollection(
    "tagGroups",
    "archiveItems"
  );
  const tagGroups = await getTagGroups({ id: itemId });
  const getFiles = getSubcollectionOnCollection("files", "archiveItems");
  const files = await getFiles({ id: itemId });

  return {
    id: itemId,
    ...archiveItem.data,
    tagGroups,
    files,
  };
};

export default setArchiveItem;
