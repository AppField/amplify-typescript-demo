import React, { useState, useEffect } from "react";
import "./App.css";

import Amplify from "aws-amplify";
import { listTodos } from "./graphql/queries";
import { ListTodosQuery, OnCreateTodoSubscription } from "./API";
import Todo, {
  mapListTodosQuery,
  mapOnCreateTodoSubscription,
} from "./models/todo";

import config from "./aws-exports";
import callGraphQL, { subscribeGraphQL } from "./models/graphql-api";
import CreateTodo from "./components/create-todo";

import { onCreateTodo } from "./graphql/subscriptions";

Amplify.configure(config);

function App() {
  const [todos, setTodos] = useState<Todo[]>([]);

  useEffect(() => {
    async function getData() {
      try {
        const todoData = await callGraphQL<ListTodosQuery>(listTodos);
        const todos = mapListTodosQuery(todoData);
        setTodos(todos);
      } catch (error) {
        console.error("Error fetching todos", error);
      }
    }
    getData();
  }, []);

  // useEffect(() => {
  //   // @ts-ignore
  //   const subscription = API.graphql(graphqlOperation(onCreateTodo)).subscribe({
  //     next: (response: SubscriptionValue<OnCreateTodoSubscription>) => {
  //       const todo = mapOnCreateTodoSubscription(response.value.data);
  //       console.log(todo);
  //       setTodos([...todos, todo]);
  //     },
  //   });

  //   return () => subscription.unsubscribe();
  // });

  const onCreateTodoHandler = (
    createTodoSubscription: OnCreateTodoSubscription
  ) => {
    const todo = mapOnCreateTodoSubscription(createTodoSubscription);
    setTodos([...todos, todo]);
  };

  useEffect(() => {
    const subscription = subscribeGraphQL<OnCreateTodoSubscription>(
      onCreateTodo,
      onCreateTodoHandler
    );

    return () => subscription.unsubscribe();
  }, [todos]);

  return (
    <div className="App">
      <CreateTodo />

      <h2>Todos:</h2>
      {todos?.map((t) => (
        <div key={t.id}>
          <h2>{t.name}</h2>
          <p>{t.description}</p>
        </div>
      ))}
    </div>
  );
}

export default App;
