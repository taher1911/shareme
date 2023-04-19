import React, { useEffect, useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useInView } from "framer-motion";
import Image from "../ui/ImageComponent";
// to create unique id
// import { v4 as uuidv4 } from "uuid";
import { MdDownloadForOffline } from "react-icons/md";
import { AiTwotoneDelete } from "react-icons/ai";
import { FaHeart } from "react-icons/fa";
import { CiMenuKebab } from "react-icons/ci";
// import { BsFillArrowUpCircleFill } from "react-icons/bs";

import { urlFor } from "../../sanity/client";
import { fetchUser } from "../../utils/fetchUser";

import Box from "@mui/material/Box";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";

import { deletePin, savePin, unSave } from "../../sanity/fetch";

const Pin = ({ pin: { postedBy, image, _id, save } }) => {
  const [alreadySaved, setAlreadySaved] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const ref = useRef(null);
  const isInView = useInView(ref);
  //   const [imageLoaded, setImageLoaded] = useState(false);
  const navigate = useNavigate();

  const user = fetchUser();

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  //filter return array if it true it will return [{}] if it false it will return [] so boolean values as performance it will be good if it return boolean value not array so to convert it  to array add !!
  useEffect(() => {
    const alreadySaved = !!save?.filter((el) => el.postedBy?._id === user?.sub)
      ?.length;
    setAlreadySaved(alreadySaved);
  }, [save, user?.sub]);

  return (
    <div
      className="m-2 block md:hidden mb-7"
      ref={ref}
      style={{
        transform: isInView ? "none" : "translateY(80px)",
        opacity: isInView ? 1 : 0,
        transition: "all 0.9s ",
      }}
    >
      <div className="flex items-center justify-between mb-1">
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

        <div>
          <Box>
            <Tooltip title="Account settings">
              <IconButton
                onClick={handleClick}
                size="small"
                aria-controls={open ? "account-menu" : undefined}
                aria-haspopup="true"
                aria-expanded={open ? "true" : undefined}
              >
                <div className=" w-9 h-9 rounded-full shadow-xl flex items-center justify-center text-2xl">
                  {" "}
                  <CiMenuKebab className="rotate-90 " />
                </div>
              </IconButton>
            </Tooltip>
          </Box>
          <Menu
            anchorEl={anchorEl}
            id="account-menu"
            open={open}
            onClose={handleClose}
            onClick={handleClose}
            PaperProps={{
              elevation: 0,
              sx: {
                overflow: "visible",
                filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
                mt: 1.5,
                minWidth: "220px",

                "& .MuiAvatar-root": {
                  width: 32,
                  height: 32,
                  ml: -0.5,
                  mr: 1,
                },
                "&:before": {
                  content: '""',
                  display: "block",
                  position: "absolute",
                  top: 0,
                  right: 14,
                  width: 10,
                  height: 10,
                  bgcolor: "background.paper",
                  transform: "translateY(-50%) rotate(45deg)",
                  zIndex: 0,
                },
              },
            }}
            transformOrigin={{ horizontal: "right", vertical: "top" }}
            anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
          >
            <a
              href={`${image?.asset?.url}?dl=`}
              download
              title="Download"
              onClick={(e) => e.stopPropagation()}
              className=" w-full  text-xl outline-none"
            >
              {" "}
              <MenuItem onClick={handleClose}>
                <ListItemIcon>
                  <MdDownloadForOffline fontSize={22} />
                </ListItemIcon>
                Download
              </MenuItem>{" "}
            </a>

            {postedBy?._id === user.sub && (
              <button
                type="button"
                className=" text-xl w-full block"
                title="Delete"
                onClick={(e) => {
                  e.stopPropagation();
                  deletePin(_id);
                }}
              >
                <MenuItem onClick={handleClose}>
                  <ListItemIcon>
                    {" "}
                    <AiTwotoneDelete fontSize={22} />
                  </ListItemIcon>
                  Delete
                </MenuItem>
              </button>
            )}
          </Menu>
        </div>
      </div>
      <div
        onClick={() => navigate(`/pin-detail/${_id}`)}
        className="relative cursor-zoom-in w-auto hover:shadow-lg rounded-lg overflow-hidden transition-all duration-500 ease-in-out "
      >
        <Image
          src={urlFor(image).width(800).url()}
          className="rounded-lg w-full"
        />
      </div>
      <div className="flex justify-between items-center gap-2 mt-2 pr-1">
        <Link
          to={`/pin-detail/${_id}`}
          className="flex gap-1 items-center justify-start mt-1 bg-white opacity-70 hover:opacity-100 transition-all duration-300 ease-in-out rounded-full pl-1 font-semibold"
          onClick={(e) => e.stopPropagation()}
        >
          Comments
        </Link>
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
            className="bg-white opacity-75 hover:opacity-100 text-black font-bold w-9 h-9 rounded-full flex items-center justify-center text-base  shadow-xl outline-none transition-all duration-200 ease-in-out"
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
    </div>
  );
};

export default Pin;
