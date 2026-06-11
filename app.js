// -------------------------------------------------
//  Your code starts here – keep it clean & modular
// -------------------------------------------------

const savedTodos = localStorage.getItem("todos");
const todos = savedTodos ? JSON.parse(savedTodos) : []; // load from localStorage

const listEl = document.getElementById("todo-list");
const inputEl = document.getElementById("new-todo");
const templateEl = document.getElementById("todo-template"); //template for todo

let draggedId = null;
let currentHash = "all"; // all, active, completed

// TODO: implement add, drag, filter, persistence, etc.

// Utility function to generate unique IDs
function makeId(){
    return Date.now().toString();
}

// Feature: Add todos & subtasks
function addTodo(text, parentId = null){
    todos.push({ id: makeId(), text, parentId, subtasks: [] });
    render();
}

// Helper function for all DOM creation
function createTodoElement(todo, isSubtask = false){
    const todoEl = templateEl.content.cloneNode(true);
    const li = todoEl.querySelector(".todo");
    li.dataset.id = todo.id;
    if(isSubtask){
        li.classList.add("subtask");
    }
    todoEl.querySelector(".text").textContent = todo.text;

    if(todo.completed){
        li.classList.add("completed");
        li.querySelector(".toggle-btn").checked = true;
    }
    return todoEl;
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

//Feature: Filtering using hash
function handleHashChange(){
    currentHash = window.location.hash.replace("#", "") || "all";
    document.querySelectorAll(".filters button").forEach(btn => {
        if(btn.dataset.filter === currentHash){
            btn.classList.add("active");
        } else {
            btn.classList.remove("active");
        }
    });
    render();
}


// Rendering function - modified clean rendering with filtering logic
function render(){
    localStorage.setItem("todos", JSON.stringify(todos)); // save to localStorage

    listEl.innerHTML = "";
    todos.forEach(todo => {
        const showTodo = (currentHash === "all") || 
        (currentHash === "active" && !todo.completed) || 
        (currentHash === "completed" && todo.completed);

        if(showTodo){
            listEl.appendChild(createTodoElement(todo, false));
        }
        
        // Render subtasks
        todo.subtasks.forEach(subtask => {
            const showSubtask = (currentHash === "all") || 
            (currentHash === "active" && !subtask.completed) || 
            (currentHash === "completed" && subtask.completed);

            if(showSubtask){
                listEl.appendChild(createTodoElement(subtask, true));
            }
        });
    });
}

// Event listeners for adding new todo and deleting todos
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

// Event listener for filtering
window.addEventListener("hashchange", handleHashChange); // For Hash change
window.addEventListener("DOMContentLoaded", handleHashChange); // For initial load

document.querySelector(".filters").addEventListener("click", e => {
    const btn = e.target.closest("BUTTON");
    if(btn){
        const filterValue = btn.dataset.filter;
        window.location.hash = filterValue; // This will trigger handleHashChange
    }
});

// Handling Mobile Responsiveness
listEl.addEventListener("touchstart", e => {
    const itemEl = e.target.closest(".todo");
    if(itemEl){
        draggedId = itemEl.dataset.id;
        itemEl.classList.add("dragging");
    }
},{ passive: true });

listEl.addEventListener("touchmove", e => {
    if(!draggedId) return;
    e.preventDefault();
},{ passive: false });

listEl.addEventListener("touchend", e => {
    if(!draggedId) return;
    const touch = e.changedTouches[0];
    const targetEl = document.elementFromPoint(touch.clientX, touch.clientY)?.closest(".todo");
    const dropId = targetEl ? targetEl.dataset.id : null;
    moveTodo(draggedId, dropId);
    const itemEls = document.querySelectorAll(".todo.dragging");
    itemEls.forEach(el => el.classList.remove("dragging"));
    draggedId = null;
});


render(); // initial render
