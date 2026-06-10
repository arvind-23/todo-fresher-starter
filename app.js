// -------------------------------------------------
//  Your code starts here – keep it clean & modular
// -------------------------------------------------

const todos = []; // load from localStorage later
const listEl = document.getElementById("todo-list");
const inputEl = document.getElementById("new-todo");
const templateEl = document.getElementById("todo-template"); //template for todo

// TODO: implement add, drag, filter, persistence, etc.

// Example: add a new todo
function makeId(){
    return Date.now().toString();
}

function addTodo(text, parentId = null){
    todos.push({ id: makeId(), text, parentId, subtasks: [] });
    render();
}

function addSubtask(parentId, text){
    const parent = todos.find(t => t.id === parentId);
    if(parent){
        parent.subtasks.push({ id: makeId(), text, parentId, subtasks: [] });
        render();
    }
}

inputEl.addEventListener("keypress", e => {
    if(e.key === "Enter" && inputEl.value.trim()){
        addTodo(inputEl.value.trim());
        inputEl.value = "";
    }
});

listEl.addEventListener("click", e => {
    if(e.target.classList.contains("subtask-btn")){
        const parentId = e.target.closest(".todo").dataset.id;
        const subtaskText = prompt("Subtask text:");
        if(subtaskText){
            addSubtask(parentId, subtaskText.trim());
        }
    }
});

function render(){
    listEl.innerHTML = "";
    todos.forEach(todo => {
        const todoEl = templateEl.content.cloneNode(true);
        const li = todoEl.querySelector(".todo");
        li.dataset.id = todo.id;
        todoEl.querySelector(".text").textContent = todo.text;
        listEl.appendChild(todoEl);
        
        // Render subtasks
        todo.subtasks.forEach(subtask => {
            const subNode = templateEl.content.cloneNode(true);
            const subLi = subNode.querySelector(".todo");
            
            subLi.dataset.id = subtask.id;
            subLi.classList.add("subtask"); // CSS handles the indentation!
            subLi.querySelector(".text").textContent = subtask.text;
            
            listEl.appendChild(subNode);
        });
    });
}

render(); // initial render
