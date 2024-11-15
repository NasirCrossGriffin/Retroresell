import React, { useState, useEffect } from "react";
import "./Profile.css";

function Profile({ id }) {
    const [email, setEmail] = useState("");
    const [username, setUsername] = useState("");
    const [profilePic, setProfilePic] = useState("");


    const findUser = async (userId) => {
        try {
            const response = await fetch(`http://localhost:3001/users/${userId}`, {
                method: 'GET'
            });

            if (!response.ok) {
                throw new Error('No user found');
            }

            const user = await response.json();
            return user;
            
        } catch (err) {
            console.error('Error:', err.message);
        }
    };

    useEffect(() => {
        const fetchUser = async () => {
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
        const file = event.target.files[0];
        const formData = new FormData();
        formData.append("profilePic", file);

        try {
            const response = await fetch("http://localhost:3001/users/uploadProfilePic", {
                method: "POST",
                body: formData,
            });

            if (response.ok) {
                const result = await response.json();
                console.log("File uploaded successfully:", result.filePath);
                return result.filePath; // Return the file path directly
            } else {
                throw new Error("File upload failed");
            }
        } catch (error) {
            console.error("Error uploading file:", error.message);
        }
    };

    const assignImage = async (event) => {
        const imagePath = await setImage(event); // Wait for the image path
        console.log(imagePath);
        if (!imagePath) return; // Exit if the upload failed

        try {
            const response = await fetch(`http://localhost:3001/users/${id}`, {
                method: "PATCH",
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ image: imagePath }), // Use the image path directly
            });

            if (response.ok) {
                console.log("User image updated successfully");
            } else {
                throw new Error("Failed to update user image");
            }
        } catch (error) {
            console.error("Error updating user image:", error.message);
        }
    };

    return (
        <div className="Profile">
            <div className="ProfileCont">
                <div className="info"> 
                    <h1 className="info-item">{username}</h1>
                    <p className="info-item">{email}</p>
                    <p className="info-item">Change Profile Picture</p>
                    <input type="file" accept="image/*" className="setImage"  onChange={assignImage} />
                </div>

                <div className="picture">
                    <img src={`http://localhost:3001${profilePic}`} alt="profile picture" />
                </div>
                
            </div>
        </div>
    );
}

export default Profile;
