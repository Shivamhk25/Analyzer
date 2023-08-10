import React, { useState } from "react";
import { ApolloProvider } from "react-apollo";
import { useAppBridge } from "@shopify/app-bridge-react";
import { authenticatedFetch, getSessionToken } from "@shopify/app-bridge-utils";
import { Redirect } from "@shopify/app-bridge/actions";
import axios from "axios";
import NavigationComponent from "./Navigation";
import { Frame } from "@shopify/polaris";
import TopBar from "./TopBar/TopBar";
import Sidebar from "./ChakraNavBar/Sidebar";
import { ChakraProvider } from "@chakra-ui/react";
import ApolloClient from "apollo-boost";
import { AiOutlineWhatsApp } from "react-icons/ai";
import Index from "../pages/index";
function userLoggedInFetch(app) {
  const fetchFunction = authenticatedFetch(app);

  return async (uri, options) => {
    const response = await fetchFunction(uri, options);

    if (
      response.headers.get("X-Shopify-API-Request-Failure-Reauthorize") === "1"
    ) {
      const authUrlHeader = response.headers.get(
        "X-Shopify-API-Request-Failure-Reauthorize-Url"
      );

      const redirect = Redirect.create(app);
      redirect.dispatch(Redirect.Action.APP, authUrlHeader || `/auth`);
      return null;
    }

    return response;
  };
}
export const AxiosContext = React.createContext();
export default function MyProvider(props) {
  const app = useAppBridge();

  const client = new ApolloClient({
    fetch: userLoggedInFetch(app),
    fetchOptions: {
      credentials: "include",
    },
  });

  const Component = props.Component;

  const instance = axios.create();
  // Intercept all requests on   Axios instance
  instance.interceptors.request.use(function (config) {
    return getSessionToken(app) // requires a Shopify App Bridge instance
      .then((token) => {
        // Append your request headers with an authenticated token
        config.headers["Authorization"] = `Bearer ${token}`;
        return config;
      });
  });
  const axiosFetch = async (fetchCallback) => {
    try {
      const response = await fetchCallback(instance);
      console.log(response);
      return response;
    } catch (e) {
      const response = e.response;
      console.log(e);
      if (
        response &&
        response.headers["x-shopify-api-request-failure-reauthorize"] &&
        response.headers["x-shopify-api-request-failure-reauthorize"] === "1"
      ) {
        const authUrlHeader =
          response.headers["x-shopify-api-request-failure-reauthorize-url"];

        const redirect = Redirect.create(app);
        redirect.dispatch(Redirect.Action.APP, authUrlHeader || `/auth`);
        return null;
      }
      return response;
    }
  };

  const [urls, setUrls] = useState([]);

  const recentVisitedPagesUpdate = (newPages) => {
    newPages.forEach((page) => {
      setUrls([...urls, page]);
    });
    // return urls;
  };

  const fetchRecentVisitedPages = () => urls;
  const [navSize, setNavSize] = useState("large");

  const getSize = () => {
    console.log("$nav siz");
    return navSize;
  };

  const changeSize = (arg) => {
    setNavSize(arg);
  };

  const value = {
    axiosFetch,
    recentVisitedPagesUpdate,
    fetchRecentVisitedPages,
    changeSize,
    navSize,
  };

  const onNavSizeChange = () => {
    navSize === "small" ? setNavSize("large") : setNavSize("small");
  };

  return (
    <AxiosContext.Provider value={value}>
      <ApolloProvider client={client}>
        <ChakraProvider>
          {/* <div style={{ display: "none" }}>
            <Index setNavSize={setNavSize} />
          </div> */}
          <TopBar navSize={navSize} changeNavSize={onNavSizeChange} />
          <Frame
            navigation={
              <Sidebar navSize={navSize} changeNavSize={onNavSizeChange} />
            }
          >
            <a
              href="https://wa.me/+971528782774"
              className="whatsapp_float"
              target="_blank"
              rel="noopener noreferrer"
            >
              <AiOutlineWhatsApp />
              {/* <i className="fa fa-whatsapp whatsapp-icon"></i> */}
            </a>
            <Component {...props} />
          </Frame>
        </ChakraProvider>
        {/* <Component {...props} /> */}
      </ApolloProvider>
    </AxiosContext.Provider>
  );
}
