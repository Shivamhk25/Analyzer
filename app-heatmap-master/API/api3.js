//Analytics page apis
export const getTopBrowsers = async (axiosFetch, filter) => {
  console.log("Top-browsers");
  try {
    const response = await axiosFetch(async (instance) => {
      const result = await instance.post(
        "/store/analytics/top-browsers",
        filter
      );
      console.log(result);
      return result;
    });
    return response;
  } catch (e) {
    console.log("No response" + e);
  }
};
export const getTopPages = async (axiosFetch, filter) => {
  console.log("Top-pages");
  try {
    const response = await axiosFetch(async (instance) => {
      const result = await instance.post("/store/analytics/top-pages", filter);
      console.log(result);
      return result;
    });
    return response;
  } catch (e) {
    console.log("No response" + e);
  }
};
export const getTopDevices = async (axiosFetch, filter) => {
  console.log("Top-device");
  try {
    const response = await axiosFetch(async (instance) => {
      const result = await instance.post(
        "/store/analytics/top-devices",
        filter
      );
      console.log(result);
      return result;
    });
    return response;
  } catch (e) {
    console.log("No response" + e);
  }
};
export const getTopLocations = async (axiosFetch, filter) => {
  console.log("Top-locations");
  try {
    const response = await axiosFetch(async (instance) => {
      const result = await instance.post(
        "/store/analytics/top-locations",
        filter
      );
      console.log(result);
      return result;
    });
    return response;
  } catch (e) {
    console.log("No response" + e);
  }
};
export const getMostRepeatVisitors = async (axiosFetch, filter) => {
  console.log("Most Repeat Visitors");
  try {
    const response = await axiosFetch(async (instance) => {
      const result = await instance.post(
        "/store/analytics/most-repeat-visitors",
        filter
      );
      console.log(result);
      return result;
    });
    return response;
  } catch (e) {
    console.log("No response" + e);
  }
};
export const getTopPurchasers = async (axiosFetch, filter) => {
  console.log("Top Purchasers");
  try {
    const response = await axiosFetch(async (instance) => {
      const result = await instance.post(
        "/store/analytics/top-purchasers",
        filter
      );
      console.log(result);
      return result;
    });
    return response;
  } catch (e) {
    console.log("No response" + e);
  }
};
export const getMostVisitsNoPurchase = async (axiosFetch, filter) => {
  console.log("most-visits-no-purchase");
  try {
    const response = await axiosFetch(async (instance) => {
      const result = await instance.post(
        "/store/analytics/most-visits-no-purchase",
        filter
      );
      console.log(result);
      return result;
    });
    return response;
  } catch (e) {
    console.log("No response" + e);
  }
};
export const getMostCartValue = async (axiosFetch, filter) => {
  console.log("most-cart-value");
  try {
    const response = await axiosFetch(async (instance) => {
      const result = await instance.post(
        "/store/analytics/most-cart-value",
        filter
      );
      console.log(result);
      return result;
    });
    return response;
  } catch (e) {
    console.log("No response" + e);
  }
};

// export const getHighestConversion = async (axiosFetch) => {
//   try {
//     const response = await axiosFetch(async (instance) => {
//       const result = await instance.get("/store/analytics/highestConversionValue");
//       return result;
//     });
//     return response;
//   } catch (e) {
//     console.log("No response" + e);
//   }
// }
// export const getMostCartValue = async (axiosFetch,filter) => {
//   console.log("most-cart-value");
//   try {
//     const response = await axiosFetch(async (instance) => {
//       const result = await instance.post("/store/analytics/most-cart-value",filter);
//       console.log(result);
//       return result;
//     });
//     return response;
//   } catch (e) {
//     console.log("No response" + e);
//   }
// };
