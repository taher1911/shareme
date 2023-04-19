import React, { lazy, Suspense } from "react";
import { Routes, Route, useLocation } from "react-router-dom";

const Loading = lazy(() => import("../components/Loading/Loading"));

const Login = lazy(() => import("../pages/Login"));
const Home = lazy(() => import("../pages/Home"));

const Router = () => {
  const location = useLocation();
  return (
    <Routes location={location} key={location.pathname}>
      <Route
        path="/login"
        element={
          <Suspense fallback={<Loading main={true} />}>
            <Login />
          </Suspense>
        }
      />
      <Route
        path="/*"
        element={
          <Suspense fallback={<Loading main={true} />}>
            <Home />
          </Suspense>
        }
      />
    </Routes>
  );
};
export default Router;
