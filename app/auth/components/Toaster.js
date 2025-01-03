import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const toaster = (data) => {
  toast.success(data, {
    position: "top-center",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "light",
  });
};

const toasterError = (data) => {
  toast.error(data, {
    position: "top-center",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "light",
  });
};

export { toaster, toasterError };
