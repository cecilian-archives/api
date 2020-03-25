import { collection, get } from "typesaurus";

const getCecilianById = async (parent, args, context, info) => {
  const cecilians = collection("cecilians");
  const ref = parent ? parent[info.fieldName] : args;
  if (!ref) return null;

  const cecilian = await get(cecilians, ref.id);
  return {
    id: cecilian.ref.id,
    ...cecilian.data,
  };
};

export default getCecilianById;
