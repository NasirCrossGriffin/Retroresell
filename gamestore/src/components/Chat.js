import React, { useState, useEffect } from "react";
import { findMessageByConversation, findMessageByRecipient, findMessageBySender, findUser, postMessage } from "./middleware";
import { useParams } from 'react-router-dom';
import { useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import socket from "./Socket"; // Import singleton instance
import "./Chat.css"


function Chat( id ) {
    const [messagesSent, setMessagesSent] = useState([]);
    const [messagesReceived, setMessagesReceived] = useState([]);
    const [activeUser, setActiveUser] = useState(null);
    const [recipient, setRecipient] = useState(null);
    const [chats, setChats] = useState(new Map());
    const [profilePictures, setProfilePictures] = useState(new Map()); // Cache for profile pictures
    const BASE_URL = process.env.REACT_APP_API_URL || "";


    const navigate = useNavigate();

    //Logic for gettin logged in user
    useEffect(() => {
        const fetchActiveUser = async () => {
            try {
                const user = await findUser(id.id);
                if (user) {
                    setActiveUser(user);
                    console.log("Active user is:", user.name); 
                }
            } catch (error) {
                console.error("Error fetching active user:", error);
            }
        };
    
        fetchActiveUser();
    }, [id.id]); 

    useEffect(() => {
        if (activeUser) {
            console.log("Sender updated:", activeUser.name);
        }
    }, [activeUser]);

    //Logic for getting the messages
    useEffect(() => {
        const fetchMessages = async () => {
            try {
                // Fetch messages sent by the user
                const sentMessages = await findMessageBySender(activeUser._id);
                console.log(sentMessages)
                if (sentMessages)
                    setMessagesSent(sentMessages !== null && sentMessages.length > 0 ? sentMessages : []);

                // Fetch messages received by the user
                const receivedMessages = await findMessageByRecipient(activeUser._id);
                console.log(receivedMessages)
                if (receivedMessages)
                    setMessagesReceived(receivedMessages !== null && receivedMessages.length > 0 ? receivedMessages : []);
            } catch (error) {
                console.error("Error fetching messages:", error);
            }
        };

        fetchMessages();
    }, [activeUser]); // Dependencies: re-run if `id` or `recipientid` changes

    //Update if a new message comes through
    useEffect(() => {
        socket.on("newMessage", (newMessage) => {
            try {
                console.log(newMessage);
                if (newMessage.sender === activeUser._id) {
                    setMessagesSent((prev) => [...prev, newMessage]);
                }

                if (newMessage.recipient === activeUser._id) {
                    setMessagesReceived((prev) => [...prev, newMessage]);
                }
            } catch (error) {
                console.error(error)
            }
        });

        return () => {
            socket.off("newMessage");
        };
    }, []); // Runs when sender or recipient changes

    //The logic for setting chats based off of the messages
    // Update the logic for setting chats
useEffect(() => {
    // Combine and sort messages
    const allMessages = [...messagesSent, ...messagesReceived].sort(
        (messageA, messageB) => new Date(messageA.date) - new Date(messageB.date)
    );

    console.log(allMessages)

    for (const message of allMessages) {
        // Determine the key for the chat
        const otherParticipant = message.sender === activeUser._id ? message.recipient : message.sender;
        const chatKey = [activeUser._id, otherParticipant].sort().join('_');  // Sort to ensure consistency

        // Update the chat with the new message
        setChats((prev) => {
            const updatedChats = new Map(prev);
            updatedChats.set(chatKey, message);
            console.log("Chat key:", chatKey);
            return updatedChats;
        });
    }
}, [messagesSent, messagesReceived]); // Re-run if `messagesSent` or `messagesReceived` changes

        // Sort chats by date before rendering
    const sortedChats = Array.from(chats.entries())
    .map(([chatKey, message]) => message) // Extract messages from Map
    .sort((a, b) => new Date(b.date) - new Date(a.date)); // Sort by date, newest first

    function autoResizeTextarea(event) {
        const textarea = event.target;
        textarea.style.height = 'auto'; // Reset height to auto to recalculate
        textarea.style.height = `${textarea.scrollHeight}px`; // Set height to scrollHeight
    }

    const navigateToConversation = (id) => {
        navigate(`/Conversation/${id}`, { replace: true });
    }

    

    useEffect(() => {
        const fetchAllProfilePictures = async () => {
            const newProfilePictures = new Map(profilePictures);
            for (const message of chats.values()) {
                const participantId =
                    message.sender === activeUser?._id
                        ? message.recipient
                        : message.sender;
                if (!newProfilePictures.has(participantId)) {
                    try {
                        const user = await findUser(participantId);
                        if (user && user.image) {
                            newProfilePictures.set(participantId, user.image);
                        }
                    } catch (error) {
                        console.error("Error fetching profile picture:", error);
                    }
                }
            }
            console.log(newProfilePictures)
            setProfilePictures(newProfilePictures); // Trigger re-render
            
        };

        const fetchAllRecipients = async () => {
            
        }

        if (chats.size > 0) fetchAllProfilePictures();
    }, [chats]);



    return (
        <>
            {(sortedChats.length > 0) ? (
                <div className="allChats"> 
                    {sortedChats.map((chat, index) => (
                        (chat.sender === activeUser._id) ? (
                            <>
                                <div key={index} className="chat" onClick={() => (navigateToConversation(chat.recipient))}>
                                    <div className="Bubble"> 
                                        <p>{chat.message}</p>
                                    </div>
                                    <div className="MSGProfilePicture">
                                        <img src={`${BASE_URL}${profilePictures.get(chat.recipient) || "profile pic"}`} alt="profile picture" />
                                    </div>
                                </div>
                            </>
                        ) : (
                            <>
                                <div key={index} className="chat" onClick={() => (navigateToConversation(chat.sender))}>
                                    <div className="Bubble"> 
                                        <p>{chat.message}</p>
                                    </div>
                                    <div className="MSGProfilePicture">
                                        <img src={`${BASE_URL}${profilePictures.get(chat.sender)}`} alt="profile picture" />
                                    </div>
                                </div>
                            </>
                        )
                    ))}
                </div>
            ) : (
                <p>No messages yet</p>
            )}
        </>
    );
    
}


export default Chat;
