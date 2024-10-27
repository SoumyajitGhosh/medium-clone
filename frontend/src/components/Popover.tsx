import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import SignoutDialog from "./SignoutDialog";

interface PopoverProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

const Popover: React.FC<PopoverProps> = ({ open /*, setOpen*/ }) => {
  const [openSection, setOpenSection] = useState(false);
  const navigate = useNavigate();
  if (!open) return null;

  return (
    <>
      <div
        data-popover
        id="popover-default"
        role="tooltip"
        className="z-10 absolute text-sm duration-300 bg-white border border-gray-200 rounded-lg shadow-sm opacity-1 translate-x-[42px] translate-y-[-7px]"
      >
        <div className="px-4 py-2 bg-gray-100 border-b border-gray-200 rounded-t-lg">
          <h3
            className="font-semibold text-gray-900 cursor-pointer"
            onClick={() => navigate("/my-profile")}
          >
            My Profile
          </h3>
        </div>
        <div
          className="px-3 py-2 bg-gray-100 border-b border-gray-200 rounded-t-lg"
          onClick={() => {
            setOpenSection(true);
          }}
        >
          <h3 className="font-semibold text-gray-900 cursor-pointer">Logout</h3>
        </div>
        <div className="popover-arrow" data-popper-arrow></div>
      </div>
      <SignoutDialog open={openSection} setOpen={setOpenSection} />
    </>
  );
};

export default Popover;
