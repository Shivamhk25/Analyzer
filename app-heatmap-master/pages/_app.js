import React from "react";
import App from "next/app";
import MyProvider from "../components/MyProvider";
import { AppProvider } from "@shopify/polaris";
import "@shopify/polaris/dist/styles.css";
import translations from "@shopify/polaris/locales/en.json";
import "../styles/datepicker.css";
import "antd/dist/antd.css";
import { Provider } from "@shopify/app-bridge-react";
// import { CookiesProvider } from 'react-cookie';
import "../styles/loader.css";
import "../styles/rrwebplayer.css";
import "../styles/instruction.css";
import "../styles/modal.css";
import "../styles/whatsapp.css";

class MyApp extends App {
  render() {
    const { Component, pageProps, host } = this.props;
    console.log(host, "host");
    return (
      <AppProvider i18n={translations}>
        <Provider
          config={{
            apiKey: API_KEY,
            host: host,
            forceRedirect: true,
          }}
        >
          <MyProvider Component={Component} {...pageProps} />
        </Provider>
      </AppProvider>
    );
  }
}

MyApp.getInitialProps = async ({ ctx }) => {
  return {
    host: ctx.query.host,
  };
};

export default MyApp;
