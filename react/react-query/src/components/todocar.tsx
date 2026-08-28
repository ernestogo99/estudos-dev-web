import { useState } from "react";
import type { Todo } from "../interfaces/todo";

interface TodoProps {
  todo: Todo;
}

export default function TodoCard({ todo }: TodoProps) {
  const [checked, setChecked] = useState(todo.completed);

  return (
    <div>
      {todo.title}
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => setChecked(e.target.checked)}
      />
    </div>
  );
}
