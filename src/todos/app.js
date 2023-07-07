import todoStore, { Filters } from '../store/todo.store';
import html from './app.html?raw';
import { renderTodos, renderPending } from './uses-cases';

const ElementIDs = {
    ClearCompleted: '.clear-completed',
    TodoList: '.todo-list',
    NewTodoInput: '#new-todo-input',
    TodoFilters: '.filtro',
    PendingCountLabel: '#pending-count'
}


export const App = (elementId) => {


    const displayTodo = () => {
        const todos = todoStore.getTodos(todoStore.getCurrentFilter());
        renderTodos(ElementIDs.TodoList, todos);
        updatePendingCount();
    }

    const updatePendingCount = () => {
        renderPending(ElementIDs.PendingCountLabel);
    }

    //Cuando la función App() se llama
    (() => {

        const app = document.createElement('div');
        app.innerHTML = html;
        document.querySelector(elementId).append(app);
        displayTodo();
    })();

    //Referencias HTML

    const newDescriptionInput = document.querySelector(ElementIDs.NewTodoInput);
    const todoListUL = document.querySelector(ElementIDs.TodoList);
    const clearCompletedButton = document.querySelector(ElementIDs.ClearCompleted);
    const filtersLIs = document.querySelectorAll(ElementIDs.TodoFilters);

    //Listeners

    newDescriptionInput.addEventListener('keyup', (event) => {
        if (event.keyCode !== 13) return;
        if (event.target.value.trim().length === 0) return;

        todoStore.addTodo(event.target.value);
        displayTodo();
        event.target.value = ''
    })

    todoListUL.addEventListener('click', (event) => {
        const element = event.target.closest('[data-id');
        todoStore.toggleTodo(element.getAttribute('data-id'));
        displayTodo();
    })

    todoListUL.addEventListener('click', (event) => {
        const isDestroyElement = event.target.className === 'destroy';
        const element = event.target.closest('[data-id');
        if (!element || !isDestroyElement) return

        todoStore.deleteTodo(element.getAttribute('data-id'));
        displayTodo();
    })

    clearCompletedButton.addEventListener('click', () => {
        todoStore.deleteCompleted();
        displayTodo();

    })

    filtersLIs.forEach(element => {
        element.addEventListener('click', (element) => {
            filtersLIs.forEach(el => el.classList.remove('selected'))
            element.target.classList.add('selected');

            switch (element.target.text) {
                case 'Todos':
                    todoStore.setFilter(Filters.All)
                    break
                case 'Pendientes':
                    todoStore.setFilter(Filters.Pending)
                    break
                case 'Completados':
                    todoStore.setFilter(Filters.Completed)
                    break;
            }
            displayTodo();
        })
    })


}