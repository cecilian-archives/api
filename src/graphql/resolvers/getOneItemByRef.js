import { get } from "typesaurus";

const getOneItemByRef = async (parent, args, context, info) => {
  const ref = parent ? parent[info.fieldName] : args ? args.ref : null;
  if (!ref) return null;

  const item = await get(ref);

  if (!item || item.data.hidden) return null;
  return {
    id: item.ref.id,
    ...item.data,
  };
};

export default getOneItemByRef;
