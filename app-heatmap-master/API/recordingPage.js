export const fetchRecording = async (axiosFetch, date) => {
  try {
    const res = await axiosFetch(async (instance) => {
      console.log(date);
      const result = await instance.get("/store/recordings", { params: date });
      return result;
    });
    console.log(res, "from fetchRecording res");
    return res;
  } catch (err) {
    console.log(err);
  }
};
