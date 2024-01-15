const savebutton = document.querySelector('#btnsave');
const titleInput = document.querySelector('#title');
const descriptionInput = document.querySelector('#description');
const notes__container = document.querySelector('#note__container');
const Deletebutton = document.querySelector('#btndel');

function ClearForm(){
    titleInput.value = '';
    descriptionInput.value = '';  
}

function displayNoteInForm(note){
    titleInput.value = note.title;  
    descriptionInput.value = note.description ;
    Deletebutton.classList.remove('hidden');
    Deletebutton.setAttribute('data-id',note.id);
    savebutton.setAttribute('data-id',note.id);
}

function getnotebyId(id){

     fetch(`https://localhost:7133/api/Notes/${id}`)
    .then(data => data.json())
    .then(response => displayNoteInForm(response));

}

function PopulateForm(id)
{
    getnotebyId(id);
    
}

function CreateNote  (title,description){

    const body = {
        title : title,
        description : description,
        isvisble : true
    
    };

    fetch('https://localhost:7133/api/Notes', {

    method :'POST',
    body   : JSON.stringify(body),
    headers: {
        
        "content-type" : "application/json"
    }

  })

  .then(data => data.json())
  .then(response => {

  ClearForm();
  getAllNotes();
  PopulateForm();
  });
  



}
function displayNotes(Notes){

    let AllNotes = '';

    Notes.forEach(note => {

        const noteElement = `
                            <div class = "note" data-id = "${note.id}">
                             <h3> ${note.title}</h3>
                             <p>${note.description}</p>
                            </div>
                            `;

        AllNotes += noteElement;

        
    });
    notes__container.innerHTML = AllNotes;


    //Add Events
    document.querySelectorAll('.note').forEach(note => {
         note.addEventListener('click', function() {
            PopulateForm(note.dataset.id);


         });
    });
}   
function getAllNotes(){
    fetch('https://localhost:7133/api/Notes')
    .then(data => data.json())
    .then(response => displayNotes(response));  
}
getAllNotes();

function updatenote(id,title,description){

    const body = {
        title : title,
        description : description,
        isvisble : true
    
    };

    fetch(`https://localhost:7133/api/Notes/${id}`, {
    method :'PUT',
        body   : JSON.stringify(body),
        headers: {
        
        "content-type" : "application/json"
    }

  })

}

savebutton.addEventListener('click', function() {
    
    const id = savebutton.dataset.id;

    if(id){

        updatenote (id, titleInput.value, descriptionInput.value);
    }
    else{
        CreateNote(titleInput.value,descriptionInput.value);
    }

})

function DeleteNote(id){

  fetch(`https://localhost:7133/api/Notes/${id}`, {

    method : 'Delete' ,
    headers : {
    "content-type" : "application/json"
    }
})
 .then(response => {
    console.log(response);
 

});

}

Deletebutton.addEventListener('click',function(){
  const id = Deletebutton.dataset.id;
    DeleteNote(id);

});