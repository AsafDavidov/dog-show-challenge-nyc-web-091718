document.addEventListener('DOMContentLoaded', () => {
  const tableBody = document.getElementById('table-body');
  const editForm = document.getElementById('dog-form');
  const inpName =document.getElementById('name');
  const inpBreed =document.getElementById('breed');
  const inpSex =document.getElementById('sex');
  allDogs = []
  fetch("http://localhost:3000/dogs")
  .then((response)=>response.json())
  .then((json)=>{
    tableBody.innerHTML += renderDogs(json)
    allDogs = json;
  })
  tableBody.addEventListener('click', (event)=>populateEdit(event))
  editForm.addEventListener('submit', (event)=>{
    event.preventDefault();

    //first update array
    let dogToUpdate = allDogs.find((dog) => dog.id == editForm.dataset.id)
    dogToUpdate.name = inpName.value;
    dogToUpdate.breed = inpBreed.value;
    dogToUpdate.sex = inpSex.value;

    //then update DOM
    Array.from(document.getElementById('table-body').querySelectorAll("tr")).find((row)=>row.dataset.id == editForm.dataset.id).innerHTML = renderDogs([dogToUpdate])

    //then update Server

    fetch(`http://localhost:3000/dogs/${editForm.dataset.id}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json; charset=utf-8",
        },
        body: JSON.stringify(dogToUpdate)
      }
    )
    editForm.reset()
  })
  function renderDogs(dogArr){
    return dogArr.map((dog)=>{
      return `<tr data-id = "${dog.id}"><td>${dog.name}</td> <td>${dog.breed}</td> <td>${dog.sex}</td> <td><button>Edit</button></td></tr>`
    }).join('');
  }
  function populateEdit(event){
    if(event.target.localName === "button"){
  
      let clickedID = event.target.parentElement.parentElement.dataset.id;
      let clickedDog = allDogs.find((dog) => dog.id == clickedID)

      inpName.value = clickedDog.name;
      inpBreed.value = clickedDog.breed;
      inpSex.value = clickedDog.sex;
      editForm.dataset.id = clickedID
    }
  }
})
