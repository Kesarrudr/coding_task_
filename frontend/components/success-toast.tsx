"use client"

import type React from "react"
import { toast, type ToastOptions, ToastContainer } from "react-toastify"
import { CheckCircle, X } from "lucide-react"
import "react-toastify/dist/ReactToastify.css"

interface SuccessCardProps {
  title?: string
  message: string
}

const SuccessCard: React.FC<SuccessCardProps> = ({ title = "Success", message }) => {
  return (
    <div className="flex w-full max-w-[340px] flex-col overflow-hidden rounded-lg border border-green-500/30 bg-gray-800 shadow-lg">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-green-500/20 bg-green-500/10 px-4 py-2">
        <div className="flex items-center">
          <CheckCircle className="mr-2 h-5 w-5 text-green-500" />
          <h3 className="font-medium text-green-400">{title}</h3>
        </div>
      </div>

      {/* Body */}
      <div className="p-4">
        <p className="mb-3 text-sm text-gray-300">{message}</p>

        {/* Action buttons */}
        <div className="flex justify-end space-x-2">
          <button
            onClick={(e) => {
              e.stopPropagation()
              toast.dismiss()
            }}
            className="flex items-center rounded-md bg-gray-700 px-3 py-1.5 text-xs text-gray-300 transition-colors hover:bg-gray-600"
          >
            <X className="mr-1 h-3 w-3" />
            Dismiss
          </button>
        </div>
      </div>
    </div>
  )
}

export function showSuccessNotification(message: string) {
  const title = `Success`

  const toastOptions: ToastOptions = {
    position: "bottom-right",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: false,
    pauseOnHover: true,
    draggable: true,
    closeButton: false,
  }

  return toast.success(<SuccessCard title={title} message={message} />, toastOptions)
}

// Export a configured ToastContainer for easy import
export function SuccessToastContainer() {
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
  )
}

