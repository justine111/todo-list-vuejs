import { createApp } from 'vue'
import { createStore } from 'vuex'
import App from './App.vue'
import router from './router'

const app = createApp(App);

// Create a store for our to do list items
const store = createStore({
    state () {
        return {
            todos: [
                // id<String> can be any unique ID
                // name<String> is the name of our item
                // completed<Boolean> is set to true when done, false when not
                // location<['home', 'archive']> is set to home or archive depending on which page we want to show it on
                { id: 'first-element', name: 'My First To Do Item', completed: false, location: 'home' }
            ]
        }
    },
    getters: {
        todos (state) {
            return state.todos;
        }
    },
    mutations: {
		loadStore() {
			if(localStorage.getItem('store')) {
                try {
                    this.replaceState(JSON.parse(localStorage.getItem('store')));
                }
                catch(e) {
                    console.log('Could not initialize store', e);
                }
			}
		},
        updateTodo (state, todoItem) {
            let id = todoItem.id;
            let completed = todoItem.completed;
            let name = todoItem.name;
            let findEl = state.todos.find((x) => x.id == id);
            if(findEl !== null) {
                if(completed !== undefined) {
                    findEl.completed = completed;
                }
                if(name !== undefined) {
                    findEl.name = name;
                }
            }
            else {
                console.log(`To Do List Item ${id} couldn't be found`);
            }
        },
        addTodo (state, todoItem) {
            if(todoItem.id !== undefined && typeof todoItem.name == 'string' && typeof todoItem.completed == 'boolean') {
                state.todos.push({
                    id: todoItem.id,
                    name: todoItem.name,
                    completed: todoItem.completed,
                    location: 'home'
                })
            }
        },
        deleteTodo (state, todoItem) {
            let id = todoItem.id;
            let removedEl = state.todos.findIndex((x) => x.id == id);
            if(removedEl !== null) {
                state.todos.splice(removedEl, 1);
            }
        },
        moveTodoItem (state, todoItem) {
            let id = todoItem.id;
            let location = todoItem.location;
            let findEl = state.todos.find((x) => x.id == id);
            if(findEl !== null) {
                findEl.location = location;
            }
            else {
                console.log(`To Do List Item ${id} couldn't be found`);
            }
        }
    }
});
store.subscribe((mutation, state) => {
    // The code inside the curly brackets fires any time a mutation occurs.
    // When a mutation occurs, we'll stringify our entire state object - which
    // contains our todo list. We'll put it in the users localStorage, so that
    // their data will persist even if they refresh the page.
	localStorage.setItem('store', JSON.stringify(state));
})

app.use(router).use(store).mount('#app')