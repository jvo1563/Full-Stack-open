const Notification = ({ message }) => {
  if (message === null) {
    return null;
  }
  if (message.includes("Error:")) {
    return <div style={errorStyle}>{message}</div>;
  }
  return <div style={notificationStyle}>{message}</div>;
};

export default Notification;

const notificationStyle = {
  color: "green",
  background: "lightgrey",
  fontSize: 20,
  borderStyle: "solid",
  borderRadius: 5,
  padding: 10,
  marginBottom: 10,
};

const errorStyle = {
  color: "red",
  background: "lightgrey",
  fontSize: 20,
  borderStyle: "solid",
  borderRadius: 5,
  padding: 10,
  marginBottom: 10,
};
