import { useState } from "react";
import { Avatar } from "./BlogCard";
import { Link } from "react-router-dom";
import AppLogo from "../assets/appLogo.png";
import Popover from "./Popover";

export const Appbar = () => {
  const [openPopover, setOpenPopover] = useState(false);
  return (
    <div className="border-b flex justify-between px-10 py-4">
      <Link
        to={"/blogs"}
        className="flex flex-row justify-center cursor-pointer"
      >
        <img src={AppLogo} width="64px" height="64px" />
      </Link>
      <div className="pt-4">
        <Link to={`/publish`}>
          <button
            type="button"
            className="mr-4 text-white bg-green-700 hover:bg-green-800 focus:outline-none focus:ring-4 focus:ring-green-300 font-medium rounded-full text-sm px-5 py-2.5 text-center me-2 mb-2 "
          >
            New
          </button>
        </Link>
        <button
          type="button"
          onClick={() => setOpenPopover((prevState) => !prevState)}
        >
          <Avatar size={"big"} name="Soumyajit" />
        </button>
        <Popover open={openPopover} setOpen={setOpenPopover} />
      </div>
    </div>
  );
};
