import React, { useState, useEffect } from "react";
import { MdDownloadForOffline } from "react-icons/md";
import { IoSend } from "react-icons/io5";
import { AiFillCloseCircle } from "react-icons/ai";
import { Link, useParams } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";

import { client, urlFor } from "../../sanity/client";
import MasonryLayout from "./MasonryLayout";
import { pinDetailMorePinQuery, pinDetailQuery } from "../../utils/data";
import Loading from "../Loading/Loading";

const PinDetail = ({ user }) => {
  const [pins, setPins] = useState(null);
  const [pinDetails, setPinDetails] = useState(null);
  const [comment, setComment] = useState("");
  const [addingComment, setAddingComment] = useState(false);
  const [comments, setComments] = useState([]);
  const [viewImage, setViewImage] = useState(false);

  const { pinId } = useParams();

  const sendComment = () => {
    if (comment.length > 0) {
      setAddingComment(true);
      client
        .patch(pinId)
        .setIfMissing({ comments: [] })
        .insert("after", "comments[-1]", [
          {
            comment,
            _key: uuidv4(),
            postedBy: {
              _type: "postedBy",
              _ref: user._id,
            },
          },
        ])
        .commit()
        .then(() => {
          setAddingComment(false);
          if (comments === null) {
            setComments([
              {
                comment,
                _key: uuidv4(),
                postedBy: {
                  image: user?.image,
                  userName: user?.userName,
                  _id: user?._id,
                },
              },
            ]);
          } else {
            setComments((prev) => [
              ...prev,
              {
                comment,
                _key: uuidv4(),
                postedBy: {
                  image: user?.image,
                  userName: user?.userName,
                  _id: user?._id,
                },
              },
            ]);
          }
          setComment("");
        });
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        let query = pinDetailQuery(pinId);
        if (query) {
          const data = await client.fetch(query);
          if (data[0]) {
            setPinDetails(data[0]);
            const { comments } = data[0];
            setComments(comments);
            query = pinDetailMorePinQuery(data[0]);
            const pins = await client.fetch(query);
            if (pins) {
              setPins(pins);
            }
          }
        }
      } catch (err) {
        console.log(err);
      }
    };
    fetchData();
  }, [pinId]);

  if (!pinDetails) return <Loading message={"Loading image details..."} />;

  return (
    <>
      <div
        className="flex lg:flex-row lg:gap-5 flex-col m-auto bg-white"
        style={{
          maxWidth: "1500px",
          borderRadius: "32px",
        }}
      >
        {" "}
        {viewImage && (
          <div
            className="absolute top-0 left-0 right-0 bottom-0 z-40 flex items-center text-white "
            style={{ background: "rgba(0,0,0,.8)" }}
            onClick={() => setViewImage(false)}
          >
            <div className="absolute  top-2 right-2 ">
              <AiFillCloseCircle
                fontSize={30}
                className="cursor-pointer"
                onClick={() => setViewImage(false)}
              />
            </div>
            <img
              src={pinDetails?.image && urlFor(pinDetails.image).url()}
              alt="user-post"
              className=" m-auto  "
            />
          </div>
        )}
        <div className="flex flex-col justify-center items-center md:items-start flex-initial relative lg:max-w-[50%]">
          <img
            src={pinDetails?.image && urlFor(pinDetails.image).url()}
            // onLoad={() => setLoading(false)}
            alt="user-post"
            className="rounded-t-3xl rounded-b-lg  max-h-[600px] object-contain lg:max-h-[650px] hidden md:block "
          />
          <img
            src={pinDetails?.image && urlFor(pinDetails.image).url()}
            // onLoad={() => setLoading(false)}
            alt="user-post"
            className="rounded-t-3xl rounded-b-lg  max-h-[600px] object-contain lg:max-h-[650px] md:hidden"
            onClick={() => setViewImage(true)}
          />
          <div className="flex items-center justify-between w-full ">
            <Link
              to={`/user-profile/${pinDetails?.postedBy?._id}`}
              className="flex items-center my-5 mb-3 gap-2 py-2 bg-white rounded-lg hover:shadow-lg md:mx-3 transition-all duration-300 ease-in-out"
            >
              <img
                src={pinDetails?.postedBy?.image}
                alt="user-post"
                className="w-8 h-8 md:w-9 md:h-9 rounded-full"
              />
              <p className="capitalize text-sm md:text-base">
                {pinDetails?.postedBy?.userName.length > 22
                  ? pinDetails?.postedBy?.userName.slice(0, 22)
                  : pinDetails?.postedBy?.userName}
              </p>
            </Link>
            <div className="flex gap-2 items-center">
              <a
                href={`${pinDetails.image?.asset?.url}?dl=`}
                download
                title="Download"
                onClick={(e) => e.stopPropagation()}
                className="bg-white w-11 h-11 rounded-full flex items-center justify-center text-dark text-3xl opacity-75 hover:opacity-100 hover:shadow-lg outline-none"
              >
                <MdDownloadForOffline />
              </a>
              <span className="px-2 md:px-4 py-1 bg-red-500 text-white text-xs md:text-base font-medium rounded-lg ">
                {!pinDetails?.save?.length ? 0 : pinDetails?.save?.length} Like
              </span>
            </div>
          </div>
        </div>
        <div className="w-full flex-1 xl:min-w-420 flex-wrap lg:max-w-[50%]">
          <h2 className="text-xl lg:ml-4 ">Comments</h2>
          <div className="max-h-370 overflow-y-auto shadow-sm p-3 ">
            {comments?.map((comment, i) => (
              <div
                key={i}
                className="flex gap-2 border-b-2 border-gray-200 py-5  "
              >
                <img
                  src={comment?.postedBy?.image}
                  alt="user-profile"
                  className="w-8 h-8 md-w-10 md-h-10 rounded-full cursor-pointer mt-1"
                />
                <div className="flex flex-col ">
                  <span className="capitalize text-gray-500">
                    {comment?.postedBy?.userName}
                  </span>
                  <span>{comment?.comment}</span>
                </div>
              </div>
            ))}
          </div>
          <div className="flex items-center justify-between my-5 foucus-within:border-b-2 pb-2 focus-within:border-gray-300 lg:pl-4 transition-all duration-300 ease-in-out">
            <img
              src={user?.image}
              alt="user"
              className="w-8 h-8 rounded-full mr-2 "
            />
            <input
              type="text"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Add Comment"
              className="flex flex-1 outline-none break-words"
            />
            <button
              type="button"
              className="flex items-center justify-center "
              onClick={sendComment}
              disabled={comment.length === 0}
              style={{
                color: comment.length === 0 ? "#000" : "#f00",
              }}
            >
              {addingComment ? (
                "sending..."
              ) : (
                <IoSend className="text-xl mx-3" />
              )}
            </button>
          </div>
        </div>
      </div>

      {pins?.length > 0 && (
        <>
          <h3 className="text-center font-bold text-xl mt-8 mb-4">
            More like this
          </h3>
          <MasonryLayout pins={pins} />
        </>
      )}
    </>
  );
};

export default PinDetail;
