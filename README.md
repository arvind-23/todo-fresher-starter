# Take-Home: Todo List (Vanilla JS)

**Goal**: Build a todo app with **1-level nested drag & drop**, filters, and persistence — **no frameworks, no libraries**.
The activity is very interesting and covers various features. Learnt new things while doing this exercise.

---

# 📝 Todo App

Project Link: https://arvind-23.github.io/todo-fresher-starter/

---

## 🛠️ Challenges Faced during Process

### 1. Drag and Drop Implementation
- The issue: This feature was a bit complex and required quite some time to implement. The nested subtasks made this a bit tricky. Also faced silent crash and freeze during implementaion.
- Fix: I had accidently created Locked variable(const) due to which the todos didnt move, fixed using "let".

### 2. Add and Delete Icons
- The icons were bit tricky as i didnt use standard icons, instead used SGV for better looks.

### 3. Naming Mismatch
- Issue: While implementing delete and filtering, did not get any response from app.
- Fix: Had to go through naming again, due to mismatch. Once i figured out the variables, the page started working.

### 4. Mobile Responsiveness
- Faced challenge to implement, tried to make sure some basic styling and listeners will help in it.

---

## Suggestions
- Would like to try styling myself and add some animations next time.
- A timeline feature for the todos will be interesting as well.
