import React, { useState } from "react";
import { AiOutlineCloudUpload } from "react-icons/ai";
import { MdDelete } from "react-icons/md";
import { useNavigate } from "react-router-dom";

import { client } from "../../sanity/client";
import Loading from "../Loading/Loading";
import { categories } from "../../utils/data";

const CreatePin = ({ user }) => {
  const [loading, setLoading] = useState(false);
  const [fields, setFields] = useState(false);
  const [category, setCategory] = useState(null);
  const [imageAsset, setImageAsset] = useState(null);
  const [wrongImageType, setWrongImageType] = useState(false);
  const [uploading, setUploading] = useState(false);

  const navigate = useNavigate();

  const uploadImage = (e) => {
    const { type, name } = e.target.files[0];
    if (
      type === "image/png" ||
      type === "image/svg" ||
      type === "image/jpeg" ||
      type === "image/gif" ||
      type === "image/tiff" ||
      type === "image/jpg"
    ) {
      setWrongImageType(false);
      setLoading(true);

      client.assets
        .upload("image", e.target.files[0], {
          contentType: type,
          filename: name,
        })
        .then((document) => {
          setImageAsset(document);
          setLoading(false);
        })
        .catch((err) => {
          console.log("image upload error", err);
        });
    } else {
      setWrongImageType(true);
    }
  };

  const savePin = () => {
    if (category !== null && category !== "other" && imageAsset?._id) {
      setUploading(true);
      const doc = {
        _type: "pin",
        category,
        image: {
          _type: "image",
          asset: {
            _type: "reference",
            _ref: imageAsset?._id,
          },
        },
        userId: user._id,
        postedBy: {
          _type: "postedBy",
          _ref: user._id,
        },
      };

      client.create(doc).then(() => {
        navigate("/");
      });
    } else {
      setFields(true);

      setTimeout(() => {
        setFields(false);
      }, 3000);
    }
  };

  return (
    <div className="flex flex-col justify-center items-center mt-5 lg:h-4/5">
      {uploading ? (
        <Loading />
      ) : (
        <div className="flex flex-col justify-center items-center gap-5 bg-white p-3 lg:p-5 w-full lg-w-[70%] lg:max-w-[650px]">
          <div className="bg-secondaryColor p-3 flex flex-0.7 w-full">
            <div className="flex justify-center items-center flex-col border-2 border-dotted border-gray-300 p-3 w-full h-420">
              {loading && <Loading />}
              {wrongImageType && <p>wrong image type</p>}
              {!imageAsset ? (
                <>
                  {!loading && (
                    <label>
                      <div className="flex flex-col items-center justify-center h-full">
                        <div className="flex flex-col justify-center items-center">
                          <p className="font-bold text-2xl">
                            <AiOutlineCloudUpload />
                          </p>
                          <p className="text-lg">click to upload</p>
                        </div>
                        <p className="text-gray-400 mt-2 text-xs">
                          {" "}
                          use high-quality JPG, SVG, PNG, GIF less than 20 MB
                        </p>
                      </div>
                      <input
                        type="file"
                        name="upload-image"
                        onChange={uploadImage}
                        className="w-0 h-0"
                      />
                    </label>
                  )}
                </>
              ) : (
                <div className="relative h-full w-full">
                  <img
                    src={imageAsset?.url}
                    alt="uploaded-img"
                    className="w-full h-full object-contain"
                  />
                  <div className="flex justify-center mt-[-35px]">
                    <button
                      type="button"
                      onClick={() => setImageAsset(null)}
                      className="bg-black opacity-70 text-white w-8 h-8 rounded-full outline-none cursor-pointer hover:opacity-100 hover:bg-red-400 transition-all duration-300 ease-in-out flex justify-center items-center"
                    >
                      <MdDelete />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
          <div className="flex flex-col justify-end w-full">
            <div>
              <p className="mb-2 font-semibold text-lg sm:text-xl">
                Choose Image Category
              </p>
              <select
                name="image-category"
                onChange={(e) => setCategory(e.target.value)}
                className="outline-none text-base border-b-2 border-gray-300 p-2 rounded-md cursor-pointer w-full"
              >
                <option value="other" className="bg-white">
                  Select Category
                </option>
                {categories.slice(0, categories.length - 1).map((category) => (
                  <option
                    key={category.name}
                    value={category.name}
                    className="bg-white text-base capitalize py-1"
                  >
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="mt-10 ">
              {fields && (
                <p className="text-red-500 mb-5 text-base transition-all duration-150 ease-in">
                  please fill in all fields.
                </p>
              )}
              <button
                type="button"
                className="capitalize bg-red-300 px-5 py-2 rounded-md hover:bg-red-400 transition-all duration-200 ease-in-out text-base md:text-lg font-medium"
                onClick={savePin}
                disabled={loading}
              >
                add image
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CreatePin;
