import { gql } from "apollo-server-cloud-functions";

/**
 * "Archiving is as much about pruning the hedge
 * as it is about making sure it grows properly."
 * -- Robyn Hunter
 *    12 January 2020
 */

const schema = gql`
  type Query {
    getArchiveItems: [ArchiveItem]
    getArchiveItemsByIdList(ids: [String!]!): [ArchiveItem]
    getArchiveItemsByFreeformAcquirer(
      acquirer: String
      sortBy: String
      sortOrder: String
    ): [ArchiveItem]
    getArchiveItemsByCollection(
      collection: String
      sortBy: String
      sortOrder: String
    ): [ArchiveItem]
    getArchiveItemsByArchiveReference(
      reference: String
      sortBy: String
      sortOrder: String
    ): [ArchiveItem]
    getCecilianById(id: String): Cecilian
    getYearById(id: String): Year
    getEventById(id: String): Event
    getRoleById(id: String): Role
    getAllCecilians: [Cecilian]
    getAllYears: [Year]
    getAllEvents: [Event]
    getAllRoles: [Role]
  }
  type Mutation {
    setArchiveItem(item: ArchiveItemInput!): ArchiveItem
    setCecilian(cecilian: CecilianInput!): Cecilian
  }

  scalar Date

  type ArchiveItem {
    id: String
    archiveId: String
    type: ArchiveItemType
    acquisitionMethod: ArchiveItemAcquisitionMethod
    collection: String
    associatedDate: Date
    notes: String
    tags: [ArchiveTag]
    acquiredBy: Cecilian
    acquiredByFreeform: String
    createdBy: Cecilian
    uploadedBy: Cecilian
    uploadedByFreeform: String
    createdAt: Date
    updatedAt: Date
    updatedBy: Cecilian
    files: [TransloaditFile]
  }

  input ArchiveItemInput {
    id: String
    archiveId: String
    type: ArchiveItemType
    acquisitionMethod: ArchiveItemAcquisitionMethod
    collection: String
    associatedDate: Date
    notes: String
    tags: [ArchiveTagInput]
    acquiredBy: String # ultimately a Cecilian userId, for now a freeform string
    createdBy: String # ultimately a Cecilian userId, for now a freeform string
    uploadedBy: String # ultimately a Cecilian userId, for now a freeform string
    files: [TransloaditFileInput]
  }

  type Cecilian {
    id: String!
    userId: String
    name: String
    tags: [ArchiveTag]
    createdAt: Date
    updatedAt: Date
  }

  input CecilianInput {
    id: String
    userId: String
    name: String
    tags: [ArchiveTagInput]
  }

  interface ArchiveTag {
    id: String!
    type: ArchiveTagType!
    createdBy: Cecilian
    createdAt: Date
    updatedBy: Cecilian
    updatedAt: Date
  }

  type PersonTag implements ArchiveTag {
    id: String!
    type: ArchiveTagType!
    createdBy: Cecilian
    createdAt: Date
    updatedBy: Cecilian
    updatedAt: Date
    person: Cecilian
  }
  type YearTag implements ArchiveTag {
    id: String!
    type: ArchiveTagType!
    createdBy: Cecilian
    createdAt: Date
    updatedBy: Cecilian
    updatedAt: Date
    year: Year
  }
  type EventTag implements ArchiveTag {
    id: String!
    type: ArchiveTagType!
    createdBy: Cecilian
    createdAt: Date
    updatedBy: Cecilian
    updatedAt: Date
    event: Event
    year: Year
  }
  type RoleTag implements ArchiveTag {
    id: String!
    type: ArchiveTagType!
    createdBy: Cecilian
    createdAt: Date
    updatedBy: Cecilian
    updatedAt: Date
    role: Role
    year: Year
    event: Event
  }

  input ArchiveTagInput {
    id: String
    type: ArchiveTagType!
    person: String # Cecilian ID
    year: String # Year ref
    event: String # Event ref
    role: String # Role ref
    createdById: String # user ID
    updatedById: String # user ID
  }

  type Year {
    id: String!
    name: String!
    startDate: Date
    endDate: Date
    shows: [Event]
  }
  type Event {
    id: String!
    type: EventType!
    name: String!
    year: Year
    startDate: Date
    endDate: Date
  }
  type Role {
    id: String!
    type: RoleType!
    name: String!
    event: Event
  }

  enum ArchiveItemAcquisitionMethod {
    TRANSCRIPTION
    SCAN
    PREVIOUSLY_DIGITISED
    CREATED_DIGITALLY
  }

  enum ArchiveItemType {
    MINUTES
    PHOTOS
  }

  enum ArchiveTagType {
    YEAR
    EVENT
    ROLE
    PERSON
  }
  enum EventType {
    SHOW
    ANNIVERSARY
    EVENT
  }
  enum RoleType {
    PERFORMANCE
    PRODUCTION
    COMMITTEE
    SOCIETY
  }

  enum ArchiveFileKind {
    PRIMARY
    THUMBNAIL
    ANIMATED_THUMBNAIL
  }

  type TransloaditFile {
    id: String!
    kind: ArchiveFileKind!
    name: String
    basename: String
    ext: String
    size: Int
    mime: String
    type: String
    field: String
    md5hash: String
    original_id: String
    original_basename: String
    original_name: String
    original_path: String
    original_md5hash: String
    from_batch_import: Boolean
    is_tus_file: Boolean
    url: String
    ssl_url: String
    meta: TransloaditFileMetadata
    cost: Int
    queue: String
    queueTime: Float
    execTime: Float
    addedAt: Date
  }
  type TransloaditFileMetadata {
    page_count: Int
    width: Int
    height: Int
    page_size: String
    producer: String
    thumb_index: Int
    date_file_modified: String
    duration: Float
    aspect_ratio: String
    has_clipping_path: Boolean
    frame_count: Int
    colorspace: String
    has_transparency: Boolean
    average_color: String
  }
  input TransloaditFileInput {
    id: String!
    kind: ArchiveFileKind!
    name: String
    basename: String
    ext: String
    size: Int
    mime: String
    type: String
    field: String
    md5hash: String
    original_id: String
    original_basename: String
    original_name: String
    original_path: String
    original_md5hash: String
    from_batch_import: Boolean
    is_tus_file: Boolean
    url: String
    ssl_url: String
    meta: TransloaditFileMetadataInput
    cost: Int
    queue: String
    queueTime: Float
    execTime: Float
  }
  input TransloaditFileMetadataInput {
    page_count: Int
    width: Int
    height: Int
    page_size: String
    author: String
    producer: String
    creator: String
    create_date: String
    modify_date: String
    thumb_index: Int
    date_file_modified: String
    duration: Float
    aspect_ratio: String
    has_clipping_path: Boolean
    frame_count: Int
    colorspace: String
    has_transparency: Boolean
    average_color: String
  }
`;

export default schema;
