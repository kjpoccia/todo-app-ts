import { Todo } from '../types'

function dueDate(month?: string, year?: string): string {
    if (!month || !year) {
        return "No Due Date"
    } else {
        return `${month}/${year}`
    }
}

interface ListProps {
    currentList: Todo[];
    toggleComplete: (id: string) => void;
    showModalWithId: (id: string) => void;
    handleDelete: (id: string) => void;
}

const List = ({currentList, toggleComplete, showModalWithId, handleDelete}: ListProps) => {
    return (
        <table cellSpacing="0">
            <tbody>
                {currentList.map(todo => {
                    return (
                        <tr key={todo.id}>
                            <td className="list_item">
                                <input 
                                    type="checkbox" 
                                    name={`item_${todo.id}`} 
                                    id={`item_${todo.id}`} 
                                    checked={todo.completed} readOnly
                                    
                                />
                                <span className="check" onClick={() => toggleComplete(todo.id)}></span>
                                <label htmlFor={`item_${todo.id}`} onClick={() => showModalWithId(todo.id)}>{todo.title} - {dueDate(todo.month, todo.year?.slice(-2))}</label>
                            </td>
                            <td className="delete" onClick={() => handleDelete(todo.id)}><img src="images/trash.png" alt="Delete"/></td>
                        </tr>
                    )
                })}
            </tbody>
        </table>
    )
}

export default List;