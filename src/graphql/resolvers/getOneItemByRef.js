import { get } from "typesaurus";

const getOneItemByRef = async (parent, args, context, info) => {
  const ref = parent ? parent[info.fieldName] : null;
  if (!ref) return null;

  const item = await get(ref);
  return {
    id: item.ref.id,
    ...item.data,
  };
};

export default getOneItemByRef;
