'use strict';
const AWS = require('aws-sdk')

const fetchTodos = async (event) => {

  const dynamodb = new AWS.DynamoDB.DocumentClient()

  let todos
  try {
    const results = await dynamodb.scan({ TableName: process.env.TODO_TABLE_NAME }).promise()
    todos = results.Items
  } catch (error) {
    console.log(error)
  }
  return {
    statusCode: 200,
    body: JSON.stringify(
      todos
    ),
  };
};

module.exports = {
  handler: fetchTodos
}