const Notification = ({ message }) => {
  if (message === null) {
    return null;
  }
  if (message.includes("Error:")) {
    return (
      <div id="error-message" style={errorStyle}>
        {message}
      </div>
    );
  }
  return (
    <div id="success-message" style={successStyle}>
      {message}
    </div>
  );
};

export default Notification;

const successStyle = {
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
