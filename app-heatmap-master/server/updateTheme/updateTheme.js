import Axios from "axios";
import fs from "fs";
import path from "path";

const themeApi = "admin/api/2021-10";

export async function updateTheme(shop, accessToken) {
  const axios = Axios.create({
    baseURL: `https://${shop}/${themeApi}`,
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Access-Token": accessToken,
    },
  });
  const mainThemeID = await getThemeId(axios);
  if (!mainThemeID) {
    return;
  }
  console.log("acces token", accessToken);

  const newPage = await getAssetThemeLiquid(mainThemeID, axios);
  let jsFile = await getJsFile(mainThemeID, axios);
  let heatmapFile = await getHeatmapFile(mainThemeID, axios);
  let cssFile = await getCssFile(mainThemeID, axios);
  const uploadedJSFile = await uploadAssetTheme(
    axios,
    mainThemeID,
    jsFile,
    "assets/getData.js"
  );
  const uploadcssFile = await uploadAssetTheme(
    axios,
    mainThemeID,
    cssFile,
    "assets/heatmap.css"
  );
  const uploadedHeatmapFile = await uploadAssetTheme(
    axios,
    mainThemeID,
    heatmapFile,
    "assets/heatmapper.js"
  );
  if (!newPage) {
    return;
  }
  const result = await uploadAssetTheme(
    axios,
    mainThemeID,
    newPage,
    "layout/theme.liquid"
  );

  return result;
}

async function getAssetThemeLiquid(id, axios) {
  const { data } = await axios.get(
    `/themes/${id}/assets.json?asset[key]=layout/theme.liquid`
  );
  if (!data.asset.value) {
    return;
  }
  if (
    data.asset.value.includes(
      '<script src="{{ "getData.js" | asset_url }}" defer="defer"></script>'
    )
  ) {
    return;
  }
  const valueToadd =
    '</title> \n <script>const shop = "{{shop.permanent_domain}}"</script> \n <script>if(window.localStorage !== undefined) {if (!window.localStorage.getItem("shop-name")) {window.localStorage.setItem("shop-name", shop );}}</script> \n <script src="https://unpkg.com/axios/dist/axios.min.js"></script> \n <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/rrweb@latest/dist/rrweb.min.css"/> \n <script src="https://cdn.jsdelivr.net/npm/rrweb@latest/dist/rrweb.min.js"></script> \n <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/rrweb-player@latest/dist/style.css"/> \n <script src="https://cdn.jsdelivr.net/npm/rrweb-player@latest/dist/index.js"> </script> \n <script src="{{ "getData.js" | asset_url }}" defer="defer"></script> \n {{"heatmap.css" | asset_url | stylesheet_tag}} \n <script src="{{ "heatmapper.js" | asset_url }}" ></script> \n <script>setTimeout(function(){generateCoordMap();}, 3000);</script>';
  const newPage = data.asset.value.replace("</title>", valueToadd);
  return newPage;
}

async function getCssFile(id, axios) {
  let file = fs.readFileSync(
    path.resolve(__dirname, "../../components/templates/heatmap.css")
  );
  file = file + "";
  return file;
}

async function getJsFile(id, axios) {
  let jsFile = fs.readFileSync(path.resolve(__dirname, "../../API/getData.js"));
  jsFile = jsFile + "";
  return jsFile;
}

async function getHeatmapFile(id, axios) {
  let jsFile = fs.readFileSync(
    path.resolve(__dirname, "../../API/heatmapper.js")
  );
  jsFile = jsFile + "";
  return jsFile;
}

async function uploadAssetTheme(axios, id, page, pageName) {
  const body = {
    asset: {
      key: pageName,
      value: page,
    },
  };
  const result = await axios.put(`/themes/${id}/assets.json`, body);
  return result;
}

async function getThemeId(axios) {
  const themes = await axios.get("/themes.json");
  const mainTheme = themes.data.themes.find((theme) => theme.role === "main");
  if (!mainTheme) {
    return;
  }
  return mainTheme.id;
}
