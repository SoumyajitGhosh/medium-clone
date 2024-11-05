import { useState } from "react";
import { Appbar } from "../components/Appbar";
import { LabelledInput } from "../components/Auth";
import { TextEditor } from "./Publish";
import { useAuth } from "../AuthContext";
import { BACKEND_URL, callApi, errorResponse } from "../config";
import { errorNotify, successNotify } from "../components/ToastAlert";
import { useNavigate } from "react-router-dom";

interface User {
  name: string;
  bio: string;
  email: string; // Add other properties as needed
}

export const ProfileSection = () => {
  const navigate = useNavigate();
  const { user, fetchUserInfo } = useAuth();
  const [name, setName] = useState(user?.name || "");
  const [bio, setBio] = useState(user?.bio || "");

  const updateUser = async () => {
    const reqBody: Partial<User> = {};

    if (user?.name !== name && name.trim() !== "") {
      reqBody.name = name;
    }
    if (user?.bio !== bio && bio.trim() !== "") {
      reqBody.bio = bio;
    }

    if (Object.keys(reqBody).length > 0) {
      try {
        const response = await callApi<any>(
          `${BACKEND_URL}/api/v1/user/modify-info/${localStorage.getItem(
            "token"
          )}`,
          "PATCH",
          reqBody,
          {
            Authorization: `${localStorage.getItem("token")}`,
          }
        );
        successNotify(response?.data?.message);
        fetchUserInfo(`${localStorage.getItem("token")}`);
        navigate("/blogs");
      } catch (e) {
        // alert user
        errorNotify(errorResponse(e));
      }
    }
  };

  return (
    <>
      <Appbar />
      <div className="flex justify-center flex-col">
        <div className="flex justify-center">
          <div>
            <div className="px-10">
              <div className="text-3xl text-center font-extrabold">
                My account
              </div>
            </div>
            <div className="pt-8">
              <LabelledInput
                label="Email"
                placeholder="john.doe@gmail.com"
                disabled={true}
                value={user?.email}
              />
              <LabelledInput
                label="Name"
                placeholder="John Doe"
                onChange={(e) => {
                  setName(e.target.value);
                }}
                value={name}
              />
              <LabelledInput
                label="Password"
                type="password"
                placeholder="*****"
                disabled={true}
              />
              <TextEditor onChange={setBio} />
              <button
                type="button"
                onClick={updateUser}
                disabled={user?.name === name && user?.bio === bio}
                className="w-full text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700"
              >
                {"Update"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
