export const getVisitorsData = async (axiosFetch, data) => {
  console.log(data, "getVisitorsData");
  try {
    const result = await axiosFetch(async (instance) => {
      const res = await instance.post("/store/visitors/", data);
      return res;
    });
    console.log(result);
    return result;
  } catch (err) {
    console.log(err);
  }
};
