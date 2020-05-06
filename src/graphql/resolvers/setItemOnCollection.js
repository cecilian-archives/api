import { collection, subcollection, add, set, value, ref } from "typesaurus";
import getSubcollectionOnCollection from "./getSubcollectionOnCollection";
import getOneItemByRef from "./getOneItemByRef";

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
    ...itemExtraction
  } = itemArgs;
  const data = {
    ...itemExtraction,
    ...(acquiredByFreeform ? { acquiredByFreeform } : {}),
    ...(uploadedByFreeform ? { uploadedByFreeform } : {}),
    ...(itemArgs.id ? {} : { createdAt: value("serverDate") }),
    updatedAt: value("serverDate"),
  };

  const savedItemRef = itemArgs.id
    ? await set(items, itemArgs.id, data, { merge: true })
    : await add(items, data);
  const savedItem = await getOneItemByRef(null, { ref: savedItemRef });

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
            parentId: savedItem.id,
          })(parent, tagRefs, context, info);
        })
      : []),
    // Set files
    ...(fileArgs
      ? fileArgs.map(async (fileInput) => {
          await setItemOnCollection(collectionName)({
            subcollectionName: "files",
            parentId: savedItem.id,
          })(parent, { id: fileInput.kind, ...fileInput }, context, info);
        })
      : []),
  ]);

  if (Boolean(subcollectionName)) {
    return savedItem;
  } else {
    const getTags = getSubcollectionOnCollection("tags", collectionName);
    const tags = await getTags({ id: savedItem.id });
    const getFiles = getSubcollectionOnCollection("files", collectionName);
    const files = await getFiles({ id: savedItem.id });

    return {
      ...savedItem,
      ...(tags ? { tags } : {}),
      ...(files ? { files } : {}),
    };
  }
};

export default setItemOnCollection;
