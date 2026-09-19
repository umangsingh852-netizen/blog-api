require("dotenv").config();
const express = require("express");
const fs = require("fs");
const PORT = 5000;
const connectDB = require("./views/connectons");
const userRoutes = require("./routes/userRoutes");
const { prototype } = require("events");
const postRoutes = require("./routes/postRoutes");

const app = express();

app.use(express.json());
connectDB();

app.use("/api/users", userRoutes);
app.use("/api/posts", postRoutes);

app.get("/", (req, res) => {
    res.send("App Running")
})

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

