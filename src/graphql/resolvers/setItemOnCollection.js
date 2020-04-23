import { collection, subcollection, add, set, value, ref } from "typesaurus";
import getSubcollectionOnCollection from "./getSubcollectionOnCollection";

const setItemOnCollection = (collectionName) => ({
  itemArgName,
  subcollectionName = null,
  parentId = null,
}) => async (parent, args, context, info) => {
  const parentCollection = collection(collectionName);
  const items = subcollectionName
    ? subcollection(subcollectionName, parentCollection)(parentId)
    : parentCollection;

  const { tags: tagArgs, files: fileArgs, ...itemArgs } = subcollectionName
    ? args
    : args[itemArgName];

  const {
    // TODO: turn these kinds of things into Cecilian userIds, and use ref type
    acquiredBy: acquiredByFreeform,
    createdBy,
    updatedBy,
    uploadedBy: uploadedByFreeform,
    createdById,
    updatedById,
    tagGroups, // TODO: remove this entirely when frontend updated to stop sending it
    ...itemExtraction
  } = itemArgs;
  const data = {
    ...itemExtraction,
    ...(acquiredByFreeform ? { acquiredByFreeform } : {}),
    ...(uploadedByFreeform ? { uploadedByFreeform } : {}),
    ...(itemArgs.id ? {} : { createdAt: value("serverDate") }),
    updatedAt: value("serverDate"),
  };

  const savedItem = itemArgs.id
    ? await set(items, itemArgs.id, data, { merge: true })
    : await add(items, data);

  const savedItemId = savedItem.ref.id;

  await Promise.all([
    // Set tags
    ...(tagArgs
      ? tagArgs.map(async (tagInput) => {
          const tagRefs = {
            ...(tagInput.id ? { id: tagInput.id } : {}),
            ...(tagInput.type ? { type: tagInput.type } : {}),
            ...(tagInput.person
              ? { person: ref(collection("cecilians"), tagInput.person) }
              : {}),
            ...(tagInput.year
              ? { year: ref(collection("years"), tagInput.year) }
              : {}),
            ...(tagInput.event
              ? { event: ref(collection("events"), tagInput.event) }
              : {}),
            ...(tagInput.role
              ? { role: ref(collection("roles"), tagInput.role) }
              : {}),
          };
          await setItemOnCollection(collectionName)({
            subcollectionName: "tags",
            parentId: savedItemId,
          })(parent, tagRefs, context, info);
        })
      : []),
    // Set files
    ...(fileArgs
      ? fileArgs.map(async (fileInput) => {
          await setItemOnCollection(collectionName)({
            subcollectionName: "files",
            parentId: savedItemId,
          })(parent, { id: fileInput.kind, ...fileInput }, context, info);
        })
      : []),
  ]);

  if (Boolean(subcollectionName)) {
    return {
      id: savedItemId,
      ...savedItem.data,
    };
  } else {
    const getTags = getSubcollectionOnCollection("tags", collectionName);
    const tags = await getTags({ id: savedItemId });
    const getFiles = getSubcollectionOnCollection("files", collectionName);
    const files = await getFiles({ id: savedItemId });

    return {
      id: savedItemId,
      ...savedItem.data,
      ...(tags ? { tags } : {}),
      ...(files ? { files } : {}),
    };
  }
};

export default setItemOnCollection;
