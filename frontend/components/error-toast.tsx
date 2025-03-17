"use client";

import type React from "react";
import { toast, type ToastOptions, ToastContainer } from "react-toastify";
import { X } from "lucide-react";
import "react-toastify/dist/ReactToastify.css";

interface ErrorCardProps {
  title?: string;
  message: string;
}

const ErrorCard: React.FC<ErrorCardProps> = ({ title = "Error", message }) => {
  return (
    <div className="flex w-full max-w-[340px] flex-col overflow-hidden rounded-lg border border-red-500/30 bg-gray-800 shadow-lg">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-red-500/20 bg-red-500/10 px-4 py-2">
        <div className="flex items-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="mr-2 h-5 w-5 text-red-500"
          >
            <path
              fillRule="evenodd"
              d="M9.401 3.07a.75.75 0 01.26.331c.606 3.212 1.546 6.222 2.686 9.041.243.63.543 1.165.888 1.659 1.155 1.597 3.095 3.199 5.092 4.075a.75.75 0 01-.534 1.25l-4.755.507a.75.75 0 01-.699-.411A3 3 0 006.173 15.75a3 3 0 00-2.764 1.537.75.75 0 01-1.079-.197l-1.78-4.444a.75.75 0 01.411-.698l.507-4.755a.75.75 0 011.25-.534c.876 1.997 2.478 3.937 4.075 5.092.494.345 1.03.645 1.659.888 2.819 1.14 5.828 2.08 9.04 2.686a.75.75 0 01.331.26zM12 10.5a1.5 1.5 0 100-3 1.5 1.5 0 000 3z"
              clipRule="evenodd"
            />
          </svg>
          <h3 className="font-medium text-red-400">{title}</h3>
        </div>
      </div>

      {/* Body */}
      <div className="p-4">
        <p className="mb-3 text-sm text-gray-300">{message}</p>

        {/* Action buttons */}
        <div className="flex justify-end space-x-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              toast.dismiss();
            }}
            className="flex items-center rounded-md bg-gray-700 px-3 py-1.5 text-xs text-gray-300 transition-colors hover:bg-gray-600"
          >
            <X className="mr-1 h-3 w-3" />
            Dismiss
          </button>
        </div>
      </div>
    </div>
  );
};

export function showErrorNotification(message: string) {
  const title = `Error`;

  const toastOptions: ToastOptions = {
    position: "bottom-right",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: false,
    pauseOnHover: true,
    draggable: true,
    closeButton: false,
  };

  return toast.error(
    <ErrorCard title={title} message={message} />,
    toastOptions,
  );
}

export function ErrorToastContainer() {
  return (
    <ToastContainer
      position="bottom-right"
      autoClose={5000}
      hideProgressBar={false}
      newestOnTop
      closeOnClick={false}
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
      theme="dark"
    />
  );
}
