import * as uuid from 'uuid'

import { Image } from '../models/Image'
import { ImagesAccess } from '../dataLayer/imagesAccess'
import { CreateImageRequest } from '../requests/CreateImageRequest'
import { getUserId } from '../auth/utils'

const bucketName = process.env.IMAGES_S3_BUCKET

const imagesAccess = new ImagesAccess()

export async function createImage(
  createImageRequest: CreateImageRequest, 
  groupId: string,
  jwtToken: string
): Promise<Image> {

  const imageId = uuid.v4()
  const userId = getUserId(jwtToken)

  return await imagesAccess.createImage({
    groupId: groupId,
    userId: userId,
    timestamp: new Date().toISOString(),
    imageId: imageId,
    title: createImageRequest.title,
    imageUrl: `https://${bucketName}.s3.amazonaws.com/${imageId}`
  })
}

export function getUploadUrl(imageId: string) {
  return imagesAccess.getUploadUrl(imageId)
}

export async function getImages(groupId: string): Promise<Image[]> {
    return imagesAccess.getImages(groupId)
}

export async function getImage(imageId: string): Promise<Image> {
  return imagesAccess.getImage(imageId)
}

export async function deleteImage(image: Image) {
  return imagesAccess.deleteImage(image)
}

