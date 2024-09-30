import React from "react";
import { useNavigate } from "react-router-dom";

interface SignoutDialogProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

const SignoutDialog: React.FC<SignoutDialogProps> = ({ open, setOpen }) => {
  const navigate = useNavigate();
  if (!open) return null;

  const handleLogout = () => {
    localStorage.clear();
    setOpen(false);
    navigate("/signin");
  };

  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 z-50 flex justify-center items-center w-full h-full overflow-y-auto overflow-x-hidden bg-gray-800 bg-opacity-50"
    >
      <div className="relative p-4 w-full max-w-2xl max-h-full">
        <div className="relative bg-white rounded-lg shadow">
          <div className="p-4 md:p-5 space-y-4">
            <p className="text-base leading-relaxed text-gray-500">
              Are you sure you wish to logout?
            </p>
          </div>
          <div className="flex justify-end items-center p-4 md:p-5 border-t border-gray-200 rounded-b">
            <button
              data-modal-hide="default-modal"
              type="button"
              className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
              onClick={handleLogout}
            >
              Yes
            </button>
            <button
              onClick={() => setOpen(false)}
              data-modal-hide="default-modal"
              type="button"
              className="py-2.5 px-5 ms-3 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignoutDialog;
