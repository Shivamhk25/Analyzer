// all api related to billing page

export const postBillingData = async (axiosFetch, data) => {
  console.log(data, "data from postBillingData");
  try {
    const res = await axiosFetch(async (instance) => {
      const result = await instance.post(
        "/store/billing/heatmap/recurring-application-charge",
        data
      );
      return result;
    });
    console.log(res, "from postBillingData res");
    return res;
  } catch (err) {
    console.log(err);
  }
};

export const getBillingData = async (axiosFetch, chargeId) => {
  console.log("getBillingData call");
  try {
    const res = await axiosFetch(async (instance) => {
      const result = await instance.get(
        `/store/billing/heatmap/recurring-application-charge?charge_id=${chargeId}`
      );
      return result;
    });
    console.log(res, "from getBillingData res");
    return res;
  } catch (err) {
    console.log(err);
  }
};

export const getShopName = async (axiosFetch) => {
  try {
    const res = await axiosFetch(async (instance) => {
      const result = await instance.get("/store/get-shop-name");
      return result;
    });
    console.log(res, "from getShopName");
    return res;
  } catch (err) {
    console.log(err);
  }
};

export const getReadInst = async (axiosFetch) => {
  try {
    const res = await axiosFetch(async (instance) => {
      const result = await instance.get("/store/read-instruction");
      return result;
    });
    console.log(res, "from getReadInst res");
    return res;
  } catch (e) {
    console.log(e);
  }
};
export const postReadInst = async (axiosFetch) => {
  try {
    const res = await axiosFetch(async (instance) => {
      const result = await instance.post("/store/read-instruction");
      return result;
    });
    console.log(res, "from postReadInst res");
    return res;
  } catch (e) {
    console.log(e);
  }
};

export const getCurrentPlan = async (axiosFetch) => {
  try {
    return await axiosFetch(async (instance) => {
      return await instance.get("/store/membership/current-plan");
    });
  } catch (err) {
    console.log(e);
  }
};
