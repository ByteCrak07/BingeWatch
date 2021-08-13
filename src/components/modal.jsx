import { useLayoutEffect } from "react";

function Modal({ setShowModal, children, clearValue }) {
  useLayoutEffect(() => {
    document.body.style.paddingRight =
      (window.innerWidth - document.body.clientWidth).toString() + "px";
    document.body.style.overflow = "hidden";

    const checkKey = (e) => {
      if (e.key === "Escape") {
        setShowModal(false);
        if (clearValue) clearValue();
      }
    };
    document.addEventListener("keydown", checkKey);

    return () => {
      document.body.style = "";
      document.removeEventListener("keydown", checkKey);
    };
  }, [setShowModal, clearValue]);

  return (
    <div className="fixed z-40 inset-0">
      <div
        className="absolute inset-0 bg-black opacity-75"
        onClick={() => {
          setShowModal(false);
          if (clearValue) clearValue();
        }}
      ></div>
      <div
        className="absolute left-1/2 top-1/2"
        style={{ transform: "translate(-50%,-50%)" }}
      >
        <div className="p-5 bg-white rounded-lg text-left overflow-hidden shadow-xl">
          {children}
        </div>
      </div>
    </div>
  );
}

export default Modal;
