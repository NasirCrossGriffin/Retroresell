import React, { useState, useEffect } from "react";
import { findMessageByConversation, findUser, postMessage } from "./middleware";
import { useParams } from 'react-router-dom';
import { useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import "./Conversation.css"


function Conversation( id ) {
    const { recipientid } = useParams();
    const [messagesSent, setMessagesSent] = useState([]);
    const [messagesReceived, setMessagesReceived] = useState([]);
    const [conversation, setConversation] = useState([]);
    const [sender, setSender] = useState(null);
    const [recipient, setRecipient] = useState(null);
    const [text, setText] = useState("");

    const socket = io("http://localhost:3001");

    useEffect(() => {

        }, []
    )

    useEffect(() => {
        const fetchSender = async () => {
            try {
                const user = await findUser(id.id);
                if (user) {
                    setSender(user);
                    console.log("Sender is:", user.name); // Log directly after fetching
                }
            } catch (error) {
                console.error("Error fetching sender:", error);
            }
        };
    
        fetchSender();
    }, [id.id]); // Ensure you're using `id.id` instead of just `id`
    
    useEffect(() => {
        const fetchRecipient = async () => {
            try {
                const user = await findUser(recipientid);
                if (user) {
                    setRecipient(user);
                    console.log("Recipient is:", user.name); // Log directly after fetching
                }
            } catch (error) {
                console.error("Error fetching recipient:", error);
            }
        };
    
        fetchRecipient();
    }, [recipientid]);

    useEffect(() => {
        if (sender) {
            console.log("Sender updated:", sender.name);
        }
    }, [sender]);
    
    useEffect(() => {
        if (recipient) {
            console.log("Recipient updated:", recipient.name);
        }
    }, [recipient]);

    useEffect(() => {
        const fetchMessages = async () => {
            try {
                // Fetch messages sent by the user
                const sentMessages = await findMessageByConversation(sender._id, recipient._id);
                console.log(sentMessages)
                setMessagesSent(sentMessages || []);

                // Fetch messages received by the user
                const receivedMessages = await findMessageByConversation(recipient._id, sender._id);
                console.log(receivedMessages)
                setMessagesReceived(receivedMessages || []);
            } catch (error) {
                console.error("Error fetching messages:", error);
            }
        };

        fetchMessages();
    }, [sender, recipient]); // Dependencies: re-run if `id` or `recipientid` changes

    useEffect(() => {
        socket.on("newMessage", (newMessage) => {
            try {
                console.log(newMessage);
                if (newMessage.sender === sender._id) {
                    setMessagesSent((prev) => [...prev, newMessage]);
                }

                if (newMessage.sender === recipient._id) {
                    setMessagesReceived((prev) => [...prev, newMessage]);
                }

                if (messagesSent.length !== 0 && messagesReceived.length !== 0) {
                    console.log("both")
                    // Combine and sort messages
                    const combinedMessages = [...messagesSent, ...messagesReceived].sort(
                        (messageA, messageB) => new Date(messageA.date) - new Date(messageB.date)
                    );
                    setConversation(combinedMessages);
                } else if (messagesSent.length !== 0) {
                    console.log("sent")
                    setConversation(messagesSent);
                } else if (messagesReceived.length !== 0) {
                    console.log("received")
                    setConversation(messagesReceived);
                }
            } catch (error) {
                console.error("Error fetching messages:", error);
            }
        });

        return () => {
            socket.off("newMessage");
        };
    }, [sender, recipient]); // Runs when sender or recipient changes

    useEffect(() => {
        if (messagesSent.length !== 0 && messagesReceived.length !== 0) {
            console.log("both")
            // Combine and sort messages
            const combinedMessages = [...messagesSent, ...messagesReceived].sort(
                (messageA, messageB) => new Date(messageA.date) - new Date(messageB.date)
            );
            setConversation(combinedMessages);
        } else if (messagesSent.length !== 0) {
            console.log("sent")
            setConversation(messagesSent);
        } else if (messagesReceived.length !== 0) {
            console.log("received")
            setConversation(messagesReceived);
        }
    }, [messagesSent, messagesReceived]); // Re-run if `messagesSent` or `messagesReceived

    function autoResizeTextarea(event) {
        const textarea = event.target;
        textarea.style.height = 'auto'; // Reset height to auto to recalculate
        textarea.style.height = `${textarea.scrollHeight}px`; // Set height to scrollHeight
    }

    const updateMessage = (event) => {
        setText(event.target.value)
    }

    const submitHandler = async (e) => {
        e.preventDefault();
        const newMessage = await postMessage(text, new Date(), sender._id, recipient._id);
        if (newMessage) {
            console.log("The message is sent: ");
            console.log(newMessage);
        } else {
            console.log("That didn't work, sorry");
        }
    }

    
    return (
        <>
            {(conversation && conversation.length !== 0) ? 
            
            <div className="FullConversation"> 
                {
                  conversation.map((message, index) => (
                    (message.sender === sender._id) ? <div key={index} className="messageSent">
                        <div className="Bubble"> 
                            <p>{message.message}</p>
                        </div>
                        <div className="MSGProfilePicture">
                                <img src={`http://localhost:3001${sender.image}`} alt="profile picture" />
                        </div>
                    </div> : <div key={index} className="messageReceived">
                                <div className="MSGProfilePicture">
                                    <img src={`http://localhost:3001${recipient.image}`} alt="profile picture" />
                                </div>
                                <div className="Bubble"> 
                                    <p>{message.message}</p>
                                </div>
                            </div>
                  ))  
                }
            </div> :

            <p>no messages yet</p>

            }
            <div className="NewMessageContainer">
                <form className="NewMessage" onSubmit={(e) => (submitHandler(e))}>
                    <textarea type="text" onInput={autoResizeTextarea} onChange={(e) => (updateMessage(e))}/>
                    <input type="submit" value="Send"/>
                </form>
            </div>
        </>
    )
}


export default Conversation;
