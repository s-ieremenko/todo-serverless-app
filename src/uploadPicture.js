const AWS = require('aws-sdk')
const { fetchTodoById } = require('./fetchTodo')

const s3 = new AWS.S3();
const dynamodb = new AWS.DynamoDB.DocumentClient()

async function uploadPictureToS3(key, body) {
  const result = await s3
    .upload({
      Bucket: process.env.TODO_BUCKET_NAME,
      Key: key,
      Body: body,
      ContentEncoding: 'base64',
      ContentType: 'image/jpeg',
    })
    .promise();
  return result.Location;
}

async function uploadAuctionPicture(event) {
  const { id } = event.pathParameters;
  const todo = await fetchTodoById(id);

  //Validate auction ownership
  // if (auction.seller !== email) {
  //   console.log(auction.email);
  //   throw new createError.Forbidden('You are not the seller of this auction');
  // }

  const base64 = event.body.replace(/^data:image\/\w+;base64,/, '');
  const buffer = Buffer.from(base64, 'base64');

  let updatedTodo;

  try {
    const pictureUrl = await uploadPictureToS3(todo.id + '.jpg', buffer);
    updatedTodo = await setPictureUrl(todo.id, pictureUrl);
  } catch (error) {
    console.log(error);
    // throw new createError.InternalServerError(error);
  }

  return {
    statusCode: 200,
    body: JSON.stringify(updatedTodo),
  };
}

async function setPictureUrl(id, pictureUrl) {
  const params = {
    TableName: process.env.TODO_TABLE_NAME,
    Key: { id },
    UpdateExpression: 'set pictureUrl = :pictureUrl',
    ExpressionAttributeValues: {
      ':pictureUrl': pictureUrl,
    },
    ReturnValues: 'ALL_NEW',
  };
  const result = await dynamodb.update(params).promise();
  return result.Attributes;
}

module.exports = {
  handler: uploadAuctionPicture
}