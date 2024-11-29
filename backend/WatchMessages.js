const { MongoClient } = require("mongodb")
if (process.env.NODE_ENV !== "production") {
    require("dotenv").config();
    console.log("Loaded .env file for development");
} else {
    console.log("Running in production mode");
}


const watchMessages = async (io) => {
    const mongoUrl = process.env.MONGO_URL;
    
    const mongoClient = new MongoClient(mongoUrl);

    const startWatching = async () => {
        try {
            await mongoClient.connect();

            const gamestore = mongoClient.db("GameStore");

            const messages = gamestore.collection("messages");

            const watchMessages = messages.watch();
            console.log("Listening for changes in messages...");

            watchMessages.on("change", (change) => {
                console.log("Change detected:", change);

                if (change.operationType === "insert") {
                    const newMessage = change.fullDocument;
                    console.log("New Message:", newMessage);

                    // Broadcast the new message to all connected clients via WebSocket
                    io.emit("newMessage", newMessage);
                }
            });

            watchMessages.on("error", (error) => {
                console.error("Change Stream error:", error);
                setTimeout(startWatching, 5000); // Retry after 5 seconds
            });

            process.on("SIGINT", async () => {
                await mongoClient.close();
                process.exit();
            });
        } catch (error) {
            console.error("Error in Change Stream:", error)
        }
    }

    startWatching();
}

module.exports = watchMessages;
