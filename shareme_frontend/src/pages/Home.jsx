import React, { useState, useRef, useEffect, lazy } from "react";
import { HiMenu } from "react-icons/hi";
import { AiFillCloseCircle } from "react-icons/ai";
import { Link, Route, Routes, useNavigate } from "react-router-dom";

import { userQuery } from "../utils/data";
import { fetchUser } from "../utils/fetchUser";
import { client } from "../sanity/client";
import logo from "../assets/logo.png";

const Sidebar = lazy(() => import("../components/home/Sidebar"));
const UserProfile = lazy(() => import("../components/home/UserProfile"));
const Pins = lazy(() => import("../components/home/Pins"));
const Account = lazy(() => import("../components/ui/Account"));

const Home = () => {
  const [toggleSidebar, setToggleSidebar] = useState(false);
  const [user, setUser] = useState(null);
  const scrollRef = useRef(null);

  const navigate = useNavigate();

  const userInfo = fetchUser();
  if (!userInfo) {
    navigate("/login", { replace: true });
  }

  useEffect(() => {
    const query = userQuery(userInfo?.sub);
    client.fetch(query).then((data) => setUser(data[0]));
  }, [userInfo?.sub]);

  useEffect(() => {
    scrollRef.current.scrollTo(0, 0);
  }, []);

  return (
    <div className="flex bg-gray-50 md:flex-row flex-col h-screen transaction-height duration-75 ease-out ">
      {/* pc version */}
      <div className="hidden md:flex h-screen flex-initial">
        <Sidebar user={user && user} />
      </div>
      {/* mobile version  */}
      <div className="flex md:hidden flex-row">
        <div className="p-2 w-full flex flex-row justify-between items-center shadow-md">
          <HiMenu
            fontSize={40}
            className="cursor-pointer"
            onClick={() => setToggleSidebar(true)}
          />
          <Link to="/">
            <img src={logo} alt="logo" className="w-28" />
          </Link>
          <Account user={user && user} />
        </div>
        {toggleSidebar && (
          <div className="fixed w-4/5 bg-white h-screen overflow-y-auto shadow-md z-10 animate-slide-in">
            <div className="absolute w-full flex justify-end items-center p-2">
              <AiFillCloseCircle
                fontSize={30}
                className="cursor-pointer"
                onClick={() => setToggleSidebar(false)}
              />
            </div>
            <Sidebar user={user && user} closeToggle={setToggleSidebar} />
          </div>
        )}
      </div>

      <div className="pb-2 flex-1 h-screen overflow-y-scroll " ref={scrollRef}>
        <Routes>
          <Route
            path="/user-profile/:userId"
            element={<UserProfile uId={user && user?._id} />}
          />
          <Route path="/*" element={<Pins user={user && user} />} />
        </Routes>
      </div>
    </div>
  );
};

export default Home;
