"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import nookies from "nookies";
import { toaster, toasterError } from "../components/Toaster.js";

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

      const { email, password } = loginData;
      const response = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (response.status === 200) {
        toaster("Successfully Logged In!");

        nookies.set(null, "isLoggedIn", "true", {
          maxAge: 1 * 24 * 60 * 60,
          path: "/",
        });
        router.push("/");
      } else {
        setErrors({ ...errors, password: "Invalid User or Password" });
      }
    } catch (error) {
      toasterError("Invalid Credentials");
      console.error("Error:", error.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-80">
        <h1 className="text-white text-center text-[64px] font-semibold leading-[80px]">
          Sign in
        </h1>

        <div className="mt-10 px-2">
          <div>
            <input
              type="text"
              onChange={(e) => onInputChange(e)}
              name="email"
              placeholder="Email"
              className={`w-[300px] h-45 flex-shrink-0 p-2 pl-4 rounded-[10px] bg-[#224957] placeholder:text-white text-white ${
                errors.email ? "border border-[#EB5757] caret-[#EB5757]" : ""
              }`}
              autoComplete="on"
            />
            {errors.email && (
              <p className="text-[#EB5757] text-sm mt-1.5">{errors.email}</p>
            )}
          </div>

          <div>
            <input
              type="password"
              onChange={(e) => onInputChange(e)}
              name="password"
              placeholder="Password"
              className={`w-[300px] h-45 flex-shrink-0 p-2 pl-4 rounded-[10px] bg-[#224957] placeholder:text-white text-white mt-6 ${
                errors.password ? "border border-[#EB5757] caret-[#EB5757]" : ""
              }`}
              autoComplete="on"
            />
            {errors.password && (
              <p className="text-[#EB5757] text-sm mt-1.5">{errors.password}</p>
            )}
          </div>

          <div className="flex justify-center items-center mb-6 mt-6">
            <input
              type="checkbox"
              id="rememberMe"
              className="w-5 h-5 mr-2 flex-shrink-0 border round accent-[#224957] border-white rounded-[5px] checked:bg-[#000] checked:border-transparent cursor-pointer"
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
            className={`w-[300px] items-center gap-[5px] px-6 py-4 rounded-[10px] bg-[#2BD17E] text-white font-bold text-base text-center`}
          >
            Log in
          </button>

          <p className="text-center mt-4 text-white">
            {`Don't have an account? `}
            <span
              className="cursor-pointer text-teal-500 hover:text-teal-600 ml-0.5"
              onClick={() => router.push("/auth/signup")}
            >
              Sign up
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
