//Middleware for users
const findUser = async (userId) => {
    try {
        const response = await fetch(`/users/${userId}`, {
            method: 'GET'
        });

        if (!response.ok) {
            throw new Error('No user found');
        }

        const user = await response.json();
        return user;
        
    } catch (err) {
        console.error('Error:', err.message);
        return null;
    }
};

const findUserByName = async (username) => {
    try {
        const response = await fetch(`/users/name/${username}`, {
            method: 'GET'
        });

        if (!response.ok) {
            throw new Error('No user found');
        }

        const user = await response.json();
        return user;
        
    } catch (err) {
        console.error('Error:', err.message);
        return null;
    }
};

const findAllUsers = async () => {
    try {
        const response = await fetch(`/users/all/`, {
            method: 'GET'
        });

        if (!response.ok) {
            throw new Error('No users found');
        }

        const user = await response.json();
        return user;
        
    } catch (err) {
        console.error('Error:', err.message);
        return null;
    }
};

const postUser = async ( username, email, password, image ) => {
    try {
        const userData = {
            name: username,
            email: email,
            password: password,
            image: image
        };

        const response = await fetch('/users', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(userData) 
        });

        if (!response.ok) {
            throw new Error('Failed to create user');
        } else {
            const user = response.json();
            return user;
        }
    } catch (err) {
        console.error('Error:', err.message);
        return null;
    }
};

const patchUser = async ( username, email, password, image, gameId ) => {
    try {
        const userData = {
            name: username,
            email: email,
            password: password,
            image: image
        };

        console.log(userData);

        const response = await fetch(`/users/${gameId}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(userData) 
        });

        if (!response.ok) {
            throw new Error('Failed to patch user');
        } else {
            const user = response.json();
            return user;
        }
    } catch (err) {
        console.error('Error:', err.message);
        return null;
    }
};

const checkSession = async () => {
    const response = await fetch('/users/auth/checkSession', {
        method: 'GET',
        credentials: 'include', // Include session cookies in requests
    });

    if (response.ok) {
        const data = await response.json();
        console.log('Hey its me, Check Session!')
        console.log('User is logged in:', data);
        return data;
    } else {
        console.log('Hey its me, Check Session!')
        console.log('User is not logged in');
        return null;
    }
};


const authenticate = async (username, password) => {
    try {
        console.log("Username is: " + username);
        console.log("Password is: " + password);

        const response = await fetch(`/users/authenticate/${username}`, {
        method: 'POST',
        credentials: 'include', // Ensure cookies are sent with the request
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            "password" : password,
        })
    });
        
        
    if (response.ok) {
        const user = await response.json();
        console.log(user);
        return user;  
    }
    
    return null;

    } catch (err) {
        console.error('Error:', err.message);
        return null;
    }
};

const Logout = async () => {
    const response = await fetch('/users/logout', {
        method : 'POST',
        credentials: 'include', 
        headers: {
            'Content-Type': 'application/json',
        },
    })

    if (response.ok) {
        return response;
    } else {
        return null;
    }
};

const deleteUser = async (userId) => {
    try {
        const response = await fetch(`/users/${userId}`,{
            method: 'DELETE'
        });

        if (!response.ok)
            throw new Error('Failed to delete game');

        console.log("game deleted successful")
    } catch (err) {
        console.error('Error:', err.message)
    }
}

const uploadProfileImage = async (file) => {
    const formData = new FormData();
    formData.append("profilePic", file);

    try {
        const response = await fetch("/users/uploadProfilePic", {
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
        return null;
    }
};

const changeProfileImage = async ( id, image ) => {
    try {
        const userData = {
            image: image
        };

        const response = await fetch(`/users/${id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(userData) 
        });

        if (!response.ok) {
            throw new Error('Failed to change profile picture');
        }
    } catch (err) {
        console.error('Error:', err.message);
        return null;
    }
};

//Middleware for games
const findGame = async (gameId) => {
    try {
        const response = await fetch(`/game/${gameId}`, {
            method: 'GET'
        });

        if (!response.ok) {
            throw new Error('No game found');
        }

        const game = await response.json();
        return game;
        
    } catch (err) {
        console.error('Error:', err.message);
        return null;
    }
};

const findAllGames = async (gameId) => {
    try {
        const response = await fetch(`/game/all`, {
            method: 'GET'
        });

        if (!response.ok) {
            throw new Error('No games found');
        }

        const games = await response.json();
        return games;
        
    } catch (err) {
        console.error('Error:', err.message);
        return null;
    }
};

const findGamesByUser = async (userId) => {
    try {
        const response = await fetch(`/game/user/${userId}`, {
            method: 'GET'
        });

        if (!response.ok) {
            throw new Error('No game found');
        }

        const game = await response.json();
        return game;
        
    } catch (err) {
        console.error('Error:', err.message);
        return null;
    }
};

const postGame = async ( name, description, price, date, seller ) => {
    try {
        const userData = {
            name: name,
            description: description,
            price: price,
            date: date,
            seller: seller
        };

        const response = await fetch('/game', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(userData) 
        });

        if (!response.ok) {
            throw new Error('Failed to create game');
        } else {
            const game = await response.json()
            return game;
        }
    } catch (err) {
        console.error('Error:', err.message);
        return null;
    }
};

const patchGame = async ( name, description, price, date, seller, gameId) => {
    try {
        const userData = {
            name: name,
            description: description,
            price: price,
            date: date,
            seller: seller
        };

        const response = await fetch(`/game/${gameId}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(userData) 
        });

        if (!response.ok) {
            throw new Error('Failed to patch game');
        } else {
            const game = await response.json()
            return game;
        }
    } catch (err) {
        console.error('Error:', err.message);
        return null;
    }
};

const deleteGame = async (gameId) => {
    try {
        const response = await fetch(`/game/${gameId}`,{
            method: 'DELETE'
        });

        if (!response.ok)
            throw new Error('Failed to delete game');

        console.log("game deleted successful")
    } catch (err) {
        console.error('Error:', err.message)
    }
}

//Middleware for game images

const findGameImage = async (gameImageId) => {
    try {
        const response = await fetch(`/gameimage/${gameImageId}`, {
            method: 'GET'
        });

        if (!response.ok) {
            throw new Error('No game image found');
        }

        const gameimage = await response.json();
        return gameimage;
        
    } catch (err) {
        console.error('Error:', err.message);
        return null;
    }
};

const findGameImagesByGame = async (gameId) => {
    try {
        const response = await fetch(`/gameimage/game/${gameId}`, {
            method: 'GET'
        });

        if (!response.ok) {
            throw new Error('No game image found');
        }

        const gameimage = await response.json();
        return gameimage;
        
    } catch (err) {
        console.error('Error:', err.message);
        return null;
    }
};

const uploadGameImage = async (file) => {
    const formData = new FormData();
    formData.append("gameImage", file);

    try {
        const response = await fetch("/gameimage/uploadGameImages", {
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
        return null;
    }
};

const postGameImage = async ( image, game ) => {
    try {
        const userData = {
            image : image,
            game : game
        };

        const response = await fetch('/gameimage', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(userData) 
        });

        return response;
    } catch (err) {
        console.error('Error:', err.message);
        return null;
    }
};

const deleteGameImage = async (gameImage) => {
    try {
        const response = await fetch(`/gameimage/${gameImage}`,{
            method: 'DELETE'
        });

        if (!response.ok)
            throw new Error('Failed to delete game image');

        console.log("game deleted successful")
    } catch (err) {
        console.error('Error:', err.message)
    }
}


//Middleware for messages

const findMessage = async (messageId) => {
    try {
        const response = await fetch(`/message/${messageId}`, {
            method: 'GET'
        });

        if (!response.ok) {
            throw new Error('No message found');
        }

        const message = await response.json();
        return message;
        
    } catch (err) {
        console.error('Error:', err.message);
        return null;
    }
};

const findAllMessages = async (gameId) => {
    try {
        const response = await fetch(`/message/all`, {
            method: 'GET'
        });

        if (!response.ok) {
            throw new Error('No games found');
        }

        const messages = await response.json();
        return messages;
        
    } catch (err) {
        console.error('Error:', err.message);
        return null;
    }
};

const findMessageBySender = async (senderId) => {
    try {
        const response = await fetch(`/message/sender/${senderId}`, {
            method: 'GET'
        });

        if (!response.ok) {
            throw new Error('No messages found');
        }

        const messages = await response.json();
        console.log(messages)
        return messages;
        
    } catch (err) {
        console.error('Error:', err.message);
        return null;
    }
};

const findMessageByRecipient = async (recipientId) => {
    try {
        const response = await fetch(`/message/recipient/${recipientId}`, {
            method: 'GET'
        });

        if (!response.ok) {
            throw new Error('No messages found');
        }

        const messages = await response.json();
        return messages;
        
    } catch (err) {
        console.error('Error:', err.message);
        return null;
    }
};

const findMessageByConversation = async (senderId, recipientId) => {
    try {
        console.log(senderId)
        console.log(recipientId)
        const messagesBySender = await findMessageBySender(senderId)

        console.log(messagesBySender)
        
        if (!messagesBySender) {
            throw new Error('No messages found');
        }

        console.log("Here are the messages by sender")
        console.log(messagesBySender)
        const conversation = await messagesBySender.filter(message => message.recipient === recipientId) 
        console.log(conversation)
        return conversation;       
    } catch (err) {
        console.error('Error:', err.message);
        return null;
    }
};

const postMessage = async ( message, date, sender, recipient) => {
    try {
        const messageData = {
            message: message,
            date: date,
            sender: sender,
            recipient: recipient
        };

        const response = await fetch('/message', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(messageData) 
        });

        if (!response.ok) {
            throw new Error('Failed to create message');
        } else {
            const message = await response.json()
            return message;
        }
    } catch (err) {
        console.error('Error:', err.message);
        return null;
    }
};

const deleteMessage = async (messageId) => {
    try {
        const response = await fetch(`/message/${messageId}`,{
            method: 'DELETE'
        });

        if (!response.ok)
            throw new Error('Failed to delete message');

        console.log("message deleted successful")
    } catch (err) {
        console.error('Error:', err.message)
    }
}

module.exports = { findUser, findGame, findGameImage, postUser, 
    authenticate, Logout, uploadProfileImage, changeProfileImage, findGamesByUser, patchUser,
    findGameImagesByGame, uploadGameImage, postGame, deleteGame, postGameImage, deleteGameImage, checkSession,
    findAllGames, findMessage, findMessageBySender, findMessageByRecipient, 
    findMessageByConversation, findAllMessages, postMessage, findAllUsers,
    findUserByName, patchGame, deleteUser, deleteMessage};
