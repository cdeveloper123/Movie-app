"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toaster, toasterError } from "../components/Toaster";
import Link from "next/link";
import Loader from "../../components/Loader";
import { FaEye } from "react-icons/fa";
import { FaEyeSlash } from "react-icons/fa";

export default function SignUp() {
  const router = useRouter();

  const [signupData, setSignupData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({
    email: "",
    password: "",
    username: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);

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
      setErrors((prevErrors) => ({ ...prevErrors, username: "" }));
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

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>]).{6,}$/;
    if (isInputEmpty(signupData.password)) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        password: "Password is required",
      }));
      isValid = false;
    } else if (!passwordRegex.test(signupData.password)) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        password: "Password must be at least 6 characters long, contain one uppercase letter, one lowercase letter, and one special character.",
      }));
      isValid = false;
    } else {
      setErrors((prevErrors) => ({ ...prevErrors, password: "" }));
    }

    if (isInputEmpty(signupData.confirmPassword)) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        confirmPassword: "Please confirm your password",
      }));
      isValid = false;
    } else if (signupData.confirmPassword !== signupData.password) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        confirmPassword: "Passwords do not match",
      }));
      isValid = false;
    } else {
      setErrors((prevErrors) => ({ ...prevErrors, confirmPassword: "" }));
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
      setLoading(true);
      const data = await response.json();
      if (data.error) {
        setLoading(false);
        toasterError(data.error);
      }

      if (response.ok) {
        toaster("Sign Up Successful");
        setLoading(false);
        router.push("/auth/login");
      } else {
        setLoading(false);
        setErrors("Something went wrong. Please try again.");
      }
    } catch (error) {
      setLoading(false);
      console.error(error.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center z-20 relative">
      <div className="w-80">
        <h1 className="text-white text-center text-[64px] font-semibold leading-[80px]">
          Sign up
        </h1>

        <div className="mt-10 px-2">
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
            <div>
              <div className="relative">
                <input
                  type={passwordVisible ? "text" : "password"}
                  onChange={(e) => onInputChange(e)}
                  name="password"
                  placeholder="Password"
                  className={`w-[300px] h-12 flex-shrink-0 p-2 pl-4 mt-6 rounded-[10px] bg-[#224957] placeholder:text-white text-white ${
                    errors.password
                      ? "border border-[#EB5757] caret-[#EB5757]"
                      : ""
                  }`}
                  autoComplete="on"
                />
                <span
                  onClick={() => {
                    setPasswordVisible((prevState) => !prevState);
                  }}
                  className="absolute right-4 top-[65%] transform -translate-y-1/2 cursor-pointer"
                >
                  {passwordVisible ? (
                    <FaEye className="text-black text-2xl" />
                  ) : (
                    <FaEyeSlash className="text-black text-2xl" />
                  )}
                </span>
              </div>
            </div>
            {errors.password && (
              <p className="text-[#EB5757] text-sm mt-1.5">{errors.password}</p>
            )}
          </div>

          <div>
            <div className="relative">
              <input
                type={confirmPasswordVisible ? "text" : "password"}
                onChange={(e) => onInputChange(e)}
                name="confirmPassword"
                placeholder="Confirm Password"
                className={`w-[300px] h-12 flex-shrink-0 p-2 pl-4 mt-6 rounded-[10px] bg-[#224957] placeholder:text-white text-white ${
                  errors.confirmPassword
                    ? "border border-[#EB5757] caret-[#EB5757]"
                    : ""
                }`}
                autoComplete="on"
              />
              <span
                onClick={() => {
                  setConfirmPasswordVisible((prevState) => !prevState);
                }}
                className="absolute right-4 top-[65%] transform -translate-y-1/2 cursor-pointer"
              >
                {confirmPasswordVisible ? (
                  <FaEye className="text-black text-2xl" />
                ) : (
                  <FaEyeSlash className="text-black text-2xl" />
                )}
              </span>
            </div>
            {errors.confirmPassword && (
              <p className="text-[#EB5757] text-sm mt-1.5">
                {errors.confirmPassword}
              </p>
            )}
          </div>

          <button
            onClick={() => submitForm()}
            className={`w-[300px] items-center gap-[5px] px-6 py-4 mt-6 rounded-[10px] bg-[#2BD17E] text-white font-bold text-base text-center`}
            disabled={loading ? true : false}
          >
            Sign up
          </button>
          {loading && <Loader />}

          <p className="text-center mt-4 text-white">
            {`Already have an account? `}
            <Link
              href="/auth/login"
              className="cursor-pointer text-teal-500 hover:text-teal-600 ml-0.5"
            >
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
