import axios from "axios";
import { apiBaseUrl } from "../constants.ts";
import { NewTodo } from "../types"

const getAllTodos = async () => {
  const { data } = await axios.get<[]>(
    `${apiBaseUrl}/todos`
  );

  return data;
};

const updateTodo = async (id: string, updates: NewTodo) => {
  const { data } = await axios.put(`${apiBaseUrl}/todos/${id}`, updates)
  return data;
}

const addNewTodo = async (todo: NewTodo) => {
  const { data } = await axios.post(`${apiBaseUrl}/todos`, todo)
  return data;
}

const deleteTodo = async (id: string) => {
  const { data } = await axios.delete(`${apiBaseUrl}/todos/${id}`)
  return data;
}

export default {
  getAllTodos,
  updateTodo,
  addNewTodo,
  deleteTodo,
};