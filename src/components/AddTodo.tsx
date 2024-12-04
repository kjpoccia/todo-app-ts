interface AddTodoProps {
    showModalNew: () => void;
}

const AddTodo = ({ showModalNew }: AddTodoProps ) => {
    return (
        <label htmlFor="new_item" onClick={() => showModalNew()}>
            <img src="images/plus.png" alt="Add Todo Item" />
            <h2>Add new to do</h2>
        </label>
    )
}

export default AddTodo;