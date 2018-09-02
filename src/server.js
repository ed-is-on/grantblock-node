// Imports
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import * as envConfig from 'dotenv';


// Import APIs
import azure_api from './api/routes/routes.azure.api';

// Setting up the process.env to pull from the .env file
envConfig.config();

// Create Express App
const app = express();
const PORT = process.env.PORT || 3300;

app.use(cors());
app.use(bodyParser.json());

// Api Routes
app.use('/azure', azure_api);

// Default Route
app.get('/',(req,res)=>{
res.json({
 msg:'Welcome to the GrantBlock NodeJS Server'
})
});

// Start Server
app.listen(PORT, ()=> {console.log(`GrantBlock Node server listening on Port ${PORT}`)});
