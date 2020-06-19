import { ListTodosQuery, OnCreateTodoSubscription } from "../API";
import { GraphQLResult } from "@aws-amplify/api";

interface Todo {
  id?: string;
  name?: string;
  description?: string;
}

function mapListTodosQuery(listTodosQuery: GraphQLResult<ListTodosQuery>): Todo[] {
  return listTodosQuery.data?.listTodos?.items?.map(todo => ({
    id: todo?.id,
    name: todo?.name,
    description: todo?.description
  } as Todo)) || []
}

function mapOnCreateTodoSubscription(createTodoSubscription: OnCreateTodoSubscription): Todo {
  const { id, name, description } = createTodoSubscription.onCreateTodo || {};
  return {
    id, name, description
  } as Todo
}

export default Todo;
export { mapListTodosQuery, mapOnCreateTodoSubscription }