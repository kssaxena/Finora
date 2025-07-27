import { ArrowBigDownDash, X } from "lucide-react";
import { useRef } from "react";

const PopUp = ({ children, onClose, onClick }) => {
  const modelRef = useRef();

  const closeModel = (e) => {
    if (modelRef.current === e.target) {
      onClose();
    }
  };

  return (
    <div
      ref={modelRef}
      onClick={closeModel}
      className="Pop-Up-Model fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm flex justify-center items-center"
    >
      <div className=" flex flex-col  gap-5 text-white">
        <div className="Close-Btn place-self-end flex flex-row-reverse gap-5">
          <button onClick={onClose}>
            <X size={30} />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
};

export default PopUp;
