const https = require("https"); // Import the 'https' module
const fs = require("fs");
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const fileUpload = require("express-fileupload");
const path = require("path");
const connectDb = require("./config/database");
const errorHandler = require("./middlewares/errorHandler");
const authRoutes = require("./routes/authRoutes");
const productRoutes = require("./routes/productRoutes");
const uploadRoutes = require("./routes/uploadRoutes");
const userRoutes = require("./routes/userRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const orderRoutes = require("./routes/orderRoutes");
const messageRoutes = require("./routes/messageRoutes");

const libxmljs = require("libxmljs"); // Add libxmljs
//const corsOptions = require("./config/corsValidation");
const corsLog = require("./models/corsLogModel");

const app = express();


//Add CORs option to prevent CSRF attacks
const allowedOrigins = ["http://localhost:5000", "http://localhost:4000"]; // Replace with your specific origins

const corsOptions = {
  origin: function (origin, callback) {
    if (allowedOrigins.includes(origin) || !origin) {
      callback(null, true);
    } else {
      //const userAgent = headers["user-agent"];
      const log = new corsLog(
        {
          origin: origin
        });

        log.save();
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true,
};
/* const corsOptions = {

  origin: 'http://localhost:3000',
  methods: 'GET',
  optionsSuccessStatus: 204, // some legacy browsers (IE11, various SmartTVs) choke on 204
}; */

// Load environment variables from a .env file if available
require("dotenv").config();


// middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors(corsOptions));
//app.use(cors());
app.use(cookieParser());
app.use(
  fileUpload({
    useTempFiles: true,
  })
);

// Set up XML parsing with libxmljs
app.use((req, res, next) => {
  if (req.is('text/xml')) {
    try {
      const xmlDocument = libxmljs.parseXml(req.body.toString(), { noent: true, noblanks: true });
      req.xmlDocument = xmlDocument;
    } catch (err) {
      return res.status(400).json({ error: 'Invalid XML format' });
    }
  }
  next();
});

app.use("/api", categoryRoutes);
app.use("/api", authRoutes);
app.use("/api", userRoutes);
app.use("/api", uploadRoutes);
app.use("/api", productRoutes);
app.use("/api", paymentRoutes);
app.use("/api", orderRoutes);
app.use("/api", messageRoutes);

connectDb();

const options = {
  key: fs.readFileSync("../ssl_certificate/localhost.key"),
  cert: fs.readFileSync("../ssl_certificate/localhost.crt"),
};

if (process.env.NODE_ENV === "production") {
  app.use(express.static("client/build"));
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
  });
}

const PORT = process.env.PORT || 443;

app.use(errorHandler);

const server = https.createServer(options, app);

server.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
