import React from "react";
import { navigate } from "hookrouter";

const NotFound: React.FC = () => {
  navigate("/");
  return <div>NotFound</div>;
};

export default NotFound;
