"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import nookies from "nookies";
import { toaster, toasterError } from "../components/Toaster.js";
import Link from "next/link.js";
import Loader from "../../components/Loader";
import { FaEye } from "react-icons/fa";
import { FaEyeSlash } from "react-icons/fa";

export default function Login() {
  const router = useRouter();
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const onInputChange = (e) => {
    setLoginData({ ...loginData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const isInputEmpty = (inputValue) => {
    return inputValue == null || inputValue.trim() === "";
  };

  const validateFields = () => {
    let isValid = true;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (isInputEmpty(loginData.email)) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        email: "Email is required",
      }));
      isValid = false;
    } else if (!emailRegex.test(loginData.email)) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        email: "Invalid email format",
      }));
      isValid = false;
    } else {
      setErrors((prevErrors) => ({ ...prevErrors, email: "" }));
    }

    if (isInputEmpty(loginData.password)) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        password: "Password is required",
      }));
      isValid = false;
    } else {
      setErrors((prevErrors) => ({ ...prevErrors, password: "" }));
    }

    return isValid;
  };
  const handleLogin = async (e) => {
    try {
      if (!validateFields()) {
        return;
      }
      setLoading(true);
      const { email, password } = loginData;
      const response = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (response.status === 200) {
        toaster("Successfully Logged In!");
        setLoading(false);
        nookies.set(null, "isLoggedIn", "true", {
          maxAge: 1 * 24 * 60 * 60,
          path: "/",
        });
        router.push("/");
      } else {
        setLoading(false);
        setErrors({ ...errors, password: "Invalid User or Password" });
      }
    } catch (error) {
      setLoading(false);
      toasterError("Invalid Credentials");
      console.error("Error:", error.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center z-20 relative">
      <div className="w-full max-w-[400px] px-4">
        <h1 className="text-white text-center text-4xl sm:text-5xl md:text-6xl font-semibold leading-[80px]">
          Sign in
        </h1>

        <div className="mt-10">
          <div>
            <input
              type="text"
              onChange={(e) => onInputChange(e)}
              name="email"
              placeholder="Email"
              className={`w-full sm:w-[300px] h-12 flex-shrink-0 p-2 pl-4 rounded-[10px] bg-[#224957] placeholder:text-white text-white ${
                errors.email ? "border border-[#EB5757] caret-[#EB5757]" : ""
              }`}
              autoComplete="on"
            />
            {errors.email && (
              <p className="text-[#EB5757] text-sm mt-1.5">{errors.email}</p>
            )}
          </div>

          <div className="mt-6 relative">
            <input
              type={passwordVisible ? "text" : "password"}
              onChange={(e) => onInputChange(e)}
              name="password"
              placeholder="Password"
              className={`w-full sm:w-[300px] h-12 flex-shrink-0 p-2 pl-4 rounded-[10px] bg-[#224957] placeholder:text-white text-white ${
                errors.password ? "border border-[#EB5757] caret-[#EB5757]" : ""
              }`}
              autoComplete="on"
            />
            <span
              onClick={() => {
                setPasswordVisible((prevState) => !prevState);
              }}
              className="absolute right-4 sm:right-20 top-[50%] transform -translate-y-1/2 cursor-pointer"
            >
              {passwordVisible ? (
                <FaEye className="text-black text-2xl" />
              ) : (
                <FaEyeSlash className="text-black text-2xl" />
              )}
            </span>

            {errors.password && (
              <p className="text-[#EB5757] text-sm mt-1.5">{errors.password}</p>
            )}
          </div>

          <div className="flex items-center mt-6">
            <input
              type="checkbox"
              id="rememberMe"
              className="w-5 h-5 mr-2 flex-shrink-0 border rounded-[5px] accent-[#224957] border-white cursor-pointer"
            />
            <label
              htmlFor="rememberMe"
              className="text-white text-base font-normal"
            >
              Remember me
            </label>
          </div>

          <button
            onClick={() => handleLogin()}
            disabled={loading ? true : false}
            className="w-full sm:w-[300px] mt-6 px-6 py-4 rounded-[10px] bg-[#2BD17E] text-white font-bold text-base text-center"
          >
            Log in
          </button>
          {loading && <Loader />}

          <p className="text-center mt-4 text-white">
            Don't have an account?{" "}
            <Link
              href={"/auth/signup"}
              className="cursor-pointer text-teal-500 hover:text-teal-600 ml-0.5"
            >
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
