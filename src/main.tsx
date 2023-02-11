import { ChakraProvider, extendTheme } from "@chakra-ui/react";
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";

const theme = extendTheme({
  fonts: {
    heading: "Inter, Avenir, Helvetica, Arial, sans-serif",
    body: "Inter, Avenir, Helvetica, Arial, sans-serif",
  },
});

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <ChakraProvider theme={theme}>
      <App />
    </ChakraProvider>
  </React.StrictMode>
);
