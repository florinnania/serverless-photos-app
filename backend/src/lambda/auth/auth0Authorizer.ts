
import { CustomAuthorizerEvent, CustomAuthorizerResult } from 'aws-lambda'
import 'source-map-support/register'

import { verify } from 'jsonwebtoken'
import { JwtToken } from '../../auth/JwtToken'

const cert = `-----BEGIN CERTIFICATE-----
MIIDDTCCAfWgAwIBAgIJdVlKUvEj8Jk1MA0GCSqGSIb3DQEBCwUAMCQxIjAgBgNV
BAMTGWRldi1mbmEtYXV0aC51cy5hdXRoMC5jb20wHhcNMjEwMTE4MTcwMTA2WhcN
MzQwOTI3MTcwMTA2WjAkMSIwIAYDVQQDExlkZXYtZm5hLWF1dGgudXMuYXV0aDAu
Y29tMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAqdO7Zw9LZWYp1iIl
ScGUaG+MueeJ1OEyqoHpoxmXydGlV+zOvs4xW5dv5X4uQerAlWPaBBZPNP29A06p
kDE07N+yjUnklwg1NlA2YceSjWp3xJxWKJQMt2hZrD/OD36zL4dF2ZzadR8bgreK
Gkez4oPqJXN51/kOI0HwXWkizAuR+RYKzBCHILFjcW4dLE79ItJop5x/G+2yatPS
XAlXghcbSwIQDtJ+gTGT3Kf05Ee2LLfcZWwBz47ziGEKesf8TVe8ZwHyqlLa7wUO
YpkbcfjGTRxBSJfYCNQMsVX+hfBQdSg9Z+yrJY7lXGVVyUVFiNGTM1SqfBB8L0DH
vNP1AwIDAQABo0IwQDAPBgNVHRMBAf8EBTADAQH/MB0GA1UdDgQWBBQ4+ofCoTqc
s9yx+/OEyFDRD7M8WzAOBgNVHQ8BAf8EBAMCAoQwDQYJKoZIhvcNAQELBQADggEB
AHlhxN8emzrqCjebWGBZ/i0BKDlHmEUIVXZE1xkRu1H636wh09GKLFol0+QQFISq
YoUaT9IKnXQ/jc+S+B9cfn731yFQuIdos12wgJcOaxSWvtk5Ei7A52NmgQ+NwMkN
zkYMV7ojLO5jp3AocI3rfQeljZaYLSEcSMrAr2GnDn4DXKcoGbAqS8/JfOaEov5t
hPNb3XXHiCnfmkFjmAA8lNGpJpEEENnRXgqIozxy+wapljzYYSB3YkfvQWUQltV0
dGwP+Xxq2Mk/2B5IDdg34tlM+TT62csY6ZxMYFNVKi/snJjDop6KnDvcUD3VW91K
lcYLvy+cvn7ysk/LaxYYs+A=
-----END CERTIFICATE-----`

export const handler = async (event: CustomAuthorizerEvent): Promise<CustomAuthorizerResult> => {
  try {
    const jwtToken = verifyToken(event.authorizationToken)
    console.log('User was authorized', jwtToken)

    return {
      principalId: jwtToken.sub,
      policyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Action: 'execute-api:Invoke',
            Effect: 'Allow',
            Resource: '*'
          }
        ]
      }
    }
  } catch (e) {
    console.log('User authorized', e.message)

    return {
      principalId: 'user',
      policyDocument: {
        Version: '2012-10-17',
        Statement: [
          {
            Action: 'execute-api:Invoke',
            Effect: 'Deny',
            Resource: '*'
          }
        ]
      }
    }
  }
}

function verifyToken(authHeader: string): JwtToken {
  if (!authHeader)
    throw new Error('No authentication header')

  if (!authHeader.toLowerCase().startsWith('bearer '))
    throw new Error('Invalid authentication header')

  const split = authHeader.split(' ')
  const token = split[1]

  return verify(token, cert, { algorithms: ['RS256'] }) as JwtToken
}
