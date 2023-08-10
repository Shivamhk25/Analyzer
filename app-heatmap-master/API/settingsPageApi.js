export const postIpBlocked = async (axiosfetch, ip) => {
  try {
    const result = await axiosfetch(async (instance) => {
      const res = await instance.post("/store/settings/blockedIp", ip);
      return res;
    });
    console.log(result, "postIpBlocked");
    return result;
  } catch (e) {
    console.log(e);
  }
};
export const getBlockedIp = async (axiosfetch) => {
  try {
    const result = await axiosfetch(async (instance) => {
      const res = await instance.get("/store/settings/blockedIp");
      return res;
    });
    console.log(result, "getBlockedIp");
    return result;
  } catch (e) {
    console.log(e);
  }
};

export const deleteBlockedIp = async (axiosfetch, ipAdr) => {
  console.log(ipAdr, "deleteBlockedIp, body");

  try {
    const result = await axiosfetch(async (instance) => {
      const res = await instance.delete("/store/settings/blockedIp", {
        data: ipAdr,
      });
      return res;
    });
    console.log(result, "deleteBlockedIp");
    return result;
  } catch (e) {
    console.log(e);
  }
};
