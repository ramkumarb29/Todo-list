import axios from "axios"
import { useEffect, useState } from "react"

const ToDoList = () => {

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [message, setMessage] = useState('') 
  const [error, setError] = useState('')
  const [todos, setTodos] = useState([])
  const [editId, setEditId] = useState(-1)
  const apiUrl = import.meta.env.VITE_API_URL

  const [editTitle, setEditTitle] = useState('')
  const [editDescription, setEditDescription] = useState('')

  useEffect(() => {
    const fetchTodos = async () => {
      try {
        const response = await axios.get(`${apiUrl}/todos`)
        setTodos(response.data.todoList)
      } catch (error) {
        setError(error.message)
      }
    }
    
    fetchTodos()

  }, [todos])

  const submitHandler = async (e) => {
    try {
      e.preventDefault()
      const todoItem = {title, description}
      const data = await axios.post(`${apiUrl}/todos`, todoItem)
      setMessage(data.data.message)
      setTimeout(() => {
        setMessage('')
      }, 3000)
      setTitle('')
      setDescription('')
    } catch (error) {
      setError(error.message)
      setTimeout(() => {
        setError('')
      }, 3000)
    }
  }

  const handleEdit = (todo) => {
    setEditId(todo._id)
    setEditTitle(todo.title)
    setEditDescription(todo.description)
  }

  const handleUpdate = async (id) => {
    try {
      const data = await axios.put(`${apiUrl}/todo/${id}`, {title: editTitle, description: editDescription})
      const updatedTodos = todos.map(todo => {
        if(todo._id == editId) {
          todo.title = editTitle
          todo.description = editDescription
        }
        return todo
      }) 

      setTodos(updatedTodos)
      setEditTitle('')
      setEditDescription('')
      setMessage(data.data.message)
      setTimeout(()=> {
        setMessage('')
      }, 3000)
      setEditId(-1)
    } catch (error) {
      setError(error.message)
    }
  }

  const handleDelete = async (id) => {
    await axios.delete(`${apiUrl}/todo/${id}`)
    const updatedTodos = todos.filter(todo => {
      todo._id !== id
    })
    setTodos(updatedTodos)
  }

  const handleCancel = () => {
    setEditId(-1)
  }

  return (
    <div className="w-full flex flex-col items-center gap-4">
      <div className="w-full flex flex-col gap-3 bg-Blue p-4 rounded-lg">
        <div className="">
              <h1 className="text-2xl text-center font-bold text-pastelPink ">To-Do List</h1>
          </div>
          <div className="flex flex-col gap-2 items-center">
            <form onSubmit={submitHandler} className="flex flex-col items-center justify-center gap-2 text-Blue sm:max-2xl:flex-row">
                <input className="indent-2 p-1 rounded-sm font-medium outline-none" type="text" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} required />
                <input className="indent-2 p-1 rounded-sm font-medium outline-none" type="text" placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} required />
                <button className="bg-pastelPink py-1 px-2 rounded-lg font-semibold hover:opacity-90">Add Item to List</button>
            </form>
            { message && <p className="bg-pastelPink text-green-600 font-semibold py-1 px-3 mt-2 rounded-md text-center max-w-96">{message}</p> }      
            { error && <p className="bg-pastelPink text-red-600 font-semibold py-1 px-3 mt-2 rounded-md text-center max-w-96">{error}</p> }      
          </div>
      </div>
      {
        todos.length > 0 ? 
        <>
          <div className="w-full max-h-[420px] bg-Blue p-4 rounded-lg flex flex-col sm:max-2xl:items-center gap-3 overflow-y-auto">
            {
              todos.map(todo => {
                return (
                  <div key={todo._id} className="bg-pastelPink p-2 rounded-md min-w-[270px] sm:max-2xl:min-w-[480px]">
                    {
                      editId == -1 || editId !== todo._id ? 
                      <div className="flex flex-col gap-1">
                        <h1 className="font-semibold text-lg">{todo.title}</h1>
                        <p className="">{todo.description}</p>
                      </div> : 
                      <div className="flex gap-3 overflow-x-auto">
                        <input className="indent-2 p-1 rounded-sm font-medium outline-none" type="text" placeholder="Title" value={editTitle} onChange={(e) => setEditTitle(e.target.value)} required />
                        <input className="indent-2 p-1 rounded-sm font-medium outline-none" type="text" placeholder="Description" value={editDescription} onChange={(e) => setEditDescription(e.target.value)} required />
                      </div>
                    }
                    
                    <div className="flex gap-3 mt-2">
                      { 
                        editId == -1 || editId !== todo._id ? <button className="bg-Blue py-1 px-3 rounded-lg font-semibold hover:opacity-90 text-pastelPink" onClick={() => handleEdit(todo)}>Edit</button> : 
                        <button className="bg-Blue py-1 px-3 rounded-lg font-semibold hover:opacity-90 text-pastelPink" onClick={() => handleUpdate(todo._id)}>Update</button>
                      }
                      {
                        editId == -1 || editId !== todo._id ? <button className="bg-Blue py-1 px-2 rounded-lg font-semibold hover:opacity-90 text-pastelPink" onClick={() => {handleDelete(todo._id)}}>Delete</button> :
                        <button className="bg-Blue py-1 px-3 rounded-lg font-semibold hover:opacity-90 text-pastelPink" onClick={() => handleCancel(todo)}>Cancel</button>
                      }
                    </div>
                  </div>
                )
              })
            }
          </div>
        </> : 
        <p className="text-xl font-semibold w-full h-96 flex items-center justify-center rounded-lg text-pastelPink bg-Blue">No Todo Items to display.</p>
      }
      
    </div>
  )
}

export default ToDoList