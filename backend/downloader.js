const { exec } = require("child_process")

async function downloadMedia(url){

return new Promise((resolve,reject)=>{

exec(`yt-dlp -j ${url}`,(err,stdout)=>{

if(err) reject(err)

const data = JSON.parse(stdout)

resolve([
{
thumbnail:data.thumbnail,
url:data.url
}
])

})

})

}

module.exports = downloadMedia
