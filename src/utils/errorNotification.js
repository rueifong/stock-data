import { notification } from "antd";
import { appEventEmitter } from "../App";

function errorNotification(error) {
  if (error?.statusCode === 401) {
    appEventEmitter.emit("unauthorization");
  }
  notification.open({
    type: "error",
    message: error?.statusCode,
    description: error?.message,
    duration: 3,
  });
}

export default errorNotification;
