//importacion en crudo
import todoStore, { Filters } from "../store/todo.store";
import html from "./app.html?raw";
import { rederPending, renderTodos } from "./use-cases";


const ElementIDs = {
    clearCompleted: '.clear-completed',
    TodoList: '.todo-list',
    NewTodoInput: '#new-todo-input',
    TodoFilters: '.filtro',
    PendingCountLabel: '#pending-count'

}

/**
 * 
 * @param {String} elementId 
 */
export const App = (elementId) => {

    const displayTodos = () => {
        const todos = todoStore.getTodos(todoStore.getCurrentFilter());
        renderTodos(ElementIDs.TodoList, todos);
        updatePendingCount();
    }

    const updatePendingCount = () => {
        rederPending(ElementIDs.PendingCountLabel);
    }


    //funcion autoinvocada
    (() => {
        const app = document.createElement('div')
        app.innerHTML = html;
        document.querySelector(elementId).append(app);
        displayTodos();

    })();

    // referencias HTML
    const newDescriptionInput = document.querySelector(ElementIDs.NewTodoInput)
    const TodoListUL = document.querySelector(ElementIDs.TodoList)
    const clearCompletedButton = document.querySelector(ElementIDs.clearCompleted)
    const filtersLi = document.querySelectorAll(ElementIDs.TodoFilters);
    //Listeners
    newDescriptionInput.addEventListener('keyup', (event) => {
        if (event.keyCode !== 13) return;

        //trim() remueve los espacios adelante y atras
        if (event.target.value.trim().length === 0) return;

        todoStore.addTodo(event.target.value);
        displayTodos();
        event.target.value = '';
    })

    TodoListUL.addEventListener('click', (event) => {
        //closest() puedo buscar dentro del elemento el dato mas cercano que tenga el data-id
        const element = event.target.closest('[data-id]');
        todoStore.toggleTodo(element.getAttribute('data-id'))
        displayTodos();
    })

    TodoListUL.addEventListener('click', (event) => {
        const isDestroyElement = event.target.className === 'destroy';
        const element = event.target.closest('[data-id]')
        if (!element || !isDestroyElement) return;
        todoStore.deleteTodo(element.getAttribute('data-id'))
        displayTodos();


    });

    clearCompletedButton.addEventListener('click', () => {
        todoStore.deleteCompleted()
        displayTodos();

    })

    filtersLi.forEach(element => {
        element.addEventListener('click', (element) => {
            filtersLi.forEach(ele => ele.classList.remove('selected'))
            element.target.classList.add('selected');

            switch (element.target.text) {
                case 'Todos':
                    todoStore.setFilter(Filters.All)
                    break;
                case 'Pendientes':
                    todoStore.setFilter(Filters.Pending)
                    break;
                case 'Completados':
                    todoStore.setFilter(Filters.Completed)
                    break;

            }
            displayTodos();


        })

    })


}