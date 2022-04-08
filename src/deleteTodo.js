'use strict';
const AWS = require('aws-sdk')
const { handler: fetchTodo } = require('./fetchTodo')

const deleteTodo = async (event) => {

  const dynamodb = new AWS.DynamoDB.DocumentClient()

  const { id } = event.pathParameters;

  const todo = await fetchTodo(event)
  if (!todo.body) {
    return {
      statusCode: 400,
      body: JSON.stringify(
        {
          msg: `Todo with id ${id} doesn't exist`
        }
      ),
    };
  }
  await dynamodb.delete({
    TableName: process.env.TODO_TABLE_NAME,
    Key: { id },
  }).promise()

  return {
    statusCode: 200,
    body: JSON.stringify(
      {
        msg: `Todo with id ${id} Deleted`
      }
    ),
  };
};

module.exports = {
  handler: deleteTodo
}
