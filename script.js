// ===== Step 1: Find the parts of the page we need =====
// "document" means our web page.
// "getElementById" finds an element using the "id" we gave it in index.html.

// Find the text box where you type a task.
const taskInput = document.getElementById("task-input");

// Find the "Add" button.
const addButton = document.getElementById("add-button");

// Find the empty list where tasks will go.
const taskList = document.getElementById("task-list");


// ===== Step 2: Save all tasks into localStorage =====
// "localStorage" is a small storage box inside your browser.
// Whatever we put in it stays there, even after you refresh or close the page.
function saveTasks() {
    // Start with an empty list (an "array") that will hold every task.
    const tasks = [];

    // Go through every task ("li") currently on the page, one by one.
    taskList.querySelectorAll("li").forEach((taskItem) => {
        // Find the text part of this task.
        const taskTextSpan = taskItem.querySelector("span");

        // Remember two things about this task: its text, and whether it is done.
        // "classList.contains" checks if the "done" class is there (true or false).
        tasks.push({
            text: taskTextSpan.textContent,
            done: taskTextSpan.classList.contains("done")
        });
    });

    // localStorage can only store text, so "JSON.stringify" turns our list into text.
    // We save it under the name "tasks".
    localStorage.setItem("tasks", JSON.stringify(tasks));
}


// ===== Step 3: Build one task and show it on the page =====
// "text" is what the task says. "done" is true if it is finished, false if not.
function createTaskElement(text, done) {
    // Create a new list item. "li" means "list item".
    const newTask = document.createElement("li");

    // Create a "span" to hold the task text.
    // A span is a small container for text. Keeping the text in its own
    // span means it stays separate from the Delete button.
    const taskTextSpan = document.createElement("span");

    // Put the task's text inside the span.
    taskTextSpan.textContent = text;

    // If this task was already finished, show it with a line through it.
    if (done) {
        taskTextSpan.classList.add("done");
    }

    // When the task text is clicked, mark it as done (or undo it).
    // "classList.toggle" adds the class "done" if it isn't there,
    // and removes it if it is. style.css draws the line for "done".
    taskTextSpan.addEventListener("click", () => {
        taskTextSpan.classList.toggle("done");
        saveTasks(); // Save, so the change is remembered after a refresh.
    });

    // Create a new button for deleting this task.
    const deleteButton = document.createElement("button");

    // Write "Delete" on the button.
    deleteButton.textContent = "Delete";

    // Give the button a class name so style.css can make it look nice.
    deleteButton.className = "delete-button";

    // When this Delete button is clicked, remove its task from the page.
    // "() => { ... }" is a short way to write a small function right here.
    deleteButton.addEventListener("click", () => {
        newTask.remove();
        saveTasks(); // Save, so the deleted task stays gone after a refresh.
    });

    // Put the text and the Delete button inside the list item.
    newTask.appendChild(taskTextSpan);
    newTask.appendChild(deleteButton);

    // Add the new list item to the bottom of the list on the page.
    taskList.appendChild(newTask);
}


// ===== Step 4: Add a new task from the text box =====
function addTask() {
    // Get the text you typed in the box.
    // ".trim()" removes extra spaces at the start and end.
    const taskText = taskInput.value.trim();

    // If the box is empty, stop here and don't add anything.
    if (taskText === "") {
        return;
    }

    // Build the task and show it. "false" means it is not done yet.
    createTaskElement(taskText, false);

    // Save, so the new task is remembered after a refresh.
    saveTasks();

    // Empty the text box so you can type the next task.
    taskInput.value = "";
}


// ===== Step 5: Load saved tasks when the page opens =====
function loadTasks() {
    // Get the saved text from localStorage.
    // If nothing has been saved yet, use "[]" (an empty list) instead.
    const savedText = localStorage.getItem("tasks") || "[]";

    // "JSON.parse" turns the saved text back into a list we can use.
    const savedTasks = JSON.parse(savedText);

    // Show each saved task on the page, with its text and done/not-done state.
    savedTasks.forEach((task) => {
        createTaskElement(task.text, task.done);
    });
}

// Run loadTasks once, right now, as the page opens.
loadTasks();


// ===== Step 6: Run addTask when the button is clicked =====
// "addEventListener" tells the button: "when someone clicks you, run addTask".
// Notice we write "addTask" without () - we are giving the function to the button,
// not running it right now.
addButton.addEventListener("click", addTask);


// ===== Step 7: Also add the task when Enter is pressed =====
// "keydown" happens every time a key is pressed while typing in the text box.
// "event" holds information about which key was pressed.
taskInput.addEventListener("keydown", (event) => {
    // Only add the task if the key was Enter. Other keys just type letters as normal.
    if (event.key === "Enter") {
        addTask();
    }
});
