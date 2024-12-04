interface Todo {
    id: string;
    title: string;
    completed: boolean;
    day?: string;
    month?: string;
    year?: string;
    description: string;
}

interface NewTodo {
    title?: string;
    completed?: boolean;
    day?: string;
    month?: string;
    year?: string;
    description?: string;
}

interface CurrentListTitle {
    title: string;
    completedOnly: boolean;
    dueDate?: string;
}

interface TodoCountsByDate {
    [key: string]: number;
}

export type {
    Todo,
    CurrentListTitle,
    NewTodo,
    TodoCountsByDate,
};