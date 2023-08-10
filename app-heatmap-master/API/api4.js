export const getVisitors = async (axiosFetch) => {
  try {
    const response = await axiosFetch(async (instance) => {
      const result = await instance.get("/store/get-visitors");
      return result;
    });
    return response;
  } catch (e) {
    console.log("No response" + e);
  }
};
export const generateAuthToken = async (axiosFetch) => {
  try {
    const response = await axiosFetch(async (instance) => {
      const result = await instance.get("/shop/generate-admin-auth-token");
      return result;
    });
    return response;
  } catch (e) {
    console.log("No response" + e);
  }
};
