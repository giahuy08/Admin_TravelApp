import "./message.css";
// import { format } from "timeago.js";

export default function Message({ message, avatarUser, own }) {
  console.log(own);
  return (
    <>
      {own ? (
        <div className="message own">
          <div className="messageTop">
            <p className="messageText">{message.message}</p>
            <img className="messageImg" src="/static/mock-images/avatars/avatar_default.jpg" alt="" />
          </div>
        </div>
      ) : (
        <div className="message">
          <div className="messageTop">
            <p className="messageText">{message.message}</p>
            <img className="messageImg" src={avatarUser} alt="" />
          </div>
        </div>
      )}
    </>
  );
}
