// -------------------------------------------------
//  Your code starts here – keep it clean & modular
// -------------------------------------------------

const todos = []; // load from localStorage later
const listEl = document.getElementById("todo-list");
const inputEl = document.getElementById("new-todo");
const templateEl = document.getElementById("todo-template"); //template for todo

// TODO: implement add, drag, filter, persistence, etc.

// Feature: Add todos & subtasks
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

// Feature: Delete & Toggle
function deleteTodo(id){
    console.log("deleteTodo with ID:", id);
    const mainIndex = todos.findIndex(t => t.id === id);
    if(mainIndex !== -1){
        console.log("Deleting main task at index:", mainIndex);
        todos.splice(mainIndex, 1);
    } else {
        todos.forEach(t => {
            const subIndex = t.subtasks.findIndex(s => s.id === id);
            if(subIndex !== -1){
                console.log("Deleting Subtask at id:", subIndex);
                t.subtasks.splice(subIndex, 1);
            }
        });
    }
    render();
}

function toggleTodo(id){
    const main = todos.find(t => t.id === id);
    if(main){
        main.completed = !main.completed;
    } else {
        todos.forEach(t => {
            const sub = t.subtasks.find(s => s.id === id);
            if(sub){
                sub.completed = !sub.completed;
            }
        });
    }
    render();
}

//Feature: Drag & Drop
let draggedId = null;

function moveTodo(dragId, dropId){
    if(dragId === dropId) return; // no self-drop

    let draggedItem = null;
    let isMainTask = null;

    // Find dragged item and remove from current position
    const mainIndex = todos.findIndex(t => t.id === dragId);
    if(mainIndex !== -1){
        draggedItem = todos.splice(mainIndex, 1)[0];
        isMainTask = true;
    } else {
        todos.forEach(t => {
            const subIndex = t.subtasks.findIndex(s => s.id === dragId);
            if(subIndex !== -1){
                draggedItem = t.subtasks.splice(subIndex, 1)[0];
            }
        });
    }

    if(!draggedItem) return; // not found
    
    // Handle dropping outside of any todo item
    if(!dropId){
        if (!isMainTask) {
            draggedItem.subtasks = []; 
        }
        todos.push(draggedItem);
        render();
        return;
    }

    const dropMainIndex = todos.findIndex(t => t.id === dropId);
    if(dropMainIndex !== -1){
        // Dropping on a main task
        if(isMainTask){
            todos.splice(dropMainIndex, 0, draggedItem);
        } else {
            todos[dropMainIndex].subtasks.push(draggedItem);
        }
    } else {
        // Dropping on a subtask
        todos.forEach(t => {
            const subIndex = t.subtasks.findIndex(s => s.id === dropId);
            if(subIndex !== -1){
                if(isMainTask){
                    todos.splice(todos.findIndex(x => x.id === t.id), 0, draggedItem);
                } else {
                    t.subtasks.splice(subIndex, 0, draggedItem);
                }
            }
        });
    }
    render();
}

// Rendering function
function render(){
    listEl.innerHTML = "";
    todos.forEach(todo => {
        const todoEl = templateEl.content.cloneNode(true);
        const li = todoEl.querySelector(".todo");
        li.dataset.id = todo.id;
        todoEl.querySelector(".text").textContent = todo.text;

        if(todo.completed){
            li.classList.add("completed");
            li.querySelector(".toggle-btn").checked = true;
        }
        listEl.appendChild(todoEl);
        
        // Render subtasks
        todo.subtasks.forEach(subtask => {
            const subNode = templateEl.content.cloneNode(true);
            const subLi = subNode.querySelector(".todo");
            
            subLi.dataset.id = subtask.id;
            subLi.classList.add("subtask"); // CSS handles the indentation!
            subLi.querySelector(".text").textContent = subtask.text;
            
            if(subtask.completed){
                subLi.classList.add("completed");
                subLi.querySelector(".toggle-btn").checked = true;
            }
            listEl.appendChild(subNode);
        });
    });
}

// Event listener for adding new todo
inputEl.addEventListener("keypress", e => {
    if(e.key === "Enter" && inputEl.value.trim()){
        addTodo(inputEl.value.trim());
        inputEl.value = "";
    }
});

listEl.addEventListener("click", e => {
    const addBtn = e.target.closest(".subtask-btn");
    const deleteBtn = e.target.closest(".delete-btn");

    if (addBtn) {
        const parentId = addBtn.closest(".todo").dataset.id;
        const text = prompt("Enter subtask name:");
        if (text && text.trim() !== "") {
            addSubtask(parentId, text.trim());
        }
    }
    
    if (deleteBtn) {
        const id = deleteBtn.closest(".todo").dataset.id;
        console.log("Delete button clicked for ID:", id);
        deleteTodo(id);
    }
});

// Eventhandlers for toggling
listEl.addEventListener("change", e => {
    if(e.target.classList.contains("toggle-btn")){
        const id = e.target.closest(".todo").dataset.id;
        toggleTodo(id);
    }
});

//Event listeners for drag & drop
listEl.addEventListener("dragstart", e => {
    const itemEl = e.target.closest(".todo");
    if(itemEl){
        draggedId = itemEl.dataset.id;
        itemEl.classList.add("dragging");
    }
});

listEl.addEventListener("dragover", e => {
    e.preventDefault();
});

listEl.addEventListener("drop", e => {
    e.preventDefault();
    const targetEl = e.target.closest(".todo");
    const dropId = targetEl ? targetEl.dataset.id : null;
    if(draggedId){
        moveTodo(draggedId, dropId);
    }
});

listEl.addEventListener("dragend", (e) => {
    const itemEls = e.target.closest(".todo");
    if(itemEls){
        itemEls.classList.remove("dragging");
    }
    draggedId = null;
});

render(); // initial render
