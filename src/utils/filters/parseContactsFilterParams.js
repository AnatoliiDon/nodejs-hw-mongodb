const parseType = (type) => {
  if (typeof type !== 'string') return;
  const typeList = ['personal', 'home', 'work'];
  const isType = (type) => typeList.includes(type);

  if (isType(type)) return type;
};

const parseFavourite = (isFavourite) => {
  if (typeof isFavourite !== 'string') return;
  const favourive = ['true', 'false'];
  const isBoolean = (isFavourite) => favourive.includes(isFavourite);

  if (isBoolean(isFavourite)) return isFavourite;
};

export const parseContactsFilterParams = ({ type, isFavourite }) => {
  const parsedType = parseType(type);
  const parsedIsFavourite = parseFavourite(isFavourite);

  return {
    contactType: parsedType,
    isFavourite: parsedIsFavourite,
  };
};
