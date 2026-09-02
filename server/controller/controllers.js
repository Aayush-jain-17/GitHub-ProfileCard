require('dotenv').config();

// search button
exports.searchUser = async (req, res) => {
    try {
        const userName = req.body.username;
        if(!userName) return res.status(400).json({ message: "Username is required" });

        const response = await fetch(process.env.GIT_API + `/${userName}`);
        if(response.status === 404) return res.status(404).json({ message: "User not found" });
        const data = await response.json();

        res.status(200).json(data);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: error.message });
    }
}