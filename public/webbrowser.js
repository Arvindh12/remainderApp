function itemtemplate(item){
    return `<li class="list-group-item list-group-item-action d-flex align-items-center justify-content-between">
    <span class="item-text">${item.text}</span>
    <div>
      <button data-id="${item._id}" class="edit-me btn btn-secondary btn-sm mr-1">Edit</button>
      <button data-id="${item._id}" class="delete-me btn btn-danger btn-sm">Delete</button>
    </div>
  </li>`
}
let ourhtml= items.map(function(item){
        return itemtemplate(item)
}).join("")

document.getElementById("item-list").insertAdjacentHTML("beforeEnd",ourhtml)


let createfield = document.getElementById("create-field")
document.getElementById('create-form').addEventListener("submit",function(e){
    e.preventDefault()
    axios.post('/create',{text: createfield.value }).then(function(response){
        
        document.getElementById("item-list").insertAdjacentHTML("beforeEnd",itemtemplate(response.data))
        createfield.value=""
        createfield.focus()
        console.log(response.data)
        }).catch(function(e){
            console.log(e)
        })
})

document.addEventListener("click", function(e){
    if(e.target.classList.contains("delete-me")){
        if (confirm("Do u really want to delete?")){
        axios.post('/delete',{id: e.target.getAttribute("data-id")}).then(function(){
            e.target.parentElement.parentElement.remove()
            }).catch(function(){
                console.log("Errorr")
            })
        }
        }
    if(e.target.classList.contains("edit-me")){
    let userinput = prompt("Enter the value",e.target.parentElement.parentElement.querySelector(".item-text").innerHTML)
    if (userinput){
    axios.post('/update',{text : userinput, id: e.target.getAttribute("data-id")}).then(function(){
    e.target.parentElement.parentElement.querySelector(".item-text").innerHTML = userinput
    }).catch(function(){
        console.log("Errorr")
    })
    }
}
})

