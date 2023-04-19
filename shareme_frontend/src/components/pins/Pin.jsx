import React, { useEffect, useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useInView } from "framer-motion";
import Image from "../ui/ImageComponent";
// to create unique id
// import { v4 as uuidv4 } from "uuid";
import { MdDownloadForOffline } from "react-icons/md";
import { AiTwotoneDelete } from "react-icons/ai";
import { FaHeart } from "react-icons/fa";
// import { BsFillArrowUpCircleFill } from "react-icons/bs";

import { urlFor } from "../../sanity/client";
import { fetchUser } from "../../utils/fetchUser";

import { deletePin, savePin, unSave } from "../../sanity/fetch";

const Pin = ({ pin: { postedBy, image, _id, save } }) => {
  const [postHovered, setPostHovered] = useState(false);
  const [alreadySaved, setAlreadySaved] = useState(false);
  const ref = useRef(null);
  const isInView = useInView(ref);
  //   const [imageLoaded, setImageLoaded] = useState(false);
  const navigate = useNavigate();

  const user = fetchUser();

  //filter return array if it true it will return [{}] if it false it will return [] so boolean values as performance it will be good if it return boolean value not array so to convert it  to array add !!
  useEffect(() => {
    const alreadySaved = !!save?.filter((el) => el.postedBy?._id === user?.sub)
      ?.length;
    setAlreadySaved(alreadySaved);
  }, [save, user?.sub]);

  return (
    <div
      className="m-2 hidden md:block"
      ref={ref}
      style={{
        transform: isInView ? "none" : "translateY(70px)",
        opacity: isInView ? 1 : 0,
        transition: "all 0.9s ",
      }}
    >
      <div
        onMouseEnter={() => setPostHovered(true)}
        onMouseLeave={() => setPostHovered(false)}
        onClick={() => navigate(`/pin-detail/${_id}`)}
        className="relative cursor-zoom-in w-auto hover:shadow-lg rounded-lg overflow-hidden transition-all duration-500 ease-in-out "
      >
        <Image
          src={urlFor(image).width(800).url()}
          className="rounded-lg w-full"
        />

        {postHovered && (
          <div
            className="absolute top-0 w-full h-full flex flex-col justify-between p-1 pr-2 pt-2 pb-2 z-50 "
            style={{
              height: "100%",
            }}
          >
            <div className="flex items-center justify-between">
              <div className="flex gap-2">
                <a
                  href={`${image?.asset?.url}?dl=`}
                  download
                  title="Download"
                  onClick={(e) => e.stopPropagation()}
                  className="bg-white w-9 h-9 rounded-full flex items-center justify-center text-dark text-2xl opacity-75 hover:opacity-100 hover:shadow-md outline-none"
                >
                  <MdDownloadForOffline />
                </a>
              </div>
              {alreadySaved ? (
                <button
                  type="button"
                  className="bg-red-500 opacity-75 hover:opacity-100 text-white font-bold w-9 h-9 rounded-full text-base  flex items-center justify-center hover:shadow-md  outline-none transition-all duration-200 ease-in-out"
                  title="Dislike"
                  onClick={(e) => {
                    e.stopPropagation();
                    setAlreadySaved(false);
                    unSave(_id, user.sub, save);
                  }}
                >
                  <FaHeart />
                </button>
              ) : (
                <button
                  type="button"
                  className="bg-white opacity-75 hover:opacity-100 text-black font-bold w-9 h-9 rounded-full flex items-center justify-center text-base  hover:shadow-md outline-none transition-all duration-200 ease-in-out"
                  title="Like"
                  onClick={(e) => {
                    e.stopPropagation();
                    setAlreadySaved(true);
                    savePin(_id, alreadySaved, user.sub);
                  }}
                >
                  <FaHeart />
                </button>
              )}
            </div>
            <div className="flex justify-between items-center gap-2">
              <Link
                to={`/user-profile/${postedBy?._id}`}
                className="flex gap-1 items-center justify-start mt-1 bg-white opacity-70 hover:opacity-100 transition-all duration-300 ease-in-out rounded-full pr-1"
                onClick={(e) => e.stopPropagation()}
              >
                <img
                  src={postedBy?.image}
                  alt="user"
                  className="w-7 h-7 rounded-full "
                />
                <p className="capitalize font-semibold text-sm">
                  {postedBy?.userName.slice(0, 15)}
                </p>
              </Link>
              <div className="flex items-center">
                {postedBy?._id === user.sub && (
                  <button
                    type="button"
                    className="bg-white hover:bg-red-400 transition-all duration-200 ease-in-out text-black opacity-70 hover:opacity-100 text-xl p-2 rounded-full hover:shadow-md ml-1"
                    title="Delete"
                    onClick={(e) => {
                      e.stopPropagation();
                      deletePin(_id);
                    }}
                  >
                    <AiTwotoneDelete />
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Pin;
