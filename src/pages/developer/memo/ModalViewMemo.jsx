import React from "react";
import { FaTimes } from "react-icons/fa";
import { formatDate, handleEscape } from "../../../functions/functions-general";

const ModalViewMemo = ({ itemView, setItemView }) => {
  const handleClose = () => {
    setItemView(null);
  };

  handleEscape(() => handleClose());

  return (
    <div className="bg-dark/50 overflow-y-auto overflow-x-hidden fixed top-0 right-0 bottom-0 left-0 z-99 flex justify-center items-center w-full md:inset-0 max-h-full animate-fadeIn">
      <div className="p-1 w-full max-w-4xl animate-slideUp">
        <div className="bg-white p-8 rounded-lg relative max-h-[90vh] overflow-y-auto">
          <button
            type="button"
            className="absolute top-6 right-6"
            onClick={handleClose}
          >
            <FaTimes />
          </button>

          <div className="grid grid-cols-[120px_1fr] gap-y-4 gap-x-5 pb-6 border-b border-gray-200">
            <div className="font-bold">To:</div>
            <div>{itemView.memo_to}</div>

            <div className="font-bold">From:</div>
            <div>{itemView.memo_from}</div>

            <div className="font-bold">Date:</div>
            <div>{formatDate(itemView.memo_date)}</div>

            <div className="font-bold">Category:</div>
            <div>{itemView.memo_category}</div>
          </div>

          <div className="pt-8 whitespace-pre-wrap leading-relaxed">
            {itemView.memo_text}
          </div>

          <div className="flex justify-end pt-8">
            <button
              type="button"
              className="btn-modal-cancel w-fit px-6"
              onClick={handleClose}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModalViewMemo;
