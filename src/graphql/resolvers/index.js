import DateType from "./DateType";
import getOneFromCollectionById from "./getOneFromCollectionById";
import getOneItemByRef from "./getOneItemByRef";
import getManyFromCollectionByIdList from "./getManyFromCollectionByIdList";
import getManyFromCollectionOnMatchField from "./getManyFromCollectionOnMatchField";
import getAllItemsInCollection from "./getAllItemsInCollection";
import getSubcollectionOnCollection from "./getSubcollectionOnCollection";
import resolveArchiveTagType from "./resolveArchiveTagType";
import setItemOnCollection from "./setItemOnCollection";

const resolvers = {
  Date: DateType,
  Query: {
    getArchiveItems: getAllItemsInCollection("archiveItems"),
    getArchiveItemsByIdList: getManyFromCollectionByIdList("archiveItems")(
      "ids"
    ),
    getArchiveItemsByFreeformAcquirer: getManyFromCollectionOnMatchField(
      "archiveItems"
    )("acquiredByFreeform", "acquirer"),
    getArchiveItemsByCollection: getManyFromCollectionOnMatchField(
      "archiveItems"
    )("collection", "collection"),
    getCecilianById: getOneFromCollectionById("cecilians"),
  },
  ArchiveItem: {
    acquiredBy: getOneItemByRef,
    createdBy: getOneItemByRef,
    uploadedBy: getOneItemByRef,
    tags: getSubcollectionOnCollection("tags", "archiveItems"),
    files: getSubcollectionOnCollection("files", "archiveItems"),
  },
  Cecilian: {
    tags: getSubcollectionOnCollection("tags", "cecilians"),
  },
  ArchiveTag: {
    __resolveType: resolveArchiveTagType,
    createdBy: getOneItemByRef,
    updatedBy: getOneItemByRef,
  },
  PersonTag: {
    person: getOneItemByRef,
  },
  YearTag: {
    year: getOneItemByRef,
  },
  EventTag: {
    event: getOneItemByRef,
    year: getOneItemByRef,
  },
  RoleTag: {
    role: getOneItemByRef,
    year: getOneItemByRef,
    event: getOneItemByRef,
  },
  Event: {
    year: getOneItemByRef,
  },
  Year: {
    shows: getManyFromCollectionByIdList("events")("shows"),
  },
  Mutation: {
    setArchiveItem: setItemOnCollection("archiveItems")({
      itemArgName: "item",
    }),
    setCecilian: setItemOnCollection("cecilians")({ itemArgName: "cecilian" }),
  },
};

export default resolvers;
