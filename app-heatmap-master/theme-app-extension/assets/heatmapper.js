const serverHeatmap = "https://heatmap.z08tech.com";
const HeatmapShopName = localStorage.getItem("shop-name");
console.log(HeatmapShopName);

console.log("inside heatmap script!");
var url = window.location.href;
url = url.split(/[?#]/)[0];
url = url.replace(/(^\w+:|^)\/\//, "");
console.log(url);

//generate session

function generateSession() {
  var result = "";
  var characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  var charactersLength = characters.length;
  for (var i = 0; i <= 31; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}
if (!sessionStorage.getItem("tab-session")) {
  const result = generateSession();
  console.log(result);
  sessionStorage.setItem("tab-session", result);
}

//generate Mapid

function generateMapId() {
  var result = "";
  var characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  var charactersLength = characters.length;
  for (var i = 0; i <= 23; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}
if (!localStorage.getItem("mapId")) {
  const result = generateMapId();
  console.log(result);
  localStorage.setItem("mapId", result);
}

//post Data

async function postCoord(reqData) {
  console.log(data, "this is data");
  axios
    .post(`${serverHeatmap}/shop/send-coords?shop=${HeatmapShopName}`, reqData)
    .then((res) => {
      console.log(res);
      data.coords = [];
      console.log(data, " this is after cleaning");
    })
    .catch((err) => {
      console.log("err", err);
    });
}
function createCanvas() {
  var canvasDiv = document.createElement("div");
  var ButtonDiv = document.createElement("div");
  canvasDiv.className = "result box";
  canvasDiv.id = "result";
  ButtonDiv.className = "heatmap-btn";
  ButtonDiv.id = "heatmap-btn";
  ButtonDiv.innerHTML =
    "<button id='displayHeatMap' onclick='generateHeatMap(result, {maxWidth: 1000});'>Display Heat Map</button> <br /> <br /> <button id='closeHeatMap' onclick='closeHeatMap();'>Close</button>";
  document.body.appendChild(canvasDiv);
  document.body.appendChild(ButtonDiv);
  console.log(canvasDiv, ButtonDiv);
}

var urlParams = new URLSearchParams(window.location.search);
console.log(urlParams.get("id"));
var myParam = urlParams.get("id");
if (myParam !== null && myParam.length === 25) {
  //     if (!localStorage.getItem("access")) {
  console.log("loop 1");
  axios
    .post(`${serverHeatmap}/shop/verify-admin`, {
      token: myParam,
    })
    .then(function (res) {
      console.log(res, "this is loop 1 res");
      if (res.data) {
        localStorage.setItem("access", myParam);
        createCanvas();
        fetchCoord();
        console.log("Success");
      } else {
        alert("Unable to View Heatmap Please try again!");
      }
    })
    .catch((err) => {
      console.log("err", err);
    });
} else {
  if (localStorage.getItem("access")) {
    console.log("loop 2 if");
    const token = localStorage.getItem("access");
    axios
      .post(`${serverHeatmap}/shop/verify-admin`, {
        token: token,
      })
      .then(function (res) {
        console.log(res, "this is loop 2 if res");
        if (res.data) {
          localStorage.setItem("access", token);
          createCanvas();
          fetchCoord();
          // document.getElementById("heatmap-btn").style.opacity = 1;
          console.log("Success");
        } else {
          localStorage.removeItem("access");
        }
      })
      .catch((err) => {
        console.log("err", err);
      });
  }
}

var getScreenSize = function (trueSize) {
  if (trueSize === void 0) {
    trueSize = true;
  }
  console.log(
    Math.round(
      document.querySelector("body").getBoundingClientRect().width
    ).toString() +
      "x" +
      Math.round(
        document.querySelector("body").getBoundingClientRect().height
      ).toString()
  );

  return (
    Math.round(
      document.querySelector("body").getBoundingClientRect().width
    ).toString() +
    "x" +
    Math.round(
      document.querySelector("body").getBoundingClientRect().height
    ).toString()
  );
};
var getScreenSizes = function (mapId) {
  if (mapId === void 0) {
    mapId = "_coordMap_default";
  }
  if (mapId && window["_coordMap_" + mapId]) {
    return Object.keys(window["_coordMap_" + mapId]);
  }
  return [getScreenSize(false)];
};
var coordMapToJson = function (mapId, prettify) {
  if (prettify === void 0) {
    prettify = false;
  }
  if (window["_coordMap_" + mapId]) {
    return prettify
      ? JSON.stringify(window["_coordMap_" + mapId], null, 2)
      : JSON.stringify(window["_coordMap_" + mapId]);
  }
  return "";
};
var loadCoordMaps = function (coordMaps, mapIds) {
  mapIds.forEach(function (mapId, i) {
    if (coordMaps[i]) {
      window["_coordMap_" + mapId] = coordMaps[i];
    }
  });
};
var loadCoordMap = function (coordMap, mapId) {
  return (window["_coordMap_" + mapId] = coordMap);
};
var getCoordMap = function (mapId) {
  if (mapId === void 0) {
    mapId = "default";
  }
  return window["_coordMap_" + mapId] || false;
};
var data = {
  url: url,
  userSessionId: sessionStorage.getItem("tab-session"),
  mapId: localStorage.getItem("mapId"),
  screenSize: null,
  coords: [],
};
console.log(data);
var generateCoordMap = function (mapId) {
  //     alert("called");
  if (mapId === void 0) {
    mapId = "default";
  }

  var screenSize = getScreenSize();
  var id = "_coordMap_" + mapId;
  if (id in window) {
    return false;
  }
  window[id] = {};
  //   var coordMap = window[id];
  window.addEventListener("resize", function () {
    return (screenSize = getScreenSize(false));
  });
  var hoverTimer,
    hoverTime = 0;
  document.addEventListener("mousemove", function (event) {
    clearInterval(hoverTimer);
    //     if (!(screenSize in coordMap)) {
    //       coordMap[screenSize] = [];
    //     }
    var x = event.clientX + window.scrollX,
      y = event.clientY + window.scrollY;
    //     coordMap[screenSize].push([x, y]);
    data.coords.push([x, y]);
    if (!data.screenSize) data.screenSize = screenSize;
  });
};

//posting data

setInterval(function () {
  console.log(data);
  if (data.coords.length != 0) postCoord(data);
}, 10000);

var generateHeatMap = function (dest, dimensions, mapIds, screenSize) {
  dimensions.width = Math.round(
    document.querySelector("body").getBoundingClientRect().width
  );
  dimensions.maxWidth = Math.round(
    document.querySelector("body").getBoundingClientRect().width
  );
  dimensions.height = Math.round(
    document.querySelector("body").getBoundingClientRect().height
  );
  dimensions.maxHeight = Math.round(
    document.querySelector("body").getBoundingClientRect().height
  );
  if (mapIds === void 0) {
    mapIds = ["default"];
  }
  // console.log(mapIds);
  var id = "_coordMap_" + mapIds[0];
  if (!(id in window)) {
    return false;
  }
  if (!screenSize) {
    screenSize = getScreenSize(false);
  }
  var coordMap = window[id];
  console.log(id);
  console.log(coordMap);
  console.log(screenSize);
  if (!coordMap[screenSize]) {
    return false;
  }
  var canvas = document.createElement("canvas");
  console.log("canvas");
  // canvas.style.border = '5px solid black';
  var _a = getScreenSize()
      .split("x")
      .map(function (sz) {
        return Number(sz);
      }),
    sw = _a[0],
    sh = _a[1];
  if (dimensions && (dimensions.maxWidth || dimensions.maxHeight)) {
    var sr = sw / sh;
    var srr = sh / sw;
    if (!dimensions.maxWidth) {
      dimensions.maxWidth = 0;
    }
    if (!dimensions.maxHeight) {
      dimensions.maxHeight = 0;
    }
    var smallestDimension =
      dimensions.maxWidth > dimensions.maxHeight
        ? dimensions.maxHeight
        : dimensions.maxWidth;
    if (sr === 1) {
      dimensions.width = smallestDimension;
      dimensions.height = smallestDimension;
    } else if (sr > 1 && dimensions.maxWidth) {
      dimensions.width = dimensions.maxWidth;
      dimensions.height = dimensions.maxWidth * srr;
    } else if (dimensions.maxHeight) {
      dimensions.height = dimensions.maxHeight;
      dimensions.width = dimensions.maxHeight * sr;
    } else {
      dimensions.width = dimensions.maxWidth;
      dimensions.height = dimensions.maxWidth * srr;
    }
  }
  canvas.width = dimensions ? dimensions.width : sw;
  canvas.height = dimensions ? dimensions.height : sh;
  var ctx = canvas.getContext("2d"),
    wr,
    hr;
  if (dimensions) {
    wr = dimensions.width / sw;
    hr = dimensions.height / sh;
  }
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  var coordsTotal = coordMap[screenSize].length;
  console.log(coordsTotal);
  ctx.filter = "blur(5px)";
  var alpha = 0.1 / mapIds.length;
  mapIds.forEach(function (mapId) {
    id = "_coordMap_" + mapId;
    coordMap = window[id];
    for (var i = 0; i < coordsTotal; i++) {
      var _a = coordMap[screenSize][i],
        x = _a[0],
        y = _a[1];
      if (dimensions) {
        x = x * wr;
        y = y * hr;
      }
      ctx.fillStyle = "rgb(0, 0, 0, " + alpha + ")";
      ctx.beginPath();
      ctx.arc(x, y, 10, 0, 2 * Math.PI);
      ctx.fill();
    }
  });
  var levels = 256;
  var gradientCanvas = document.createElement("canvas");
  gradientCanvas.width = 1;
  gradientCanvas.height = levels;
  var gradientCtx = gradientCanvas.getContext("2d");
  var gradientColors = {
    0.4: "blue",
    0.5: "cyan",
    0.6: "lime",
    0.8: "yellow",
    1.0: "red",
  };
  var gradient = gradientCtx.createLinearGradient(0, 0, 0, levels);
  for (var pos in gradientColors) {
    gradient.addColorStop(Number(pos), gradientColors[pos]);
  }
  gradientCtx.fillStyle = gradient;
  gradientCtx.fillRect(0, 0, 1, levels);
  var gradientPixels = gradientCtx.getImageData(0, 0, 1, levels).data;
  var imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  var pixels = imageData.data;
  var len = pixels.length / 4;
  while (len--) {
    var idx = len * 4 + 3;
    var alpha_1 = pixels[idx] / 256;
    var colorOffset = Math.floor(alpha_1 * 255);
    pixels[idx - 3] = gradientPixels[colorOffset * 4];
    pixels[idx - 2] = gradientPixels[colorOffset * 4 + 1];
    pixels[idx - 1] = gradientPixels[colorOffset * 4 + 2];
  }
  ctx.putImageData(imageData, 0, 0);
  var output = canvas.toDataURL("image/png");
  if (dest) {
    var destElement = void 0;
    if (typeof dest === "string") {
      destElement =
        ~dest.indexOf("#") || ~dest.indexOf(".")
          ? document.querySelector(dest)
          : document.getElementById("" + dest);
    } else {
      destElement = dest;
    }
    console.log(destElement);
    if (destElement) {
      destElement.style.opacity = 0.5;
      destElement.style.zIndex = 10;
      destElement.innerHTML = '<img src="' + output + '" />';
    }
    console.log(destElement);
  }
  return output;
};
var closeHeatMap = function () {
  var el = document.getElementById("result");
  el.style.opacity = 0;
  el.style.zIndex = null;
};

// window.onload = generateCoordMap();
// generateCoordMap();

function fetchCoord() {
  var screen = getScreenSize();
  var start = urlParams.get("start");
  var end = urlParams.get("end");
  var query =
    "screenSize=" + screen + "&url=" + url + "&start=" + start + "&end=" + end;
  console.log(query);
  // console.log("https://c9a4-103-24-124-222.ngrok.io/shop/get-coords?" + query);
  axios
    .get(`${serverHeatmap}/shop/get-coords?` + query)
    .then((res) => {
      if (!res.data.coords || res.data.coords.length === 0) {
        alert("No Heatmap available for given Dates. Please try again.");
        return;
      }
      console.log(res);
      window["_coordMap_default"] = { [screen]: res.data.coords };
      console.log(window["_coordMap_default"]);
    })
    .catch((err) => {
      console.log("err", err);
    });
}
// setTimeout(fetchCoord , 3000);
