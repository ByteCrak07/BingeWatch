//Components
import { useEffect, useState } from "react";
import Danger from "./Danger";
import Success from "./Success";

const popAlert = {};

function ReturnAlert(props) {
  useEffect(() => {
    const timeout = setTimeout(() => {
      props.setAlert(null);
    }, 5000);

    return () => {
      clearTimeout(timeout);
    };
  }, [props]);
  if (props.type === "danger")
    return (
      <Danger title={props.title} content={props.content} icon={props.icon} />
    );
  if (props.type === "success")
    return (
      <Success title={props.title} content={props.content} icon={props.icon} />
    );
  else return "";
}

function Alert() {
  const [alert, setAlert] = useState(null);
  popAlert.display = setAlert;

  return (
    <>
      {alert ? (
        <ReturnAlert
          type={alert.type}
          title={alert.title}
          content={alert.content}
          icon={alert.icon}
          setAlert={setAlert}
        />
      ) : (
        <></>
      )}
    </>
  );
}

export { popAlert };
export default Alert;
