const shop = {
  name: "",
};
exports.getName = function () {
  if (shop.name == "") {
    throw new Error("Shop Name is Empty");
  }
  return shop.name;
};

exports.setName = function (name) {
  shop.name = name;
};
