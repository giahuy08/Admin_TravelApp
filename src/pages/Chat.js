import SendIcon from "@mui/icons-material/Send";
import CircularProgress from "@mui/material/CircularProgress";
import { useEffect, useRef, useState } from "react";
import callApi from "src/api/apiService";
import Message from "../components/message/Message";
import "./chat.css";
import SocketService from "./socket";

export default function Chat() {
  const [currentChat, setCurrentChat] = useState([]);
  const [conversations, setConversations] = useState([]);
  const [room, setRoom] = useState("");
  const [newMessage, setNewMessage] = useState("");
  const token = localStorage.getItem("accessToken");
  const [avatar, setAvatar] = useState("");
  const [messages, setMessages] = useState([]);
  const [skip,setSkip] = useState(0);
  const textRef = useRef("")

  const textToRef = (text) =>{
    textRef.current = textRef.current + text
  }

  console.log("re render");
  console.log(currentChat);
 
  const connectSocket = async (url) => {
    const socket = await SocketService.connect(url).catch((err) => {
      console.log("Error: ", err);
    });
  };

  const handleNewMessage = (e) => {
    setNewMessage(e.target.value);
  };

  const scrollRef = useRef();
  console.log(skip)
  const handleRoom = (idRoom) => {
    // socket.current.emit("JOIN_ROOM_CSS", {idUser:idRoom} );
    SocketService.socket.emit("JOIN_ROOM_CSS", { idUser: idRoom });
       getMessage(idRoom);
    
  };

  const getMessage = (idRoom) => {
    callApi(`chat/getMessage?idRoom=${idRoom}`, "GET").then(
      (res) => {
    
        setMessages(res.data.data.reverse());

      }
    );
  };

  useEffect(() => {
    if (token) {
      // console.log(`123`, token);
      const urlSocket = `https://be-travel.herokuapp.com?token=Bearer ${token}`;

      connectSocket(urlSocket);
    }

    onMessage();

    callApi(`chat/getRoom`)
      .then((res) => setConversations(res.data.data))
      .catch((err) => {
        console.log(err);
      });
    // getConversations();

    return () => {
      SocketService.disconnectSocket();
    };
  }, []);

  const onMessage = () => {
    if (SocketService.socket) {
      SocketService.socket.on("SEND_MESSAGE_SSC", (data) => {
        setMessages((prev) => [...prev,data]);
      });
    }
  };
  const handleSubmit = (e) => {
    // e.preventDefault();
    console.log("tin nhắn mới");
    console.log(textRef.current.value);

    SocketService.socket.emit("SEND_MESSAGE_CSS", { message:textRef.current.value });
    
    callApi(`chat/getMessage?idRoom=${room}`, "GET").then(
      (res) => {
        console.log(" ds tin nhắn");
        console.log(res.data.data);
        
        // setMessages(res.data.data.reverse());
      }
    );
    // onMessage()
    textRef.current.value="";
  };

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  window.onhashchange = () => {
    SocketService.disconnectSocket();
  };

  return (
    <div style={{ display: "flex" }}>
      <div className="chatMenu">
        <div className="chatMenuWrapper">
          {/* <input placeholder="Search for friends" className="chatMenuInput" /> */}
          <div  style={{ height: "500px", overflowY: "scroll" }}>

          {conversations.length === 0 ? (
            <CircularProgress style={{ display: "block", marginLeft: "40%" }} />
          ) : (
            
            conversations.map((c) => (
              <div
                className="chat_conversation"
                key={c.idRoom}
                // onClick={() => setCurrentChat(c)}
                onClick={() => {
                  setCurrentChat(c);
                  setRoom(c.idRoom);
                  setAvatar(c.avatar);
                  handleRoom(c.idRoom);
                }}
              >
                <img src={c.avatar} alt="" className="chat__user-avatar" />

                <span className="chat__user-name">{c.name}</span>
              </div>
            ))
          )}
          </div>
        </div>
      </div>

      <div className="chatBox">
        <div className="chatBoxWrapper">
          {room !== "" ? (
            <>
              <div className="chatBoxTop">
                {messages.map((m, index) => (
                  <div ref={scrollRef} key={index}>
                    <Message
                      message={m}
                      avatarUser={avatar}
                      own={localStorage.getItem("id") === m.creatorUser}
                    />
                  </div>
                ))}
              </div>

              <div className="chatBoxBottom">
                <div className="chat__wrapper">
                  <input
                    type="text"
                    className="chat__input"
                    ref = {textRef}
                    // onChange = {e=>textToRef(e.target.value)}
                  />
                </div>
            
                <SendIcon onClick={handleSubmit} />
    
              </div>
             
            </>
          ) : (
            <span className="noConversationText">
              Chọn đối tượng để bắt đầu cuộc trò chuyện.
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
