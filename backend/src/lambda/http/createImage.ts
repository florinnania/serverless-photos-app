import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import 'source-map-support/register'

import { CreateImageRequest } from '../../requests/CreateImageRequest'
import {groupExists} from '../../businessLogic/groups'
import { createImage, getUploadUrl } from '../../businessLogic/images'

import * as middy from 'middy'
import { cors } from 'middy/middlewares'


export const handler = middy(async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  console.log('Caller event', event)

  const authorization = event.headers.Authorization
  const split = authorization.split(' ')
  const jwtToken = split[1]
  const groupId = event.pathParameters.groupId
  const validGroupId = await groupExists(groupId, jwtToken)

  if (!validGroupId) {
    return {
      statusCode: 404,
      body: JSON.stringify({
        error: 'Group does not exist'
      })
    }
  }

  const newImage: CreateImageRequest = JSON.parse(event.body)
  const newItem = await createImage(newImage, groupId, jwtToken)

  const url = getUploadUrl(newItem.imageId)

  return {
    statusCode: 201,
    body: JSON.stringify({
      newItem: newItem,
      uploadUrl: url
    })
  }
})

handler.use(
  cors({
    credentials: true
  })
)
