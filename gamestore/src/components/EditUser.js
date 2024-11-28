import React, { useState, useEffect, useRef } from "react";
import ReactDOM from 'react-dom';
import "./EditUser.css"
import { useNavigate } from "react-router-dom";
import { findUser, deleteUser, patchUser, authenticate, deleteMessage, findMessageBySender, findMessageByRecipient, Logout } from "./middleware";

function EditUser({ userId, editUserVisibilityProp, setEditUserVisibilityProp }) {
    const [user, setUser] = useState(null);
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [changingPassword, setChangingPassword] = useState(false);
    const [deletingAccount, setDeletingAccount] = useState(false);
    const [messages, setMessages] = useState([])
    const navigate = useNavigate();
    

    useEffect(() => {
        const fetchUser = async () => {
            const fetchedUser = await findUser(userId);
            if (fetchedUser) {
                setUser(fetchedUser);
            }
        }; fetchUser();
    }, [])

    const alterPasswordVisibility = () => {
        if (changingPassword === true) {
            setChangingPassword(false);
        } else {
            setChangingPassword(true);
        }
    }

    const alterDeleteVisibility = () => {
        if (deletingAccount === true) {
            setDeletingAccount(false);
        } else {
            setDeletingAccount(true);
        }
    }


    const alterVisibility = () => {
        if (editUserVisibilityProp === true) {
            setEditUserVisibilityProp(false);
        } 
    }

    const deleteUserHandler = async () => {
        if (user) {
            const sentMessages = (await findMessageBySender(user._id) ? await findMessageBySender(user._id) : [] );
            console.log(sentMessages);
            const receivedMessages = (await findMessageByRecipient(user._id) ? await findMessageByRecipient(user._id) : [] );
            if (sentMessages && receivedMessages) {
                setMessages(sentMessages);
                setMessages((prev) => [...prev, ...receivedMessages]);
                console.log(messages)
                for (const message of messages) {
                    await deleteMessage(message._id);
                }
                await deleteUser(user._id);
                await Logout()
                navigate("/Login");
                window.location.reload();
            }
        }
    }

    const saveUserHandler = async () => {
        if (user) {
            if (changingPassword  === false) {
                const patchedUser = await patchUser(username, null, null, null, user._id);
                if (patchedUser) {
                    console.log("Looks like it was patched successfully!")
                    setEditUserVisibilityProp(false);
                    window.location.reload();
                }
            } else {
                const authUser = await authenticate(user.name, password)   
                if (authUser) {
                    console.log('User found:', authUser);
                    console.log(user._id);
                    const patchedUser = await patchUser(username, null, newPassword, null, user._id);
                    if (patchedUser) {
                        console.log("Looks like it was patched successfully!")
                        window.location.reload();
                    }
                } else {
                    console.log("Authentication failed!")
                }
            }
        }
    }

    return ReactDOM.createPortal(
        <>
        {  
         (editUserVisibilityProp === true) ? <>
            <div className="EditUserBackground" onClick={alterVisibility}></div>
                <div className="EditUser">
                    <form className="UserForm">
                        <label htmlFor="username" >Enter New Username: </label>
                        <input type="text" className="username" name="username" id="username" onChange={(e) => setUsername(e.target.value)}/>
                    </form>
                    <>
                        {(changingPassword === true) ? <div className="ChangePasswords">
                                <label htmlFor="OldPassword">Old Password: </label>
                                <input type="password" className="OldPassword" name="OldPassword" id="OldPassword" onChange={(e) => setPassword(e.target.value)}/>
                                <label htmlFor="NewPassword">New Password: </label>
                                <input type="password" className="NewPassword" name="NewPassword" id="NewPassword" onChange={(e) => setNewPassword(e.target.value)}/>
                            </div> : <></>
                        }
                    </>
                    <div className="EditUserBTNS">
                        <button onClick={saveUserHandler}>Save Changes</button>
                        <button onClick={alterDeleteVisibility}>delete</button>
                        <button onClick={alterPasswordVisibility}>Change Password</button>
                    </div>
                    <>
                        {(deletingAccount === true) ? <div className="DelAccBTNS">
                            <p>Are you sure?</p>
                            <button onClick={deleteUserHandler}>Yes</button> <button onClick={alterDeleteVisibility}>No</button></div> : <></>}
                    </>
                    
                </div> 
            </>
             : <></>
        }
        </>, document.getElementById('EditUser') 
    );
}


export default EditUser;
