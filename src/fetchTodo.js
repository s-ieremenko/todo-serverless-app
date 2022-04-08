const AWS = require('aws-sdk')

const dynamodb = new AWS.DynamoDB.DocumentClient()
const fetchTodoById = async (id) => {


  let todo

  try {
    const result = await dynamodb.get({
      TableName: process.env.TODO_TABLE_NAME,
      Key: { id }
    }).promise()
    todo = result.Item
  } catch (error) {
    console.log(error)
  }

  return todo

}

async function fetchTodo(event, context) {
  const { id } = event.pathParameters
  const todo = await fetchTodoById(id)

  return {
    statusCode: 200,
    body: JSON.stringify(todo),
  }
}

module.exports = {
  handler: fetchTodo,
  fetchTodoById
}