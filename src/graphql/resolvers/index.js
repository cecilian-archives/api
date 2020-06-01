import DateType from "./DateType";
import getOneFromCollectionById from "./getOneFromCollectionById";
import getOneItemByRef from "./getOneItemByRef";
import getManyFromCollectionByIdList from "./getManyFromCollectionByIdList";
import getManyFromCollectionOnMatchFields from "./getManyFromCollectionOnMatchFields";
import getAllItemsInCollection from "./getAllItemsInCollection";
import getSubcollectionOnCollection from "./getSubcollectionOnCollection";
import resolveArchiveTagType from "./resolveArchiveTagType";
import setItemOnCollection from "./setItemOnCollection";
import getItemsByTag from "./getItemsByTag";

const resolvers = {
  Date: DateType,
  Query: {
    getArchiveItems: getAllItemsInCollection("archiveItems"),
    getArchiveItemsByIdList: getManyFromCollectionByIdList("archiveItems")(
      "ids"
    ),
    getArchiveItemsByFreeformAcquirer: getManyFromCollectionOnMatchFields(
      "archiveItems"
    )([{ field: "acquiredByFreeform", arg: "acquirer" }]),
    getArchiveItemsByCollection: getManyFromCollectionOnMatchFields(
      "archiveItems"
    )([{ field: "collection", arg: "collection" }]),
    getArchiveItemsByArchiveReference: getManyFromCollectionOnMatchFields(
      "archiveItems"
    )([{ field: "archiveId", arg: "reference" }]),
    getCecilianById: getOneFromCollectionById("cecilians"),
    getYearById: getOneFromCollectionById("years"),
    getEventById: getOneFromCollectionById("events"),
    getRoleById: getOneFromCollectionById("roles"),
    getAllCecilians: getAllItemsInCollection("cecilians"),
    getAllYears: getAllItemsInCollection("years"),
    getAllEvents: getAllItemsInCollection("events"),
    getAllRoles: getAllItemsInCollection("roles"),
    getArchiveItemsByTag: getItemsByTag("archiveItems"),
    getCeciliansByTag: getItemsByTag("cecilians"),
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
  Role: {
    event: getOneItemByRef,
  },
  Year: {
    shows: getManyFromCollectionOnMatchFields("events")([
      { field: "type", arg: "SHOW", hardValue: true },
      { field: "year", arg: "id", refArg: "years" },
    ]),
  },
  Mutation: {
    setArchiveItem: setItemOnCollection("archiveItems")({
      itemArgName: "item",
    }),
    setCecilian: setItemOnCollection("cecilians")({ itemArgName: "cecilian" }),
  },
};

export default resolvers;
