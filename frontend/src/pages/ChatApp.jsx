import { removeUnreadMessage_api } from "@/api";
import { ChatOrGroupDetails } from "@/components/ChatOrGroupDetails";
import { OneOnOneVc } from "@/components/videocall/OneOnOneVc";
import { AllChats } from "@/components/chat/AllChats";
import { SelectedChat } from "@/components/chat/SelectedChat";
import { connectSocket } from "@/redux/actions/socketActions";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ReceivingCall } from "@/components/videocall/ReceivingCall";
import peer from "@/service/peer2peer";
import {
  getChats,
  getNewFriends,
  getSentRequests,
  getfriendRequests,
  getfriends,
  updateChats,
  updateFriendRequests,
  updateFriends,
  updateNewFriends,
  updateSelectedChat,
  updateSentRequests,
  updateUnreadMessages,
} from "@/redux/actions/userActions";
import { useToast } from "@/components/ui/use-toast";

const NEWFRIENDREQUEST = "new-friend-request";
const REQUESTSENT = "request-sent";
const REQUESTACCEPTED = "request-accepted";

export const ChatApp = () => {
  const { toast } = useToast();

  const dispatch = useDispatch();
  const socket = useSelector((state) => state.socket.socket);
  const newUsers = useSelector((state) => state.user.newUsers);
  const sentRequests = useSelector((state) => state.user.sentRequests);
  const friendRequests = useSelector((state) => state.user.friendRequests);
  const friends = useSelector((state) => state.user.friends);
  const selectedChat = useSelector((state) => state.user.selectedChat);
  const chats = useSelector((state) => state.user.chats);
  const loggedinUser = useSelector((state) => state.user.userDetail);
  const unreadMessages = useSelector((state) => state.user.unreadMessages);

  const newUsersRef = useRef(null);
  newUsersRef.current = newUsers;
  const sentRequestsRef = useRef(null);
  sentRequestsRef.current = sentRequests;
  const friendRequestsRef = useRef(null);
  friendRequestsRef.current = friendRequests;
  const friendsRef = useRef(null);
  friendsRef.current = friends;
  const selectedChatRef = useRef(null);
  selectedChatRef.current = selectedChat;
  const chatsRef = useRef(null);
  chatsRef.current = chats;
  const typingTimeoutRef = useRef(null);
  const loggedinUserRef = useRef(null);
  loggedinUserRef.current = loggedinUser;
  const unreadMessagesRef = useRef(null);
  unreadMessagesRef.current = unreadMessages;

  const [messages, setMessages] = useState([]);
  const [selfTyping, setSelfTyping] = useState(false);
  const [typingUsersObject, setTypingUsersObject] = useState({}); // it's an nested object which contains the key as chatID and value as typer detail
  const [onlineUsers, setOnlineUsers] = useState({});
  const [isOnCall, setIsOnCall] = useState(false);
  const [onCallWithUser, setOnCallWithUser] = useState({});
  const [isReceivingCall, setIsReceivingCall] = useState(false);
  const [remoteSocketId, setRemoteSocketId] = useState(null);
  const [myStream, setMyStream] = useState(null);
  const [remoteStream, setRemoteStream] = useState(null);
  const [callingStatus, setCallingStatus] = useState(null); // null || calling || ringing || On another call
  const typingUsersObjectRef = useRef(null);
  typingUsersObjectRef.current = typingUsersObject;
  const myStreamRef = useRef(null);
  myStreamRef.current = myStream;

  const onRequestSent = (data) => {
    const updatedNewFriendsArray = [];
    const updatedSentRequests = sentRequestsRef.current || [];
    newUsersRef.current &&
      newUsersRef.current.forEach((el) =>
        el._id !== data.sentTo
          ? updatedNewFriendsArray.push(el)
          : updatedSentRequests.push(el)
      );
    dispatch(updateNewFriends(updatedNewFriendsArray));
    dispatch(updateSentRequests(updatedSentRequests));
  };

  const onReceivedNewRequest = (data) => {
    const updatedNewFriendsArray = [];
    const updatedFriendRequests = friendRequestsRef.current || [];
    newUsersRef.current &&
      newUsersRef.current.forEach((el) =>
        el._id !== data.sentBy
          ? updatedNewFriendsArray.push(el)
          : updatedFriendRequests.push({ ...el, requestId: data.requestId })
      );
    dispatch(updateNewFriends(updatedNewFriendsArray));
    dispatch(updateFriendRequests(updatedFriendRequests));
  };

  const onRequestAccepted = (data) => {
    if (data.receiverId) {
      // When Someone has accepted your request
      const updatedSentRequests = [];
      const updatedFriends = friendsRef.current || [];
      sentRequestsRef.current &&
        sentRequestsRef.current.forEach((el) =>
          el._id !== data.receiverId
            ? updatedSentRequests.push(el)
            : updatedFriends.push(el)
        );
      dispatch(updateSentRequests(updatedSentRequests));
      dispatch(updateFriends(updatedFriends));
    } else if (data.senderId) {
      // When You accepted someone's request
      const updatedFriendRequests = [];
      const updatedFriends = friendsRef.current || [];
      friendRequestsRef.current &&
        friendRequestsRef.current.forEach((el) => {
          if (el._id !== data.senderId) {
            delete el.requestId;
            updatedFriendRequests.push(el);
          } else {
            updatedFriends.push(el);
          }
        });
      dispatch(updateFriendRequests(updatedFriendRequests));
      dispatch(updateFriends(updatedFriends));
    }
    // const updatedChats = chats.map((el) =>
    //   el._id === selectedChat._id ? { ...el, latestMessage: res.data.data } : el
    // );
    // dispatch(updateChats(updatedChats));
    dispatch(getChats()); //TODO: Avoid this API call
  };

  const onMessageReceived = async (message) => {
    const updatedChats = chatsRef.current?.reduce((acc, el) => {
      if (el._id === message.chatId) {
        const updatedChat = { ...el, latestMessage: message };
        return [updatedChat, ...acc];
      }
      return [...acc, el];
    }, []);
    dispatch(updateChats(updatedChats));
    if (message.chatId === selectedChatRef.current?._id) {
      setMessages((pre) => [...pre, message]);
      // TODO-> Remove unread  Message for DB
      try {
        if (
          unreadMessagesRef.current &&
          unreadMessagesRef.current[message.chatId]
        ) {
          await removeUnreadMessage_api(message.chatId);
          const updatedUnreadMessages = {
            ...unreadMessagesRef.current,
          };
          delete updatedUnreadMessages[message.chatId];
          dispatch(updateUnreadMessages(updatedUnreadMessages));
        }
      } catch (error) {
        console.log("error:", error);
      }
    } else {
      // TODO-> update the list of unread messages
      if (unreadMessagesRef.current) {
        const updatedUnreadMessages = {
          ...unreadMessagesRef.current,
          [message.chatId]:
            (+unreadMessagesRef.current[message.chatId] || 0) + 1,
        };
        dispatch(updateUnreadMessages(updatedUnreadMessages));
      }
    }
  };

  const handleStopTyping = (currentChat) => {
    socket.emit("stop typing", {
      chat: currentChat,
      typer: loggedinUserRef.current,
    });
    setSelfTyping(false);
  };

  const handleTypingMessageChange = () => {
    if (!selfTyping) {
      setSelfTyping(true);

      socket.emit("typing", {
        chat: selectedChatRef.current,
        typer: loggedinUserRef.current,
      });
    }
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    const currentChat = selectedChatRef.current;
    typingTimeoutRef.current = setTimeout(() => {
      handleStopTyping(currentChat);
    }, 1000);
  };

  const removeGroupFromChats = (group) => {
    const updatedChats = chatsRef.current?.filter(
      (chat) => chat._id !== group._id
    );
    dispatch(updateChats(updatedChats || []));
    if (selectedChatRef.current?._id === group._id) {
      dispatch(updateSelectedChat(null));
    }
  };

  const onRemovedBySomeone = (group) => {
    removeGroupFromChats(group);
  };

  const onGroupDelete = (group) => {
    removeGroupFromChats(group);
  };

  const replaceGroupWithNewGroup = (group) => {
    const updatedChats = chatsRef.current?.map((chat) =>
      chat._id === group._id ? group : chat
    );
    dispatch(updateChats(updatedChats || []));
    if (selectedChatRef.current?._id === group._id) {
      dispatch(updateSelectedChat(group));
    }
  };

  const onUserAdded = (group) => {
    replaceGroupWithNewGroup(group);
  };

  const onSomeoneLeaveOrRemoved = (group) => {
    replaceGroupWithNewGroup(group);
  };

  // ----------Video Call-----------

  const onInitiliseVc = useCallback(
    async ({ receiverId }) => {
      if (isOnCall) return; // TODO: add toast here
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });
        setMyStream(stream);
        setIsOnCall(true);
        setCallingStatus("Calling");
        socket.emit("calling-someone", { receiverId, you: loggedinUser });
      } catch (error) {
        console.log("error:", error);
        toast({
          variant: "destructive",
          title: "Permission Denied",
          description: "You need to grant camera and microphone permissions",
        });
      }
    },
    [socket]
  );

  const onReceivingVideoCall = useCallback(
    ({ sender, receiverId }) => {
      setOnCallWithUser(sender);
      setIsReceivingCall(true);
      socket.emit("receiving-call-notify-user", { sender, receiverId });
    },
    [socket]
  );
  const onReceivedCallNotification = () => {
    setCallingStatus("Ringing");
  };
  const onUserAlreadyOnCall = () => {
    setCallingStatus("On Another Call");
    setTimeout(() => {
      handleEndVideoCall();
    }, 10 * 1000);
  };

  const onCallAccepted = async ({ receiver }) => {
    setOnCallWithUser(receiver);
    setRemoteSocketId(receiver._id);
    const offer = await peer.generateOffer();
    socket.emit("sending-offer", {
      from: loggedinUser._id,
      to: receiver._id,
      offer,
    });
  };

  const onReceivingOffer = async ({ from, offer }) => {
    const ans = await peer.acceptAnswer(offer);
    socket.emit("sending-answer", { from: loggedinUser._id, to: from, ans });
  };
  const sendStreams = useCallback(() => {
    const peerConnection = peer.peer;
    // check if a track is already added
    const isTrackAlreadyAdded = (track) => {
      const senders = peerConnection.getSenders();
      for (const sender of senders) {
        if (sender.track === track) {
          return true;
        }
      }
      return false;
    };

    // Iterate through each track and add it if it's not already added
    for (const track of myStreamRef.current.getTracks()) {
      if (!isTrackAlreadyAdded(track)) {
        peerConnection.addTrack(track, myStreamRef.current);
      }
    }
  }, [myStream]);
  const onReceivingAnswer = useCallback(
    async ({ from, ans }) => {
      setCallingStatus(null);
      await peer.setLocalDescription(ans);
      sendStreams();
    },
    [socket, sendStreams]
  );
  const onReceivingNegotiationOffer = useCallback(
    async ({ from, offer }) => {
      const ans = await peer.acceptAnswer(offer);
      socket.emit("sending-negotiation-answer", {
        from: loggedinUser._id,
        to: from,
        ans,
      });
    },
    [socket]
  );

  const onReceivingNegotiationAnswer = useCallback(
    async ({ from, ans }) => {
      await peer.setLocalDescription(ans);
      socket.emit("accepting-negotiation-answer", {
        from: loggedinUser._id,
        to: from,
      });
    },
    [socket]
  );

  const onAcceptedNegotiationAnswer = () => {
    setTimeout(() => {
      sendStreams();
    }, 500);
  };

  const removeMediaTracks = (stream) => {
    if (!stream) return;
    stream.getTracks().forEach((track) => track.stop());
  };
  const handleEndVideoCall = () => {
    removeMediaTracks(myStream);
    setMyStream(null);
    removeMediaTracks(remoteStream);
    setRemoteStream(null);
    setIsOnCall(false);
    setOnCallWithUser({});
    setIsReceivingCall(false);
    setCallingStatus(null);
    setRemoteSocketId(null);
    setTimeout(() => {
      peer.closeRTCPeerConnection();
    }, 500);
  };
  const onVideoCallEnded = () => {
    handleEndVideoCall();
  };

  const onCallDeclined = () => {
    setCallingStatus("Declined Call");
    setTimeout(() => {
      handleEndVideoCall();
    }, 1000);
  };

  useEffect(() => {
    dispatch(connectSocket());
    dispatch(getNewFriends());
    dispatch(getSentRequests());
    dispatch(getfriendRequests());
    dispatch(getfriends());
    dispatch(getChats());
  }, []);

  useEffect(() => {
    if (!socket) return;

    socket.on("userConnected", (connectedUsers) => {
      setOnlineUsers(connectedUsers);
    });
    socket.on(NEWFRIENDREQUEST, onReceivedNewRequest);
    socket.on(REQUESTSENT, onRequestSent);
    socket.on(REQUESTACCEPTED, onRequestAccepted);
    socket.on("messageReceived", onMessageReceived);
    socket.on("someone typing", (data) => {
      setTypingUsersObject((pre) => ({ ...pre, [data.chat._id]: data.typer }));
    });
    socket.on("someone stop typing", ({ chat }) => {
      setTypingUsersObject((prev) => {
        const { [chat._id]: _, ...restTypingData } = prev;
        return restTypingData;
      });
    });

    socket.on("chat created", (group) => {
      const updatedChats = [group, ...(chatsRef.current || [])];
      dispatch(updateChats(updatedChats));
    });

    socket.on("Someone Removed you", onRemovedBySomeone);

    socket.on("Someone Leave or Removed", onSomeoneLeaveOrRemoved);

    socket.on("Group Deleted", onGroupDelete);
    socket.on("User Added to Group", onUserAdded);
    socket.on("userDisconnected", ({ connectedUsers, _id }) => {
      setOnlineUsers(connectedUsers);
      let wasTypingInChat;
      if (!typingUsersObjectRef.current) return;

      for (let chatId in typingUsersObjectRef.current) {
        if (typingUsersObjectRef.current[chatId]._id === _id) {
          wasTypingInChat = chatId;
        }
      }
      if (wasTypingInChat) {
        setTypingUsersObject((prev) => {
          const { [wasTypingInChat]: _, ...restTypingData } = prev;
          return restTypingData;
        });
      }
    });

    // ------video call-------------
    socket.on("initialise-vc", onInitiliseVc);
    socket.on("receiving-video-call", onReceivingVideoCall);
    socket.on("received-call-notification", onReceivedCallNotification);
    socket.on("user-already-on-call", onUserAlreadyOnCall);
    socket.on("call-accepted", onCallAccepted);
    socket.on("call-declined", onCallDeclined);
    socket.on("receiving-offer", onReceivingOffer);
    socket.on("receiving-answer", onReceivingAnswer);
    socket.on("receiving-negotiation-offer", onReceivingNegotiationOffer);
    socket.on("receiving-negotiation-answer", onReceivingNegotiationAnswer);
    socket.on("accepted-negotiation-answer", onAcceptedNegotiationAnswer);
    socket.on("video-call-ended", onVideoCallEnded);

    return () => {
      if (selfTyping) {
        handleStopTyping(selectedChat._id);
      }
      socket.off("new-friend-request");
      socket.off("request-sent");
      socket.off("request-accepted");
      socket.off("messageReceived");
      socket.off("someone typing");
      socket.off("someone stoped typing");
      socket.off("chat created");
      socket.off("Someone Removed you");
      socket.off("Someone Leave or Removed");
      socket.off("User Added to Group");
      socket.off("Group Deleted");
      socket.off("userDisconnected");
      socket.off("initialise-vc");
      socket.off("receiving-video-call");
      socket.off("received-call-notification", onReceivedCallNotification);
      socket.off("user-already-on-call", onUserAlreadyOnCall);
      socket.off("call-accepted", onCallAccepted);
      socket.off("call-declined", onCallDeclined);
      socket.off("receiving-offer", onReceivingOffer);
      socket.off("receiving-answer", onReceivingAnswer);
      socket.off("receiving-negotiation-offer", onReceivingNegotiationOffer);
      socket.off("receiving-negotiation-answer", onReceivingNegotiationAnswer);
      socket.off("accepted-negotiation-answer", onAcceptedNegotiationAnswer);
      socket.off("video-call-ended", onVideoCallEnded);
    };
  }, [socket, onReceivingAnswer, onReceivingNegotiationOffer]);

  return (
    <div className="flex">
      <AllChats
        typingUsersObject={typingUsersObject}
        selectedChat={selectedChat}
        unreadMessages={unreadMessages}
        onlineUsers={onlineUsers}
      />
      <SelectedChat
        handleStopTyping={handleStopTyping}
        messages={messages}
        setMessages={setMessages}
        handleTypingMessageChange={handleTypingMessageChange}
        typingUsersObject={typingUsersObject}
        unreadMessages={unreadMessages}
        onlineUsers={onlineUsers}
        setIsOnCall={setIsOnCall}
        isOnCall={isOnCall}
      />
      <ChatOrGroupDetails selectedChat={selectedChat} />
      {isOnCall && (
        <OneOnOneVc
          setIsOnCall={setIsOnCall}
          selectedChat={selectedChat}
          myStream={myStream}
          setMyStream={setMyStream}
          remoteStream={remoteStream}
          setRemoteStream={setRemoteStream}
          peer={peer}
          remoteSocketId={remoteSocketId}
          callingStatus={callingStatus}
          handleEndVideoCall={handleEndVideoCall}
          onCallWithUser={onCallWithUser}
          loggedinUser={loggedinUser}
        />
      )}
      {!isOnCall && isReceivingCall && (
        <ReceivingCall
          setIsOnCall={setIsOnCall}
          onCallWithUser={onCallWithUser}
          setIsReceivingCall={setIsReceivingCall}
          setRemoteSocketId={setRemoteSocketId}
          handleEndVideoCall={handleEndVideoCall}
          setMyStream={setMyStream}
        />
      )}
    </div>
  );
};
