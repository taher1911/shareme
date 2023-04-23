import React from "react";

//google auth
import { useGoogleLogin } from "@react-oauth/google";
// import FacebookLogin from "react-facebook-login/dist/facebook-login-render-props";
import axios from "axios";
// import {GoogleLogin} from '@react-oauth/google'
// import jwt_decode from "jwt-decode";
import { useNavigate } from "react-router-dom";
import { FcGoogle } from "react-icons/fc";
// import { FaFacebookF } from "react-icons/fa";
import shareVideo from "../assets/share.mp4";
import logo from "../assets/logowhite.png";

import { client } from "../sanity/client";

const Login = () => {
  const navigate = useNavigate();

  const login = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        const res = await axios.get(
          "https://www.googleapis.com/oauth2/v3/userinfo",
          {
            headers: {
              Authorization: `Bearer ${tokenResponse.access_token}`,
            },
          }
        );

        localStorage.setItem("user", JSON.stringify(res.data));
        const { name, picture, sub } = res.data;
        const doc = {
          _id: sub,
          _type: "user",
          userName: name,
          image: picture,
        };
        const user = await client.createIfNotExists(doc);
        if (user) {
          navigate("/", { replace: true });
        }
      } catch (err) {
        console.log(err);
      }
    },
    onFailure: (response) => console.log(response),
  });

  // const onSuccess = (response) => {
  //   const decoded = jwt_decode(response.credential);
  //   console.log(response.credential);
  //   console.log(decoded);
  // };

  // const onFailure = (response) => {
  //   console.log(response);
  // };

  return (
    <div className="flex justify-start items-center flex-col h-screen">
      <div className="w-full h-full relative">
        <video
          src={shareVideo}
          type="video/mp4"
          loop
          controls={false}
          muted
          autoPlay
          className="w-full h-full object-cover"
        />
        <div className="absolute flex flex-col  justify-center items-center top-0 left-0 bottom-0 right-0 bg-blackOverlay">
          <div className="p-5">
            <img src={logo} width="130px" alt="logo" />
          </div>
          <div className="shadow-2xl">
            {/* facebook login  */}

            {/* <FacebookLogin
              appId={process.env.REACT_APP_FACEBOOK_TOKEN}
              fields="name,email,picture"
              callback={responseFacebook}
              render={(renderProps) => (
                <button
                  type="button"
                  className="bg-mainColor flex justify-center items-center p-3 rounded-lg cursor-pointer outline-none w-full mb-3"
                  onClick={renderProps.onClick}
                >
                  {" "}
                  <FaFacebookF className="mr-4" /> Sign in with facebook
                </button>
              )}
            /> */}

            {/* custom google login button  */}
            <button
              type="button"
              className="bg-mainColor flex justify-center items-center p-3 rounded-lg cursor-pointer outline-none w-full"
              onClick={() => login()}
            >
              {" "}
              <FcGoogle className="mr-4" /> Sign in with google
            </button>

            {/* google login button */}
            {/* <GoogleLogin onSuccess={onSuccess} onFailure={onFailure} /> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
