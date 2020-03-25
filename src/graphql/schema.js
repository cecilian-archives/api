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
    getCecilianById(id: String): Cecilian
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
    tagGroups: [ArchiveTagGroup]
    acquiredBy: Cecilian
    acquiredByFreeform: String
    createdBy: Cecilian
    uploadedBy: Cecilian
    uploadedByFreeform: String
    createdAt: Date
    updatedAt: Date
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
    tagGroups: [ArchiveTagGroupInput]
    acquiredBy: String # ultimately a Cecilian userId, for now a freeform string
    createdBy: String # ultimately a Cecilian userId, for now a freeform string
    uploadedBy: String # ultimately a Cecilian userId, for now a freeform string
    files: [TransloaditFileInput]
  }

  type Cecilian {
    id: String!
    userId: String
    name: String
    tagGroups: [ArchiveTagGroup]
    updatedAt: Date
  }

  input CecilianInput {
    id: String
    userId: String
    name: String
    tagGroups: [ArchiveTagGroupInput]
  }

  type ArchiveTagGroup {
    id: String
    tags: [ArchiveTag]
    addedBy: Cecilian
    addedAt: Date
  }

  input ArchiveTagGroupInput {
    id: String
    tagIds: [String]!
    addedById: String
  }

  type ArchiveTag {
    id: String!
    tagType: ArchiveTagType!
    tagValue: String!
    tagPerson: Cecilian
  }

  enum ArchiveItemAcquisitionMethod {
    TRANSCRIPTION
    SCAN
    DIGITAL_NATIVE
    PREVIOUSLY_DIGITISED
  }

  enum ArchiveItemType {
    MINUTES
    PHOTOS
  }

  enum ArchiveTagType {
    ANNIVERSARY
    EVENT
    PERSON
    ROLE
    SHOW
    YEAR
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
`;

export default schema;
