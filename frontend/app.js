function toggleDarkMode(){

document.documentElement.classList.toggle("dark")

}


async function fetchMedia(){

const url = document.getElementById("input-url").value

if(!url){

alert("Insert Instagram URL")

return

}

const res = await fetch("http://localhost:3000/api/download",{

method:"POST",

headers:{
"Content-Type":"application/json"
},

body:JSON.stringify({url})

})

const data = await res.json()

renderMedia(data)

}


function renderMedia(media){

const container = document.getElementById("results")

container.innerHTML=""

media.forEach(item=>{

const card=document.createElement("div")

card.innerHTML=`

<div class="p-4 border rounded-lg">

<img src="${item.thumbnail}" />

<a href="${item.url}" download class="block mt-2 text-blue-600">
Download
</a>

</div>

`

container.appendChild(card)

})

}
