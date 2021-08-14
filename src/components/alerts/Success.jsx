function SuccessAlert(props) {
  return (
    <div className="fixed z-50 right-0">
      <div className="mt-2 -mb-12 w-96 overflow-hidden">
        <div className="bg-green-100 border border-green-300 text-green-700 px-4 py-3 rounded w-full animate-slideLeft">
          {props.icon ? (
            <i className="fas fa-check-circle animate-ping mr-3"></i>
          ) : (
            <></>
          )}
          <strong className="font-bold">{props.title}</strong>
          <span>{" " + props.content}</span>
        </div>
      </div>
    </div>
  );
}

export default SuccessAlert;
