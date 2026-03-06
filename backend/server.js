const express = require("express")
const cors = require("cors")

const downloadMedia = require("./downloader")

const app = express()

app.use(cors())
app.use(express.json())

app.post("/api/download", async(req,res)=>{

const {url} = req.body

try{

const media = await downloadMedia(url)

res.json(media)

}catch(e){

res.status(500).json({error:"download failed"})

}

})

app.listen(3000,()=>{

console.log("Server running")

})
