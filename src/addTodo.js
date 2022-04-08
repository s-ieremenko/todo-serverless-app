'use strict';
const { v4 } = require('uuid')
const AWS = require('aws-sdk')
const middy = require('@middy/core')
const httpJsonBodyParser = require('@middy/http-json-body-parser')

const addTodo = async (event) => {

  const dynamodb = new AWS.DynamoDB.DocumentClient()

  const { todo } = event.body
  const createdAt = new Date().toISOString()

  const id = v4()


  const newTodo = {
    id,
    todo,
    createdAt,
    completed: false,
    pictureUrl: null
  }

  await dynamodb.put({
    TableName: process.env.TODO_TABLE_NAME,
    Item: newTodo
  }).promise()
  return {
    statusCode: 200,
    body: JSON.stringify(
      newTodo
    ),
  };
};

module.exports = {
  handler: middy(addTodo).use(httpJsonBodyParser())
}
