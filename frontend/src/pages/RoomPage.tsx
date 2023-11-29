import { useEffect, useState } from "react";
import RoomUserCard from "../components/room/UserCard";
import RoomChatBox from "../components/room/ChatBox";
import RoomButtonBox from "../components/room/ButtonBox";
import { useSocketStore } from "../store/useSocket";
import { useNavigate } from "react-router-dom";
import StartAnimation from "../components/room/StartAnimation";
import SlidePage from "../components/common/SlidePage";
import { useRoomStore } from "../store/useRoom";
import { GameRoom } from "../store/useLobby";

interface IExitRoomResponse {
  status: "success" | "fail";
  userList: string[];
  gameRoomList: GameRoom[];
}

const RoomPage: React.FC = () => {
  const [isStart, setIsStart] = useState(false);
  const navigate = useNavigate();
  const { socket } = useSocketStore();
  const {
    roomInfo: { userList, capacity, roomId },
    setRoomUserList,
  } = useRoomStore();

  const handleUserEnterRoom = ({ userName }: { userName: string }) => {
    setRoomUserList(userList.concat({ userName, ready: false }));
  };

  const handleUserExitRoom = ({ userName: newUserName }: { userName: string }) => {
    setRoomUserList(userList.filter(({ userName }) => userName !== newUserName));
  };

  const handleEnterLobby = ({ status, userList, gameRoomList }: IExitRoomResponse) => {
    if (status === "success") {
      navigate("/lobby", { state: { data: { userList, gameRoomList } } });
    }
  };

  const handleUserReady = ({ userName, ready }: { userName: string; ready: boolean }) => {
    setRoomUserList(userList.map(user => (user.userName === userName ? { ...user, ready } : user)));
  };

  const handleStart = () => {
    setIsStart(true);
    setTimeout(() => {
      setIsStart(false);
      setTimeout(() => {
        navigate("/game");
      }, 300);
    }, 3000);
  };

  useEffect(() => {
    if (socket) {
      socket.on("user_enter_room", handleUserEnterRoom);
      socket.on("user_exit_room", handleUserExitRoom);
      socket.on("exit_room", handleEnterLobby);
      socket.on("ready", handleUserReady);
      socket.on("start", handleStart);
    }
    return () => {
      if (socket) {
        socket.off("user_enter_room", handleUserEnterRoom);
        socket.off("user_exit_room", handleUserExitRoom);
        socket.off("exit_room", handleEnterLobby);
        socket.off("ready", handleUserReady);
        socket.off("start", handleStart);
      }
    };
  }, [socket]);

  const emptyList = new Array((capacity ?? userList.length) - userList.length).fill({
    isHost: false,
    userName: "대기중...",
    ready: false,
  });

  const users = userList
    .concat(emptyList)
    .map(({ userName, ready }, index) => (
      <RoomUserCard userName={userName} isHost={index === 0} ready={ready} key={userName + index} />
    ));

  return (
    <SlidePage className="flex justify-center items-center w-full h-full gap-3 p-16">
      <StartAnimation isStart={isStart} />
      <div className="w-[65%] h-full grid grid-cols-3 gap-2 ">{users}</div>
      <div className="w-[35%] h-full flex flex-col items-center gap-3 ">
        <RoomChatBox roomId={roomId || ""} />
        <RoomButtonBox roomId={roomId || ""} />
      </div>
    </SlidePage>
  );
};

export default RoomPage;
