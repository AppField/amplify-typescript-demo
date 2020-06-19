import React, { useState, FormEvent } from "react";
import callGraphQL from "../models/graphql-api";

import { createTodo } from "../graphql/mutations";
import { CreateTodoMutation, CreateTodoMutationVariables } from "../API";

const CreateTodo = () => {
  const [name, setName] = useState<string>();
  const [description, setDescription] = useState<string>();

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();

    if (!!name && !!description) saveTodo(name, description);

    setName("");
    setDescription("");
  };

  const saveTodo = async (name: string, description: string) => {
    try {
      const response = await callGraphQL<CreateTodoMutation>(createTodo, {
        input: { name, description },
      } as CreateTodoMutationVariables);
    } catch (error) {
      console.error("Error creating todo", error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>
          ToDo Name:
          <input
            id="name"
            name="name"
            type="text"
            onChange={(event) => setName(event.target.value)}
          />
        </label>
      </div>
      <div>
        <label>
          ToDo Description:
          <input
            id="description"
            name="description"
            type="text"
            onChange={(event) => setDescription(event.target.value)}
          />
        </label>
      </div>
      <button type="submit">Save Todo</button>
    </form>
  );
};

export default CreateTodo;
