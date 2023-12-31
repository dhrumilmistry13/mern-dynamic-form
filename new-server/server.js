const express = require("express");
const cors = require("cors");
const app = express();
// set port, listen for requests
const PORT = process.env.PORT || 8080;


var corsOptions = {
  origin: "*"
};


app.use(cors(corsOptions));

// parse requests of content-type - application/json
app.use(express.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

require("./app/routes/question.routes")(app);
require("./app/routes/form.routes")(app);


// simple route
app.get("/test", (req, res) => {
    res.json({ message: "Welcome to bezkoder application." });
  });

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});

const db1 = require("./app/models");
db1.mongoose
  .connect(db1.url, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => {
    console.log("Connected to the database!");
  })
  .catch(err => {
    console.log("Cannot connect to the database!", err);
    process.exit();
  });