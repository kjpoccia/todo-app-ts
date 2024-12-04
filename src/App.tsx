import { useState, useEffect, useMemo } from 'react'
import './App.css'
import todoService from './services/todos'
import AddTodo from './components/AddTodo'
import Title from './components/Title'
import List from './components/List'
import Modal from './components/Modal'
import Sidebar from './components/Sidebar'
import { Todo, CurrentListTitle, NewTodo, TodoCountsByDate } from './types'

const PLACEHOLDERS = {day: '99', month: '99', year: '9999'};

function App() {

  const startingTitle: CurrentListTitle = {
    title: "All Todos",
    completedOnly: false,
  }
  const [currentTitle, setCurrentTitle] = useState<CurrentListTitle>(startingTitle);
  const [allTodos, setAllTodos] = useState<Todo[] | []>([]);
  const [showModal, setShowModal] = useState<boolean>(false)
  const [viewInModal, setViewInModal] = useState<Todo | NewTodo>({title: ''});

  useEffect(() => {
    const getTodoData = async () => {
      try {
        let todos: Todo[] = await todoService.getAllTodos();
        adjustDates(todos);
        todos = sortTodos(todos);
        setAllTodos(todos);
      } catch (error) {
        console.log("Error fetching all todos: ", error);
      }
    }

    void getTodoData();
  }, [])

  const displayList = useMemo(() => {
    let list: Todo[] = allTodos;
    if (currentTitle.completedOnly) {
      list = allTodos.filter(todo => todo.completed)
    }

    if (!["Completed", "All Todos"].includes(currentTitle.title)) {
      list = list.filter(todo => {
        return ( (currentTitle.title.slice(0, 2) === todo.month
              && currentTitle.title.slice(3, 5) === (todo.year ? todo.year.slice(-2) : ''))
              || (currentTitle.title === "No Due Date" && !todo.month && !todo.year))
      })
    }

    return list;
  }, [allTodos, currentTitle]);

  const adjustDates = (todos: Todo[]) => {
    todos.forEach(todo => {
      (['day', 'month', 'year'] as const).forEach(field => {
        if (todo[field] && Object.values(PLACEHOLDERS).includes(todo[field])) {
          todo[field] = '';
        }
      })
    })
  }

  const sortTodos = (todos: Todo[]): Todo[] => {
    return todos.toSorted((a: Todo, b: Todo) => {
      if (a.completed) return 1;
      if (b.completed) return -1;
      if (!a.year || !a.month) return -1;
      if (!b.year || !b.month) return 1;

      const yearComp = parseInt(a.year) - parseInt(b.year)
      if (yearComp !== 0) return yearComp;

      const monthComp = parseInt(a.month) - parseInt(b.month)
      if (monthComp !== 0) return monthComp;
      
      return 0;
    })
  }

  const handleListClick = (title: string, completedOnly: boolean) => {
    setCurrentTitle({ title: title, completedOnly: completedOnly })
  }

  const toggleComplete = async (id: string) => {
    let todo = findTodo(id);
    if (!todo) return;
    const changedTodo = {...todo, completed: !todo.completed}
    try {
      await todoService.updateTodo(id, {completed: changedTodo.completed})
      updateAndSortTodos(id, changedTodo);
    } catch (error) {
      console.log("Error toggling completed todo: ", error)
    }
  }

  const handleUpdate = async (todo: Todo) => {
    let localTodo = findTodo(todo.id);
    if (!localTodo) return;
    const changedTodo = {...localTodo, ...todo}
    resetsForUI(changedTodo);
    try {
      await todoService.updateTodo(localTodo.id, todo)
      updateAndSortTodos(localTodo.id, changedTodo);
      setShowModal(false);
    } catch (error) {
      console.log("Error updating todo: ", error)
    }
  }

  const validateTitle = (todo: Todo | NewTodo) => {
    if (!todo.title || todo.title.length <= 3) {
      alert('Title must be at least 3 characters long')
      return false;
    } 

    return true;
  }

  const resetsForDatabase = (todo: Todo | NewTodo) => {
    if (todo.day === 'Day') todo.day = PLACEHOLDERS.day
    if (todo.month === 'Month') todo.month = PLACEHOLDERS.month
    if (todo.year === 'Year') todo.year = PLACEHOLDERS.year
  }

  const resetsForUI = (todo: Todo | NewTodo) => {
    if (todo.day === PLACEHOLDERS.day) todo.day = ''
    if (todo.month === PLACEHOLDERS.month) todo.month = ''
    if (todo.year === PLACEHOLDERS.year) todo.year = ''
  }

  const handleSubmit = async (todo: Todo | NewTodo) => {
    if (!validateTitle(todo)) return;

    resetsForDatabase(todo);
    if ("id" in todo) { // means it's an existing todo
      handleUpdate(todo)
    } else {
      try {
        const newTodo = await todoService.addNewTodo(todo)
        let todos = allTodos.concat(newTodo);
        setAllTodos(todos);
        setShowModal(false);
      } catch (error) {
        console.log("Error adding todo: ", error)
      }
    }
  }

  const handleDelete = async (id: string) => {
    let localTodo = findTodo(id);
    if (!localTodo) return;
    try {
      await todoService.deleteTodo(id)
      let todos = allTodos.filter(todo => todo.id.toString() !== id.toString());
      setAllTodos(todos);
    } catch (error) {
      console.log("Error deleting todo: ", error)
    }
  }

  const showModalWithId = (id: string) => {
    let todo = findTodo(id);
    if (!todo) return;
    setShowModal(true);
    setViewInModal(todo);
  }

  const showModalNew = () => {
    setShowModal(true);
    setViewInModal({ title: ''});
  }

  const hideModal = () => {
    setShowModal(false);
  }

  const findTodo = (id: string) => {
    return allTodos.find(todo => todo.id === id)
  }

  const updateAndSortTodos = (id: string, changedTodo: Todo) => {
    const changedTodos: Todo[] = allTodos.map(todo => {
      return (
        todo.id.toString() === id.toString() ? changedTodo : todo
      )
    })

    let sorted = sortTodos(changedTodos)
    setAllTodos(sorted)
  }

  const collectDataForSidebar = () => {
    let totalCount = allTodos.length;
    let completedTodos = allTodos.filter(todo => todo.completed);
    let totalCounts = countTodos(allTodos);
    let completedCounts = countTodos(completedTodos);
    return ({
      totalCount: totalCount,
      completedCount: completedTodos.length,
      totalCounts: totalCounts,
      completedCounts: completedCounts,
    })
  }

  const countTodos = (todos: Todo[]) => {
    let list: TodoCountsByDate = {};
    todos.forEach(todo => {
      const dueDate = (todo.month && todo.year) 
                            ? `${todo.month}/${todo.year.slice(-2)}`
                            : "No Due Date";
      
        list[dueDate] = (list[dueDate] || 0) + 1;
      })

    return list;
  }

  const getSidebarProps = () => {
    return {
      ...collectDataForSidebar(),
      handleListClick,
    }
  }

  return (
    <>
      <input type="checkbox" id="sidebar_toggle"/>
      <Sidebar {...getSidebarProps()}/>
      <div id="items">
        <Title currentTitle={currentTitle} currentCount={displayList.length}/>
        <main>
          <AddTodo showModalNew={showModalNew}/>
          <List 
            currentList={displayList} 
            toggleComplete={toggleComplete}
            showModalWithId={showModalWithId}
            handleDelete={handleDelete}
          />{
            showModal ? <Modal hideModal={hideModal} 
                               showModal={showModal} 
                               todo={viewInModal}
                               handleSubmit={handleSubmit}/> : <></>
          }
          
        </main>
      </div>
      
    </>
  )
}

export default App
