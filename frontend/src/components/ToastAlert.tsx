import toast, { Toaster, ToastBar } from "react-hot-toast";

const successNotify = (message: string) => toast.success(message);
const errorNotify = (message: string) => toast.error(message);

const CustomToaster = () => {
  return (
    <Toaster position="bottom-right" reverseOrder={false}>
      {(t) => (
        <ToastBar
          toast={t}
          style={{
            ...t.style,
            animation: t.visible
              ? "custom-enter 1s ease"
              : "custom-exit 1s ease",
          }}
        />
      )}
    </Toaster>
  );
};

export { successNotify, errorNotify, CustomToaster };
