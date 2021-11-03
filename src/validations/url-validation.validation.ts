export const validateUrl = (url) => {
  const validUrlPattern =
    /(http(s)?:\/\/.)(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g;
  const validUrl = url.match(validUrlPattern);
  return validUrl !== null ? true : false;
};
