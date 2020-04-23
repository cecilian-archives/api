const resolveArchiveTagType = (tag, context, info) => {
  switch (tag.type) {
    case "YEAR":
      return "YearTag";
    case "EVENT":
      return "EventTag";
    case "ROLE":
      return "RoleTag";
    case "PERSON":
      return "PersonTag";
    default:
      return null;
  }
};

export default resolveArchiveTagType;
