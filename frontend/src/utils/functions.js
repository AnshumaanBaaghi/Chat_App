export const getFilteredArray = (query, arr) => {
  console.log("query:", query);
  console.log("arr:", arr);
  if (!query) return arr;
  const pattern = query.split("").join(".*");
  const regex = new RegExp(pattern, "i");
  const filteredArray = arr.filter(
    (el) => regex.test(el.name) || regex.test(el.username)
  );
  return filteredArray;
};
