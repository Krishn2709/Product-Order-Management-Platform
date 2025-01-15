import React from "react";
import ReactDOM from "react-dom/client"; // Use createRoot from react-dom/client
import { Provider } from "react-redux";
import store from "./app/store";
import App from "./App";

// Select the root element
const rootElement = document.getElementById("root");

// Create a root and render the App component
const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>
);
