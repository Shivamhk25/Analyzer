//dashboard apis
export const getBrowsers = async (axiosFetch, date) => {
  try {
    const response = await axiosFetch(async (instance) => {
      const result = await instance.post("/store/dashboard/browsers", date);
      return result;
    });
    return response;
  } catch (e) {
    console.log("No response" + e);
  }
};
export const getDevices = async (axiosFetch, date) => {
  try {
    const response = await axiosFetch(async (instance) => {
      const result = await instance.post("/store/dashboard/devices", date);
      return result;
    });
    return response;
  } catch (e) {
    console.log("No response" + e);
  }
};
export const getPages = async (axiosFetch, date) => {
  try {
    const response = await axiosFetch(async (instance) => {
      const result = await instance.post("/store/dashboard/pages", date);
      return result;
    });
    return response;
  } catch (e) {
    console.log("No response" + e);
  }
};
export const getSources = async (axiosFetch, date) => {
  try {
    const response = await axiosFetch(async (instance) => {
      const result = await instance.post("/store/dashboard/sources", date);
      console.log(result);
      return result;
    });
    return response;
  } catch (e) {
    console.log("No response" + e);
  }
};

export const getLiveVisitors = async (axiosFetch, date) => {
  try {
    console.log("LIVEvisiters Range = ", date);
    const response = await axiosFetch(async (instance) => {
      const result = await instance.get("/store/dashboard/live-visitors", {
        params: date,
      });
      // console.log(result);
      return result;
    });
    return response;
  } catch (e) {
    console.log("No response" + e);
  }
};

export const getLocations = async (axiosFetch, date) => {
  try {
    const response = await axiosFetch(async (instance) => {
      const result = await instance.post("/store/dashboard/location", date);
      // console.log(result);
      return result;
    });
    return response;
  } catch (e) {
    console.log("No response" + e);
  }
};

export const getVisitors = async (axiosFetch, date) => {
  console.log(date, "getVisitors body");
  try {
    const response = await axiosFetch(async (instance) => {
      const result = await instance.post("/store/dashboard/total-visits", date);
      // console.log(result);
      return result;
    });
    return response;
  } catch (e) {
    console.log("No response" + e);
  }
};

export const getUniqueVisitors = async (axiosFetch, date) => {
  console.log(date, "getVisitors body");
  try {
    const response = await axiosFetch(async (instance) => {
      const result = await instance.post(
        "/store/dashboard/unique-visits",
        date
      );
      // console.log(result);
      return result;
    });
    return response;
  } catch (e) {
    console.log("No response" + e);
  }
};

export const getPlanExpire = async (axiosFetch, date) => {
  try {
    // console.log("%%%", expired);
    // const response = await axiosFetch.post("/store/dashboard/check-plan", date);
    const response = await axiosFetch(async (instance) => {
      const result = await instance.post("/store/dashboard/check-plan", date);
      // console.log(result);
      return result;
    });
    return response;
    // if (response.status === 200) {
    //   console.log(response, "expire");
    //   if (response.data.expired) {
    //     console.log("%%%", response.data);
    //     setExpired(true);
    //   } else {
    //     console.log("%%%", response.data);
    //     setExpired(false);
    //   }
    // }
  } catch (e) {
    console.log("No response" + e);
  }
};

export const getProductsViewed = async (axiosFetch, date) => {
  try {
    const response = await axiosFetch(async (instance) => {
      const result = await instance.post(
        "/store/dashboard/products-viewed",
        date
      );
      // console.log(result);
      return result;
    });
    return response;
  } catch (e) {
    console.log("No response" + e);
  }
};
