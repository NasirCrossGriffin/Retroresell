//Middleware for users
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

        const response = await fetch('http://localhost:3001/users', {
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

const checkSession = async () => {
    const response = await fetch('http://localhost:3001/users/auth/checkSession', {
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

        const response = await fetch(`http://localhost:3001/users/authenticate/${username}`, {
        method: 'POST',
        credentials: 'include', // Ensure cookies are sent with the request
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            "password" : password,
        })
    });
        
        const user = await response.json()
        console.log(user)

        return user;
    } catch (err) {
        console.error('Error:', err.message);
        return null;
    }
};

const Logout = async () => {
    const response = await fetch('http://localhost:3001/users/logout', {
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

const uploadProfileImage = async (file) => {
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
        return null;
    }
};

const changeProfileImage = async ( id, image ) => {
    try {
        const userData = {
            image: image
        };

        const response = await fetch(`http://localhost:3001/users/${id}`, {
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
        const response = await fetch(`http://localhost:3001/game/${gameId}`, {
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
        const response = await fetch(`http://localhost:3001/game/all`, {
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
        const response = await fetch(`http://localhost:3001/game/user/${userId}`, {
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

        const response = await fetch('http://localhost:3001/game', {
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

//Middleware for game images

const findGameImage = async (gameImageId) => {
    try {
        const response = await fetch(`http://localhost:3001/gameimage/${gameImageId}`, {
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
        const response = await fetch(`http://localhost:3001/gameimage/game/${gameId}`, {
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
        const response = await fetch("http://localhost:3001/gameimage/uploadGameImages", {
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

        const response = await fetch('http://localhost:3001/gameimage', {
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



module.exports = { findUser, findGame, findGameImage, postUser, 
    authenticate, uploadProfileImage, changeProfileImage, findGamesByUser,
    findGameImagesByGame, uploadGameImage, postGame, postGameImage, checkSession,
    findAllGames, Logout };
