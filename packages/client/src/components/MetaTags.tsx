import React from "react";
import useMetaTags from "react-metatags-hook";
import BannerImage from "../img/banner.png";
import { pageMeta, siteUrl } from "../constants";

export interface IPageMeta {
  titlePrefix: string;
  description?: string;
  index: boolean;
}

interface IProps extends React.PropsWithChildren<{}> {
  route: string;
}

const MetaTags: React.FC<IProps> = ({ route, children }) => {
  const configPageMeta = pageMeta[route];
  const title =
    configPageMeta.titlePrefix !== ""
      ? `${configPageMeta.titlePrefix} - Monopoly Money`
      : "Monopoly Money";

  useMetaTags({
    title,
    description: configPageMeta.description,
    charset: "utf-8",
    lang: "en",
    metas: [
      {
        name: "robots",
        content: configPageMeta.index ? "index" : "noindex, nofollow"
      }
    ],
    links: [
      { rel: "canonical", href: siteUrl + route },
      { rel: "icon", type: "image/ico", href: "/favicon.ico" },
      { rel: "apple-touch-icon", type: "image/png", href: "/logo.png" }
    ],
    openGraph: {
      title,
      image: siteUrl + BannerImage,
      site_name: "Monopoly Money"
    }
  });

  return <>{children}</>;
};

export default MetaTags;
