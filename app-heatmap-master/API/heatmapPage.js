export const searchUrl = async (axiosFetch, term, date) => {
  try {
    const result = await axiosFetch(async (instance) => {
      const res = await instance.post(
        `store/heatmap/search2?name=${term}`,
        date
      );
      return res;
    });
    console.log(result);
    return result;
  } catch (e) {
    console.log(e);
  }
};

export const getMostVisitPages = async (axiosFetch, date) => {
  try {
    const result = await axiosFetch(async (instance) => {
      const res = await instance.post(
        "/store/heatmap/most-visited-pages",
        date
      );
      return res;
    });
    console.log(result);
    return result;
  } catch (e) {
    console.log(e);
  }
};
