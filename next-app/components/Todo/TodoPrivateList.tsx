import React, { Fragment, useState } from "react";
import { useQuery, useMutation, gql } from "@apollo/client";

import TodoItem from "./TodoItem";
import TodoFilters from "./TodoFilters";

const GET_MY_TODOS = gql`
  query getMyTodos {
    todos(
      where: { is_public: { _eq: false } }
      order_by: { created_at: desc }
    ) {
      id
      title
      created_at
      is_completed
    }
  }
`;

// Remove all the todos that are completed
const CLEAR_COMPLETED = gql`
  mutation clearCompleted {
    delete_todos(
      where: { is_completed: { _eq: true }, is_public: { _eq: false } }
    ) {
      affected_rows
    }
  }
`;

const TodoPrivateList = (props: any) => {
  const [state, setState] = useState({
    filter: "all",
    clearInProgress: false
  });

  const filterResults = (filter: any) => {
    setState({
      ...state,
      filter: filter
    });
  };

  const [clearCompletedTodos] = useMutation(CLEAR_COMPLETED);

  const clearCompleted = () => {
    clearCompletedTodos({
      optimisticResponse: true,
      update: (cache, { data }) => {
        const existingTodos: any = cache.readQuery({ query: GET_MY_TODOS });
        const newTodos = existingTodos.todos.filter((t:any) => !t.is_completed);
        cache.writeQuery({ query: GET_MY_TODOS, data: { todos: newTodos } });
      }
    });
  };

  const { todos } = props;

  let filteredTodos = todos;
  if (state.filter === "active") {
    filteredTodos = todos.filter((todo: any) => todo.is_completed !== true);
  } else if (state.filter === "completed") {
    filteredTodos = todos.filter((todo: any) => todo.is_completed === true);
  }

  const todoList: any[] = [];
  
  filteredTodos.forEach((todo: any, index: any) => {
    todoList.push(<TodoItem key={index} index={index} todo={todo} />);
  });

  return (
    <Fragment>
      <div className="todoListWrapper">
        <ul>{todoList}</ul>
      </div>

      <TodoFilters
        todos={filteredTodos}
        currentFilter={state.filter}
        filterResultsFn={filterResults}
        clearCompletedFn={clearCompleted}
        clearInProgress={state.clearInProgress}
      />
    </Fragment>
  );
};

const TodoPrivateListQuery = () => {
  const { loading, error, data } = useQuery(GET_MY_TODOS);

  console.log('data', data);
  

  if (loading) {
    return <div>Loading...</div>;
  }
  if (error) {
    console.error(error);
    return <div>Error!</div>;
  }
  return <TodoPrivateList todos={data.todos} />;
};

export default TodoPrivateListQuery;
export { GET_MY_TODOS };