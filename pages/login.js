import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import jwt_decode from "jwt-decode";
import axios from "axios";
import config from "../config";

const BASE_URL = config.BASE_URL;

const Login = () => {
  const router = useRouter();
  const [account, setAccount] = useState({ username: "", password: "" });
  const [msgErr, setMsgErr] = useState("");

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token == null || token == undefined) {
    } else {
      localStorage.removeItem("token");
      localStorage.setItem("NavId", 1);
    }

  }, []);

  const login = async () => {
    console.log('login')
    let data = JSON.stringify({
      username: account.username,
      password: account.password,
    });
    let axiosConfig = {
      headers: {
        "Content-Type": "application/json;charset=UTF-8",
        "Access-Control-Allow_origin": "*",
      },
    };
    if (account.username == "" || account.password == "") {
      setMsgErr("กรุณากรอกข้อมูลให้ครบ");
    } else {
      try {
        let res = await axios.post(`${BASE_URL}/signin`, data, axiosConfig);
        if (res.status == 200) {
          const decoded = jwt_decode(res.data.token);
          localStorage.setItem("token", res.data.token);
          localStorage.setItem("NavId", 2);
          router.push("/");
        }
      } catch (error) {
        console.log(error.message);

        if (error.message == "Request failed with status code 500") {
          setMsgErr("username หรือ password ไม่ถูกต้อง");
        }
      }
    }
  };
  return (
    <div className="login">
      <div className="container sm:px-10">
        <div className="block xl:grid grid-cols-2 gap-4">
          {/* BEGIN: Login Info */}
          <div className="hidden xl:flex flex-col min-h-screen">
            <a className="-intro-x flex items-center pt-5">
              <img
                alt="Midone - HTML Admin Template"
                className="w-6"
                src="dist/images/logo.svg"
              />
              <span className="text-white text-lg ml-3"> Smart Car </span>
            </a>
            <div className="my-auto">
              <img
                alt="Midone - HTML Admin Template"
                className="-intro-x w-1/2 -mt-16"
                src="dist/images/illustration.svg"
              />
              <div className="-intro-x text-white font-medium text-4xl leading-tight mt-10">
                Smart Car
                {/* <br />
                sign in to your account. */}
              </div>
              <div className="-intro-x mt-5 text-lg text-white text-opacity-70 dark:text-slate-400">
                โรงพยาบาลศรีวังวรสุโขทัย
              </div>
            </div>
          </div>
          {/* END: Login Info */}
          {/* BEGIN: Login Form */}
          <div className="h-screen xl:h-auto flex py-5 xl:py-0 my-10 xl:my-0">
            <div className="my-auto mx-auto xl:ml-20 bg-white dark:bg-darkmode-600 xl:bg-transparent px-5 sm:px-8 py-8 xl:p-0 rounded-md shadow-md xl:shadow-none w-full sm:w-3/4 lg:w-2/4 xl:w-auto">
              <h2 className="intro-x font-bold text-2xl xl:text-3xl text-center xl:text-left">
                เข้าสู่ระบบ
              </h2>
              <form>
                <div className="intro-x mt-2 text-slate-400 xl:hidden text-center">


                </div>
                <div className="intro-x mt-8">
                  <input
                    type="text"
                    className="intro-x login__input form-control py-3 px-4 block"
                    placeholder="username"
                    onChange={(e) => {
                      setAccount({ ...account, username: e.target.value });
                    }}
                  />
                  <input
                    type="password"
                    className="intro-x login__input form-control py-3 px-4 block mt-4"
                    placeholder="Password"
                    onChange={(e) => {
                      setAccount({ ...account, password: e.target.value });
                    }}
                  />
                  <p style={{ color: "red", fontSize: 16 }}>{msgErr}</p>
                </div>

                <div className="intro-x mt-5 xl:mt-8 text-center xl:text-left">
                  <button
                    className="btn btn-primary py-3 px-4 w-full xl:w-32 xl:mr-3 align-top"
                    type="submit"
                    onClick={(e) => {
                      e.preventDefault();
                      login();
                    }}
                  >
                    Login
                  </button>
                </div>
              </form>
            </div>
          </div>
          {/* END: Login Form */}
        </div>
      </div>
    </div>
  );
};

export default Login;
