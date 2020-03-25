import getArchiveItems from "./getArchiveItems";
import getCecilianById from "./getCecilianById";
import getTagsById from "./getTagsById";
import getSubcollectionOnCollection from "./getSubcollectionOnCollection";
import setArchiveItem from "./setArchiveItem";
import setCecilian from "./setCecilian";
import DateType from "./DateType";

const resolvers = {
  Date: DateType,
  Query: {
    getArchiveItems,
    getCecilianById,
  },
  ArchiveItem: {
    acquiredBy: getCecilianById,
    createdBy: getCecilianById,
    uploadedBy: getCecilianById,
    tagGroups: getSubcollectionOnCollection("tagGroups", "archiveItems"),
    files: getSubcollectionOnCollection("files", "archiveItems"),
  },
  Cecilian: {
    tagGroups: getSubcollectionOnCollection("tagGroups", "cecilians"),
  },
  ArchiveTagGroup: {
    tags: getTagsById,
    addedBy: getCecilianById,
  },
  Mutation: {
    setArchiveItem,
    setCecilian,
  },
};

export default resolvers;
