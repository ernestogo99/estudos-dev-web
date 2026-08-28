import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { addTodo, fetchTodos } from "../mock/api";
import { type Todo } from "../interfaces/todo";
import TodoCard from "./todocar";
import { useState } from "react";

export const Todos = () => {
  const [title, setTitle] = useState("");
  const [search, setSearch] = useState("");
  const queryClient = useQueryClient();

  const { data: todos, isLoading } = useQuery({
    queryFn: () => fetchTodos(search),
    queryKey: ["todos", search],
    staleTime: Infinity, // vai prevenir os dados de ficarem obsoletos, ou seja, não vai refazer a requisição enquanto o componente estiver montado
  });

  const { mutateAsync: addTodoMutation } = useMutation({
    mutationFn: addTodo,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["todos"] });
    },
  });

  const handleClick = async () => {
    try {
      await addTodoMutation({ title });
      setTitle("");
    } catch (error) {
      console.error("Error adding todo:", error);
    }
  };

  if (isLoading) {
    return (
      <div>
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div>
      <div>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <button onClick={handleClick}>Add todo</button>
      </div>
      {todos?.map((todo: Todo) => (
        <TodoCard key={todo.id} todo={todo} />
      ))}
    </div>
  );
};
