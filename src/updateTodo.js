'use strict';
const AWS = require('aws-sdk')
const { handler: deleteTodo } = require('./deleteTodo')
const { handler: fetchTodo } = require('./fetchTodo')

const updateTodo = async (event) => {

  const dynamodb = new AWS.DynamoDB.DocumentClient()

  const { completed } = JSON.parse(event.body)
  const { id } = event.pathParameters;

  const todo = await fetchTodo(event)
  console.log(todo)
  if (!todo.body) {
    console.error('wrong id')
    return
  }
  await dynamodb.update({
    TableName: process.env.TODO_TABLE_NAME,
    Key: { id },
    UpdateExpression: 'set completed = :completed',
    ExpressionAttributeValues: {
      ':completed': completed,
    },
    ReturnValues: 'ALL_NEW'
  }).promise()

  if (completed) {
    await deleteTodo(event)
  }

  return {
    statusCode: 200,
    body: JSON.stringify(
      {
        msg: 'Todo Updated'
      }
    ),
  };
};

module.exports = {
  handler: updateTodo
}
