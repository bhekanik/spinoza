import { Toast, ToastType } from "src/components/Toast";

interface ToastOptions {
  type: ToastType;
}

export const useToast = () => {
  const toast = ({ type }: ToastOptions) => {
    return <Toast type={type} />;
  };

  return toast;
};
