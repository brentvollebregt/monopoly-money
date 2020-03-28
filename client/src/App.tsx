import React from "react";
import { useRoutes, useRedirect } from "hookrouter";
import Navigation from "./components/Navigation";
import Home from "./pages/Home";
import About from "./pages/About";
import NotFound from "./pages/NotFound";
import MetaTags from "./components/MetaTags";
import PageSizeWrapper from "./components/PageSizeWrapper";

const App: React.FC = () => {
  const routes = {
    "/": () => (
      <MetaTags
        route="/"
        description="Monopoly Money helps you manage your finances in a game of monopoly from the browser."
      >
        <PageSizeWrapper>
          <Home />
        </PageSizeWrapper>
      </MetaTags>
    ),
    "/about": () => (
      <MetaTags route="/about" titlePrefix="About - " description="About Monopoly Money.">
        <PageSizeWrapper>
          <About />
        </PageSizeWrapper>
      </MetaTags>
    )
  };
  const routeResult = useRoutes(routes);
  useRedirect("/about/", "/about");

  return (
    <>
      <Navigation />
      <div className="my-3">{routeResult || <NotFound />}</div>
    </>
  );
};

export default App;
