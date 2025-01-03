"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toaster, toasterError } from "../components/Toaster";
import { signIn } from "next-auth/react";

export default function SignUp() {
  const router = useRouter();

  const [signupData, setSignupData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({
    email: "",
    password: "",
    username: "",
  });

  const onInputChange = (e) => {
    setSignupData({ ...signupData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const isInputEmpty = (inputValue) => {
    return inputValue == null || inputValue.trim() === "";
  };

  const validateFields = () => {
    let isValid = true;

    if (isInputEmpty(signupData.username)) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        username: "Username is required",
      }));
      isValid = false;
    } else {
      setErrors((prevErrors) => ({ ...prevErrors, email: "" }));
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (isInputEmpty(signupData.email)) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        email: "Email is required",
      }));
      isValid = false;
    } else if (!emailRegex.test(signupData.email)) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        email: "Invalid email format",
      }));
      isValid = false;
    } else {
      setErrors((prevErrors) => ({ ...prevErrors, email: "" }));
    }

    if (isInputEmpty(signupData.password)) {
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

  const submitForm = async () => {
    try {
      if (!validateFields()) {
        return;
      }

      const { email, password, username } = signupData;
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password, username }),
      });
      const data = await response.json();
      if (data.error) {
        toasterError(data.error);
      }

      if (response.ok) {
        toaster("Sign Up Successful");
        router.push("/auth/login");
      } else {
        setErrors("Something went wrong. Please try again.");
      }
    } catch (error) {
      console.error(error.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-80">
        <h1 className="text-white text-center text-[64px] font-semibold leading-[80px]">
          Sign up
        </h1>

        <div className="mt-10">
          <div>
            <input
              type="text"
              onChange={(e) => onInputChange(e)}
              name="username"
              placeholder="Username"
              className={`w-[300px] h-45 flex-shrink-0 p-2 pl-4 rounded-[10px] bg-[#224957] placeholder:text-white text-white ${
                errors.username ? "border border-[#EB5757] caret-[#EB5757]" : ""
              }`}
              autoComplete="on"
            />
            {errors.username && (
              <p className="text-[#EB5757] text-sm mt-1.5">{errors.username}</p>
            )}
          </div>

          <div>
            <input
              type="text"
              onChange={(e) => onInputChange(e)}
              name="email"
              placeholder="Email"
              className={`w-[300px] h-45 flex-shrink-0 p-2 pl-4 mt-6 rounded-[10px] bg-[#224957] placeholder:text-white text-white ${
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
              className={`w-[300px] h-45 flex-shrink-0 p-2 pl-4 mt-6 rounded-[10px] bg-[#224957] placeholder:text-white text-white ${
                errors.password ? "border border-[#EB5757] caret-[#EB5757]" : ""
              }`}
              autoComplete="on"
            />
            {errors.password && (
              <p className="text-[#EB5757] text-sm mt-1.5">{errors.password}</p>
            )}
          </div>

          <button
            onClick={() => submitForm()}
            className={`w-[300px] items-center gap-[5px] px-6 py-4 mt-6 rounded-[10px] bg-[#2BD17E] text-white font-bold text-base text-center 
            }`}
          >
            Sign up
          </button>

          <p className="text-center mt-4 text-white">
            {`Already have an account? `}
            <span
              className="cursor-pointer text-teal-500 hover:text-teal-600 ml-0.5"
              onClick={() => router.push("/auth/login")}
            >
              Log in
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
