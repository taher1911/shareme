import React, { useState } from "react";

import { Link, useNavigate } from "react-router-dom";

import Box from "@mui/material/Box";
import Avatar from "@mui/material/Avatar";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";

import Logout from "@mui/icons-material/Logout";

const Account = ({ user }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const navigate = useNavigate();

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const logoutHandler = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };
  return (
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
            <div
              className=" w-9 h-9 rounded-full"
              style={{
                background: `url('${user?.image}')center center/cover`,
              }}
            ></div>
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
        <div className="flex flex-col justify-center items-center border-b-2 border-gray-200 mb-3">
          <img
            src={user?.image}
            className="w-20 h-20 mt-2 rounded-full shadow-2xl"
            alt=""
          />
          <h1 className="font-bold text-md text-center mt-1 capitalize pb-5 ">
            {user?.userName.slice(0, 22)}
          </h1>
        </div>
        <Link to={`/user-profile/${user?._id}`}>
          {" "}
          <MenuItem onClick={handleClose}>
            <Avatar /> Profile
          </MenuItem>{" "}
        </Link>

        <button type="button" onClick={logoutHandler} className="block w-full">
          <MenuItem onClick={handleClose}>
            <ListItemIcon>
              {" "}
              <Logout fontSize="medium" />{" "}
            </ListItemIcon>
            Logout
          </MenuItem>
        </button>
      </Menu>
    </div>
  );
};

export default Account;
