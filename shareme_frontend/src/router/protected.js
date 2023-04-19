import React from "react";

import { useLocation, Navigate } from "react-router-dom";
import { fetchUser } from "../utils/fetchUser";

export default function Protected({ children }) {
  // get auth from localstorage

  const auth = fetchUser();
  // // get location
  const { pathname } = useLocation();

  // if not logged in
  if (!auth && ["/login"].includes(pathname)) {
    return children;
  }

  if (!auth) {
    return <Navigate to="/login" state={{ from: pathname }} />;
  }

  return children;
}
