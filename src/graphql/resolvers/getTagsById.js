import { collection, getMany } from "typesaurus";

const getTagsById = async (parent, args, context, info) => {
  const archiveTags = collection("archiveTags");
  const ref = parent ? parent.tagIds : args;
  if (!ref) return null;

  const idList = parent ? ref : args.ids;
  const tags = await getMany(archiveTags, idList);
  return tags.map(tag => ({
    id: tag.ref.id,
    ...tag.data,
  }));
};

export default getTagsById;
