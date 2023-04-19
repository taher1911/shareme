import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

import {
  userCreatedPinsQuery,
  userQuery,
  userSavedPinsQuery,
} from "../../utils/data";
import { client } from "../../sanity/client";
import MasonryLayout from "../pins/MasonryLayout";
import Loading from "../Loading/Loading";

import { Navbar } from "../pins";

const randomImage = "https://source.unsplash.com/1600x900/?photography";

const activeBtnStyle =
  "bg-red-400 text-white font-bold p-2 rounded-full outline-none px-3 transition-all duration-300 ease-in-out";
const notActiveBtnStyle =
  "bg-primary  text-black font-bold p-2 rounded-full outline-none px-3 transition-all duration-300 ease-in-out";
const UserProfile = ({ uId }) => {
  const [user, setUser] = useState(null);
  const [pins, setPins] = useState(null);
  const [activeBtn, setActiveBtn] = useState("created");

  const { userId } = useParams();

  useEffect(() => {
    const query = userQuery(userId);

    client
      .fetch(query)
      .then((data) => {
        setUser(data[0]);
      })
      .catch((err) => console.log(err));
  }, [userId]);

  useEffect(() => {
    if (activeBtn === "created") {
      const createdPinsQuery = userCreatedPinsQuery(userId);
      client
        .fetch(createdPinsQuery)
        .then((data) => {
          setPins(data);
        })
        .catch((err) => console.log(err));
    } else {
      const savedPinsQuery = userSavedPinsQuery(userId);
      client
        .fetch(savedPinsQuery)
        .then((data) => {
          setPins(data);
        })
        .catch((err) => console.log(err));
    }
  }, [userId, activeBtn]);

  if (!user) return <Loading message={"Loading profile..."} />;

  return (
    <div className="px-2 md:px-5">
      <div className="bg-gray-50">
        <Navbar user={user} />
      </div>
      <div className="relative h-full pb-2 flex justify-center items-center">
        <div className="flex flex-col pb-5 w-full">
          <div className="relative flex flex-col mb-7 ">
            <div className="flex flex-col justify-center items-center ">
              <img
                src={randomImage}
                alt="banner"
                className="w-full h-[250px] 2xl:h-[380px] shadow-lg object-cover"
              />
              <img
                src={user?.image}
                className="w-20 h-20 -mt-10 rounded-full shadow-2xl"
                alt=""
              />
              <h1 className="font-bold text-3xl text-center mt-3 capitalize">
                {user.userName}
              </h1>
              <div className="absoulte top-0 z-1 right-0 p-2">
                {userId === user._id && <p></p>}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-col">
        <div className="flex justify-center items-center">
          <button
            type="button"
            onClick={(e) => {
              setActiveBtn("created");
            }}
            className={`${
              activeBtn === "created" ? activeBtnStyle : notActiveBtnStyle
            }`}
          >
            Created
          </button>
          {uId === userId && (
            <button
              type="button"
              onClick={(e) => {
                setActiveBtn("saved");
              }}
              className={`${
                activeBtn === "saved" ? activeBtnStyle : notActiveBtnStyle
              }`}
            >
              Favourites
            </button>
          )}
        </div>
        {pins?.length ? (
          <div className="mt-5 px-2">
            <MasonryLayout pins={pins} />
          </div>
        ) : (
          <div className="flex justify-center font-bold items-center w-full text-xl mt-5">
            No Images Found.
          </div>
        )}
      </div>
    </div>
  );
};

export default UserProfile;
