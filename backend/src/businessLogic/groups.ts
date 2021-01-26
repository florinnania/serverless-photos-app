import * as uuid from 'uuid'

import { Group } from '../models/Group'
import { GroupAccess } from '../dataLayer/groupsAccess'
import { CreateGroupRequest } from '../requests/CreateGroupRequest'
import { getUserId } from '../auth/utils'

const groupAccess = new GroupAccess()

export async function getGroups(jwtToken: string): Promise<Group[]> {
  const userId = getUserId(jwtToken)
  return groupAccess.getGroups(userId)
}

export async function createGroup(
  createGroupRequest: CreateGroupRequest,
  jwtToken: string
): Promise<Group> {

  const itemId = uuid.v4()
  const userId = getUserId(jwtToken)

  return await groupAccess.createGroup({
    id: itemId,
    userId: userId,
    name: createGroupRequest.name,
    description: createGroupRequest.description,
    timestamp: new Date().toISOString()
  })
}

export async function groupExists (
  groupId: string,
  jwtToken: string
): Promise<boolean> {
  const userId = getUserId(jwtToken)
  return await groupAccess.groupExists(
    userId,
    groupId
  )
}

export async function getGroup (
  groupId: string,
  jwtToken: string
): Promise<Group> {
  const userId = getUserId(jwtToken)
  return await groupAccess.getGroup(
    userId,
    groupId
  )
}
