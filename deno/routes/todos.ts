import { Router } from 'https://deno.land/x/oak/mod.ts';
import { ObjectId } from "https://deno.land/x/mongo@v0.13.0/mod.ts";
import { getDb } from "../helpers/db_client.ts";

const router = new Router();

interface Todo {
  id?: string;
  text: string;
}


router.get('/todos', async (ctx) => {
  const todos = await getDb().collection("todo").find();
  const transfordTodos = todos.map((todo:any) => {
    return { id: todo._id.$oid, text: todo.text };
  })
  ctx.response.body = { todos: transfordTodos };
});

router.post('/todos', async (ctx) => {
  const {text} = await ctx.request.body().value;
  const newTodo: Todo = {
    //id: new Date().toISOString(),
    text: text,
  };

  const id = await getDb().collection("todo").insertOne(newTodo);

  newTodo.id = id.$oid;

  ctx.response.body = { message: 'Created todo!', todo: newTodo };
});

router.put('/todos/:todoId', async (ctx) => {
  const tid = ctx.params.todoId!;
  const {text} = await ctx.request.body().value;
  await getDb().collection("todo").updateOne({_id:ObjectId(tid)},{$set:{text:text}})
  ctx.response.body = { message: 'Updated todo' };
});

router.delete('/todos/:todoId', async(ctx) => {
  const tid = ctx.params.todoId!;
  await getDb().collection("todo").deleteOne({_id:ObjectId(tid)})
  ctx.response.body = { message: 'Deleted todo' };
});

export default router;
