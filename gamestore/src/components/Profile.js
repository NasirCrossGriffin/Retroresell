import React, { useState, useEffect } from "react";
import "./Profile.css";
import { useParams } from 'react-router-dom';
import { useNavigate } from "react-router-dom";
import EditUser from "./EditUser"
import CropImage from "./CropImage"
import { findUser, findGame, findGameImage, postUser, authenticate, uploadProfileImage, changeProfileImage } from "./middleware";

function Profile({ id }) {
    const [email, setEmail] = useState("");
    const [username, setUsername] = useState("");
    const [profilePic, setProfilePic] = useState("");
    const [file, setFile] = useState("");
    const [viewer, setViewer] = useState("")
    const [profile, setProfile] = useState("")
    const [editUserVisibility, setEditUserVisibility] = useState(false)
    const [visibility, setVisibility] = useState(false)
    const [croppedImage, setCroppedImage] = useState(false);
    const { profileid } = useParams();
    const BASE_URL = (process.env.NODE_ENV === "development" ? process.env.REACT_APP_REQ_URL : "")

    
    const navigate = useNavigate();


    console.log(id)
    console.log(profileid)

    useEffect(() => {
        const fetchUser = async () => {
            console.log(id);
            const user = await findUser(profileid);
            if (user) {
                setProfile(user)
                setEmail(user.email);
                setUsername(user.name);
                setProfilePic(user.image);
            }
        };

        fetchUser();
    }, [profileid]);

    useEffect(() => {
        const fetchViewer = async () => {
            console.log(id);
            const user = await findUser(id);
            if (user) {
                setViewer(user)
            }
        };

        fetchViewer();
    }, [id]);

    const setImage = async (event) => {
        setFile(event.target.files[0]);
        setVisibility(true);
    };

    const changeProfilePic = async () => {
        if (file && !croppedImage) {
            const newImage = await uploadProfileImage(file);
            await changeProfileImage(id, newImage);
            const user = await findUser(id);
            setProfilePic(user.image)
            window.location.reload();
        }

        if (croppedImage) {

        }
    }

    const navigateToConversation = ( profileid ) => {
        navigate(`/Conversation/${profileid}`, { replace: true });
    }

    const editUserHandler = () => {
        setEditUserVisibility(true);
    }

    return (
        viewer._id === profile._id ? (
            <>
                <EditUser 
                    userId={id} 
                    editUserVisibilityProp={editUserVisibility} 
                    setEditUserVisibilityProp={setEditUserVisibility} 
                />
                <div className="Profile">
                    <div className="ProfileCont">
                        <div className="info"> 
                            <h1 className="info-item">{username}</h1>
                            <p className="info-item">{email}</p>
                            <button className="EditUserBTN" onClick={editUserHandler}>Edit User</button>
                            <p className="info-item">Change Profile Picture</p>
                            <input type="file" accept="image/*" className="setImage" onInput={setImage} />
                            <button className="ChngPrflBTN" onClick={changeProfilePic}>Submit Profile Picture</button>
                        </div>
                        <div className="profilePictureContainer">
                            <div className="Profilepicture">
                                <img src={`${BASE_URL}${profilePic}`} alt="profile picture" />
                            </div>
                            {file ? <>
                                    <CropImage file={file} visibility={visibility} setVisibility={setVisibility} setFile={setFile}/>
                                    <div className="previewContainer">
                                        <img className="profilePicturePreview" src={URL.createObjectURL(file)} />
                                    </div>
                                    </> : <></>}
                        </div>
                    </div>
                </div> 
            </>
        ) : (
            <div className="Profile">
                <div className="ProfileCont">
                    <div className="info"> 
                        <h1 className="info-item">{username}</h1>
                        <p className="info-item">{email}</p>
                        <button className="SendMessageBTN" onClick={() => navigateToConversation(profileid)}>Send Message</button>
                    </div>
                    <div className="Profilepicture">
                        <img src={`${BASE_URL}${profilePic}`} alt="profile picture" />
                    </div>
                </div>
            </div>
        )
    );
}
    

export default Profile;
