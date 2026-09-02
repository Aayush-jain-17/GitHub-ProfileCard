const express = require("express");
const app = express();

require("dotenv").config();
const cors = require("cors");
const PORT = process.env.PORT || 5000;
const routes = require("./routes/routes");


app.use(cors());
app.use(express.json());

app.use("/api", routes);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});