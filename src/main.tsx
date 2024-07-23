import React, { useContext } from "react";
import ReactDOM from "react-dom/client";
import "./index.scss";
import "bootstrap/dist/js/bootstrap.min.js";

import LandingPage from "./components/LandingPage.tsx";
import { BrowserRouter } from "react-router-dom";
import AuthProvider, { AuthContext } from "./providers/authContext.tsx";
import HeadingStateProvider from "./providers/headingContext.tsx";
import SearchProvider from "./providers/searchContext.tsx";

const App = () => {
  const { loading, authenticated } = useContext(AuthContext);

  if (loading) {
    return (
      <div className="page-loader">
        <div className="txt top">
          <h1>myPin.ai</h1>
        </div>
        <div className="spinner"></div>
        <div className="txt below">
          Loading <br />
          please wait...
        </div>
      </div>
    );
  }

  return authenticated ? (
    <BrowserRouter>
      <HeadingStateProvider>
        <SearchProvider>
          <LandingPage />
        </SearchProvider>
      </HeadingStateProvider>
    </BrowserRouter>
  ) : (
    <div>Something went wrong please try later</div>
  );
};

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </React.StrictMode>
);
