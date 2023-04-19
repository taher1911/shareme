import React from "react";
import { Circles } from "react-loader-spinner";

const mainLoader =
  "flex flex-col items-center justify-center h-screen w-screen";
const sectionLoader = "flex flex-col items-center justify-center h-full w-full";
const Loading = ({ message, main }) => {
  return (
    <div className={main ? mainLoader : sectionLoader}>
      <Circles
        ariaLabel="circles-loading"
        color="#ef4444"
        height={50}
        width={200}
        className="m-5"
        wrapperStyle={{}}
        wrapperClass=""
        visible={true}
      />
      {!main && <p className="text-lg text-center px-2">{message}</p>}
    </div>
  );
};

export default Loading;
