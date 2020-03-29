import React from "react";
import useMetaTags from "react-metatags-hook";
import BannerImage from "../img/banner.png";
import config from "../config";

interface IProps {
  titlePrefix?: string;
  description: string;
  route: string;
}

const MetaTags: React.FC<React.PropsWithChildren<IProps>> = ({
  titlePrefix,
  description,
  route,
  children
}) => {
  const title = (titlePrefix || "") + "Monopoly Money";
  useMetaTags({
    title,
    description,
    charset: "utf-8",
    lang: "en",
    metas: [
      {
        name: "robots",
        content: config.noIndexRoutes.indexOf(route) === -1 ? "noindex, nofollow" : "index"
      }
    ],
    links: [
      { rel: "canonical", href: config.siteUrl + route },
      { rel: "icon", type: "image/ico", href: "/favicon.ico" },
      { rel: "apple-touch-icon", type: "image/png", href: "/logo.png" }
    ],
    openGraph: {
      title,
      image: config.siteUrl + BannerImage,
      site_name: "Monopoly Money"
    }
  });

  return <>{children}</>;
};

export default MetaTags;
