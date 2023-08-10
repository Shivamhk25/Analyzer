// for top browser api

export const getTopBrowsers = async (axiosFetch, data) => {
  console.log("from getTopBrowsers", data);
  try {
    const res = await axiosFetch(async (instance) => {
      const result = await instance.post("store/analytics/top-browsers", data);
      return result;
    });
    console.log(res);
    return res.data;
  } catch (err) {
    console.log(err);
  }
};

// for top device api

export const getTopDevices = async (axiosFetch, data) => {
  console.log("from getTopDevices", data);
  try {
    const res = await axiosFetch(async (instance) => {
      const result = await instance.post("store/analytics/top-devices", data);
      return result;
    });
    console.log(res);
    return res.data;
  } catch (err) {
    console.log(err);
  }
};
//for top location api
export const getTopLocations = async (axiosFetch, data) => {
  console.log("from getTopLocations", data);
  try {
    const res = await axiosFetch(async (instance) => {
      const result = await instance.post("store/analytics/top-locations", data);
      return result;
    });
    console.log(res);
    return res.data;
  } catch (err) {
    console.log(err);
  }
};

// for top pages api
export const getTopPages = async (axiosFetch, data) => {
  console.log("from getTopPages", data);
  try {
    const res = await axiosFetch(async (instance) => {
      const result = await instance.post("store/analytics/top-pages", data);
      return result;
    });
    console.log(res);
    return res.data;
  } catch (err) {
    console.log(err);
  }
};

//for top ip address api
export const getTopIpAddresses = async (axiosFetch, data) => {
  console.log("from getTopIpAddresses", data);
  try {
    const res = await axiosFetch(async (instance) => {
      const result = await instance.post("store/analytics/top-ips", data);
      return result;
    });
    console.log(res);
    return res.data;
  } catch (err) {
    console.log(err);
  }
};

// for more page Most repeat visitors api
export const getRepeatVisitors = async (axiosFetch, data) => {
  console.log("from getRepeatVisitors", data);
  try {
    const res = await axiosFetch(async (instance) => {
      const result = await instance.post(
        "store/analytics/most-repeat-visitors",
        data
      );
      return result;
    });
    console.log(res);
    return res.data;
  } catch (err) {
    console.log(err);
  }
};
// for more page Top purchasers api
export const getTopPurchasers = async (axiosFetch, data) => {
  console.log("from getTopPurchasers", data);
  try {
    const res = await axiosFetch(async (instance) => {
      const result = await instance.post(
        "store/analytics/top-purchasers",
        data
      );
      return result;
    });
    console.log(res);
    return res.data;
  } catch (err) {
    console.log(err);
  }
};
// for more page HighestConversionUser api
export const getHighestConversionUser = async (axiosFetch, data) => {
  console.log("from getHighestConversionUser", data);
  try {
    const res = await axiosFetch(async (instance) => {
      const result = await instance.post(
        "store/analytics/high-conversion-value-users",
        data
      );
      return result;
    });
    console.log(res);
    return res.data;
  } catch (err) {
    console.log(err);
  }
};
// for more page Users with most visits but no purchase api
export const getMostVisitNoPurchase = async (axiosFetch, data) => {
  console.log("from getMostVisitNoPurchase", data);
  try {
    const res = await axiosFetch(async (instance) => {
      const result = await instance.post(
        "store/analytics/most-visits-no-purchase",
        data
      );
      return result;
    });
    console.log(res);
    return res.data;
  } catch (err) {
    console.log(err);
  }
};

// for more page Most add to cart value users  api
export const getMostAddToCartValue = async (axiosFetch, data) => {
  console.log("from getMostAddToCartValue", data);
  try {
    const res = await axiosFetch(async (instance) => {
      const result = await instance.post(
        "store/analytics/most-cart-value",
        data
      );
      return result;
    });
    console.log(res);
    return res.data;
  } catch (err) {
    console.log(err);
  }
};
