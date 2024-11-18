import React, { useState, useEffect } from "react";
import "./Profile.css";
import { findUser, findGame, findGameImage, postUser, authenticate, uploadProfileImage, changeProfileImage } from "./middleware";

function Profile({ id }) {
    const [email, setEmail] = useState("");
    const [username, setUsername] = useState("");
    const [profilePic, setProfilePic] = useState("");
    const [file, setFile] = useState("");

    console.log(id)

    useEffect(() => {
        const fetchUser = async () => {
            console.log(id);
            const user = await findUser(id);
            if (user) {
                setEmail(user.email);
                setUsername(user.name);
                setProfilePic(user.image);
            }
        };

        fetchUser();
    }, [id]);

    const setImage = async (event) => {
        setFile(event.target.files[0]);
    };

    const changeProfilePic = async () => {
        const newImage = await uploadProfileImage(file);
        await changeProfileImage(id, newImage);
        
    }

    return (
        <div className="Profile">
            <div className="ProfileCont">
                <div className="info"> 
                    <h1 className="info-item">{username}</h1>
                    <p className="info-item">{email}</p>
                    <p className="info-item">Change Profile Picture</p>
                    <input type="file" accept="image/*" className="setImage"  onChange={setImage} />
                    <button onClick={changeProfilePic}>Submit Profile Picture</button>
                </div>

                <div className="picture">
                    <img src={`http://localhost:3001${profilePic}`} alt="profile picture" />
                </div>
                
            </div>
        </div>
    );
}

export default Profile;
