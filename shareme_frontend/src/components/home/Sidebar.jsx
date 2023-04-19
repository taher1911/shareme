import React from "react";
import { NavLink, Link } from "react-router-dom";
import { RiHomeFill } from "react-icons/ri";
import { MdAccountCircle } from "react-icons/md";
// import { IoIosArrowForward } from "react-icons/io";

import logo from "../../assets/logo.png";
// import { urlFor } from "../../sanity/client";

import { categories } from "../../utils/data";

//   sidebar link active and not active classes
const notIsActiveLink =
  "flex items-center px-5 gap-3 text-gray-500 hover:text-black transition-all duration-200 ease-in-out capitalize";
const isActiveLink =
  "flex items-center px-5 gap-3 font-extrabold border-r-2 border-black  transition-all duration-200 ease-in-out capitalize";

const Sidebar = ({ user, closeToggle }) => {
  const handleCloseSidebar = () => {
    if (closeToggle) closeToggle(false);
  };

  return (
    <div className="flex flex-col justify-between bg-white h-full overflow-y-scroll  min-w-210 hide-scrollbar">
      <div className="flex flex-col ">
        <Link
          to="/"
          className="flex px-5 gap-2 my-6 pt-1 w-190 items-center "
          onClick={handleCloseSidebar}
        >
          <img src={logo} alt="logo" className="w-full" />
        </Link>
        <div className="flex flex-col gap-5">
          <NavLink
            to="/"
            className={({ isActive }) =>
              isActive ? isActiveLink : notIsActiveLink
            }
            onClick={handleCloseSidebar}
          >
            <RiHomeFill />
            Home
          </NavLink>

          <NavLink
            to={`/user-profile/${user?._id}`}
            className={({ isActive }) =>
              isActive ? isActiveLink : notIsActiveLink
            }
            onClick={handleCloseSidebar}
          >
            <MdAccountCircle />
            Profile
          </NavLink>

          <h3 className="mt-2 px-5 text-base 2xl:text-md text-gray-500 font-bold">
            Discover categories
          </h3>
          {categories.slice(0, categories.length - 1).map((category) => (
            <NavLink
              key={category.name}
              to={`/category/${category.name}`}
              className={({ isActive }) =>
                isActive ? isActiveLink : notIsActiveLink
              }
              onClick={handleCloseSidebar}
            >
              <div
                className=" w-8 h-8 rounded-full shadow-md"
                style={{
                  background: `url('${category.image}')center center/cover`,
                }}
              ></div>

              {category.name}
            </NavLink>
          ))}
        </div>
      </div>
      {user && (
        <Link
          to={`/user-profile/${user._id}`}
          className="flex items-center my-5 mb-3 gap-2 p-2 bg-white rounded-lg shadow-lg mx-3"
          onClick={handleCloseSidebar}
        >
          <img src={user.image} alt="user" className="w-9 h-9 rounded-full " />
          <p className="capitalize">
            {user.userName.length > 22
              ? user.userName.slice(0, 22)
              : user.userName}
          </p>
        </Link>
      )}
    </div>
  );
};

export default Sidebar;
