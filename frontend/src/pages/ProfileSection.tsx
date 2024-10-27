import { useState } from "react";
import { Appbar } from "../components/Appbar";
import { LabelledInput } from "../components/Auth";
import { TextEditor } from "./Publish";
import { useAuth } from "../AuthContext";

export const ProfileSection = () => {
  const { user } = useAuth();
  const [name, setName] = useState(user?.name);
  const [bio, setBio] = useState(user?.bio);
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
                onChange={(e) => {}}
                disabled={true}
              />
              <LabelledInput
                label="Name"
                placeholder="John Doe"
                onChange={(e) => {}}
                value={name}
              />
              <LabelledInput
                label="Password"
                type="password"
                placeholder="123456"
                onChange={(e) => {}}
                disabled={true}
              />
              <TextEditor onChange={setBio} />
              <button
                type="button"
                onClick={() => {}}
                className="w-full text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700"
              >
                {"Edit"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
