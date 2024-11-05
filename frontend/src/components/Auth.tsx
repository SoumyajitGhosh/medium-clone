import { ChangeEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  SignupInput,
  SigninInput,
} from "@_soumyajit.ghosh_/medium-clone-common";
import { callApi, errorResponse } from "../config";
import { errorNotify, successNotify } from "./ToastAlert";
import { useAuth } from "../AuthContext";

export const Auth = ({ type }: { type: "signup" | "signin" }) => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const initialInputs =
    type === "signup"
      ? { name: "", email: "", password: "" }
      : { email: "", password: "" };

  const [postInputs, setPostInputs] = useState<SignupInput | SigninInput>(
    initialInputs
  );

  async function sendRequest() {
    try {
      const response = await callApi<any>(
        `${import.meta.env.VITE_BACKEND_URL}/api/v1/user/${
          type === "signup" ? "signup" : "signin"
        }`,
        "POST",
        postInputs
      );
      const { jwt } = response?.data;
      successNotify("Login Succesful");
      navigate("/blogs");
      login(jwt);
    } catch (e) {
      errorNotify(errorResponse(e));
    }
  }
  return (
    <div className="h-screen flex justify-center flex-col">
      <div className="flex justify-center">
        <div>
          <div className="px-10">
            <div className="text-3xl font-extrabold">Create an account</div>
            <div className="text-slate-400">
              {type === "signup"
                ? "Already have an account?"
                : "Don't have an account?"}
              <Link
                className="pl-2 underline"
                to={type === "signup" ? "/signin" : "/signup"}
              >
                {type === "signup" ? "Sign in" : "Sign up"}
              </Link>
            </div>
          </div>
          <div className="pt-8">
            {type === "signup" ? (
              <LabelledInput
                label="Name"
                placeholder="John Doe"
                onChange={(e) => {
                  setPostInputs((c) => ({
                    ...c,
                    name: e.target.value,
                  }));
                }}
              />
            ) : null}
            <LabelledInput
              label="Email"
              placeholder="john.doe@gmail.com"
              onChange={(e) => {
                setPostInputs((c) => ({
                  ...c,
                  email: e.target.value,
                }));
              }}
            />
            <LabelledInput
              label="Password"
              type="password"
              placeholder="123456"
              onChange={(e) => {
                setPostInputs((c) => ({
                  ...c,
                  password: e.target.value,
                }));
              }}
            />
            <button
              type="button"
              onClick={sendRequest}
              className="mt-8 w-full text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700"
            >
              {type === "signup" ? "Sign up" : "Sign in"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export interface LabelledInputType {
  label: string;
  placeholder: string;
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
  type?: string;
  disabled?: boolean;
  value?: string;
}

export function LabelledInput({
  label,
  placeholder,
  type,
  onChange,
  disabled,
  value,
}: LabelledInputType) {
  return (
    <div>
      <label className="block mb-2 text-sm text-black font-semibold pt-4">
        {label}
      </label>
      <input
        disabled={disabled}
        type={type || "text"}
        id="first_name"
        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
        placeholder={placeholder}
        onChange={onChange}
        value={value}
        required
      />
    </div>
  );
}
