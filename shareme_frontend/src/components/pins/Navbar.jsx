import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { IoMdAdd, IoMdSearch } from "react-icons/io";
import Account from "../ui/Account";

const Navbar = ({ searchTerm, setSearchTerm, user }) => {
  const navigate = useNavigate();

  if (!user) return null;
  return (
    <div className="flex gap-2 md:gap-5 w-full mt-5 pb-7">
      <div className="flex justify-start items-center w-full px-2 rounded-md bg-white border-none  outline-none focus-within:shadow-md">
        <IoMdSearch fontSize={21} className="ml-1" />
        <input
          type="text"
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search"
          value={searchTerm}
          onFocus={() => navigate("/search")}
          id="search_input"
          className="p-2 w-full bg-white outline-none"
        />
      </div>
      <div className="flex gap-1 items-center justify-start">
        <Link
          to="/create-pin"
          title="Upload Image"
          className="bg-black text-white flex justify-center items-center rounded-lg w-12 h-10 md:w-14 "
        >
          <IoMdAdd fontSize={15} />
        </Link>
        <div className="hidden md:block w-[60%] ">
          <Account user={user && user} />
        </div>
      </div>
    </div>
  );
};

export default Navbar;
