import * as AWS  from 'aws-sdk'
import * as AWSXRay from 'aws-xray-sdk'
import { DocumentClient } from 'aws-sdk/clients/dynamodb'

const XAWS = AWSXRay.captureAWS(AWS)

import { Image } from '../models/Image'

export class ImagesAccess {

  constructor(
    private readonly docClient: DocumentClient = createDynamoDBClient(),
    private readonly s3 = new XAWS.S3({
      signatureVersion: 'v4'
    }),
    private readonly bucketName = process.env.IMAGES_S3_BUCKET,
    private readonly urlExpiration = process.env.SIGNED_URL_EXPIRATION,
    private readonly imagesTable = process.env.IMAGES_TABLE,
    private readonly imageIdIndex = process.env.IMAGE_ID_INDEX) {
  }
  async createImage(image: Image): Promise<Image> {
    await this.docClient.put({
      TableName: this.imagesTable,
      Item: image
    }).promise()

    return image
  }

  getUploadUrl(imageId: string) {
    return this.s3.getSignedUrl('putObject', {
      Bucket: this.bucketName,
      Key: imageId,
      Expires: parseInt(this.urlExpiration)
    })
  }

  async getImages(groupId: string): Promise<Image[]> {
    console.log(this.imageIdIndex)
    const result = await this.docClient.query({
      TableName: this.imagesTable,
      KeyConditionExpression: 'groupId = :groupId',
      ExpressionAttributeValues: {
        ':groupId': groupId
      }
    }).promise()
    const items = result.Items
    return items as Image[]
  }

  async getImage(imageId: string): Promise<Image> {
    const result = await this.docClient.query({
        TableName : this.imagesTable,
        IndexName : this.imageIdIndex,
        KeyConditionExpression: 'imageId = :imageId',
        ExpressionAttributeValues: {
            ':imageId': imageId
        }
    }).promise()
    if (result.Count !== 0) {
      return result.Items[0] as Image
    }
  }

  async deleteImage(image: Image) {
    const params = {
      TableName : this.imagesTable,
      Key: {
        groupId: image.groupId,
        timestamp: image.timestamp
      }
    }
    await this.docClient.delete(params).promise()
  }
}

function createDynamoDBClient() {
  if (process.env.IS_OFFLINE) {
    console.log('Creating a local DynamoDB instance')
    return new XAWS.DynamoDB.DocumentClient({
      region: 'localhost',
      endpoint: 'http://localhost:8000'
    })
  }

  return new XAWS.DynamoDB.DocumentClient()
}