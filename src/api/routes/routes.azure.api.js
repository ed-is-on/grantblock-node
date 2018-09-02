import express from 'express';
import HttpCodes from 'http-status-codes';
import storage from 'azure-storage';
import * as envConfig from 'dotenv';
import stream from 'stream';

// Setting evironment variables
envConfig.config();

// Initializing the Router
const azure_api = express.Router();

// Initializing Azure Blob Service
const blobService = storage.createBlobService();
const containerName = process.env.CONTAINER_NAME || 'receipts';

// Defining the Routes
azure_api.get('/receipts',(req,res,next)=>{

 //console.log('Getting files');
 new Promise((resolve,reject)=>{
    blobService.listBlobsSegmented(containerName,null,(error,data)=>{
      if(error){
       return res.status(HttpCodes.BAD_REQUEST).json({error:error})
      }else{
     	  return res.status(HttpCodes.OK).json({message:'success', data:data})
      }
    })
 })
 //return res.status(HttpCodes.OK).json({message:'I got all the receipts'});
});

azure_api.get('/receipts/:id',(req,res,next)=>{
 if(req.params.id){
   new Promise(()=>{
     blobService.getBlobProperties(containerName,req.params.id,(error,data)=>{
       if(error){
        return res.status(HttpCodes.BAD_REQUEST).json({error:error})
       }else{
        return res.status(HttpCodes.OK).json({message:'success', data:data})
       }
     })
   })
 }
});

azure_api.post('/receipts',(req,res,next)=>{
 //console.log('Request File: => ',req.body);
 var dataUrlMatch = req.body.fileAsDataUrl.match(/^data:([A-Za-z-+\/]+);base64,(.+)$/);
 var azurePayload = {};
 if(dataUrlMatch.length !== 3){
  return res.status(HttpCodes.BAD_REQUEST).json({message:'File in incorrect format. Must be base64 image url',error:{dataUrlMatch:dataUrlMatch,request:req.body}});
 }

 azurePayload.type = dataUrlMatch[1];
 azurePayload.data = Buffer.from(dataUrlMatch[2],'base64');
 azurePayload.fileName = req.body.fileName;

 var fileStream = new stream.Readable();
 fileStream.push(azurePayload.data);
 fileStream.push(null);

 //console.log('Azure Payload => ', azurePayload);
 //console.log('File Stream => ',fileStream);

 var blobUploadOptions = {
       contentSettings:{
         contentType: azurePayload.type
       }
     }
 
 new Promise(()=>{
   blobService.createBlockBlobFromStream(containerName,azurePayload.fileName,fileStream,azurePayload.data.length,blobUploadOptions,(error,data)=>{
     if(error){
       return res.status(HttpCodes.BAD_REQUEST).json({message:'Receipt not uploaded', error:error});
     }else{
       return res.status(HttpCodes.OK).json({message:'Success, Receipt Uploaded',data:data});
     }
   })
 })
 
 //return res.status(HttpCodes.OK).json({message:'I uploaded a receipt'});
});

export default azure_api;
