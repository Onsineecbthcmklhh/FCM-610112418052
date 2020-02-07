const admin = require('firebase-admin')
const { google } = require('googleapis')
const axios = require('axios')

const MESSAGING_SCOPE = 'https://www.googleapis.com/auth/firebase.messaging'
const SCOPES = [MESSAGING_SCOPE]

const serviceAccount = require('./fcm-c0303-firebase-adminsdk-ex103-36dddbcd4f.json')
const databaseURL = 'https://fcm-c0303.firebaseio.com'
const URL =
  'https://fcm.googleapis.com/v1/projects/fcm-c0303/messages:send'
const deviceToken =
  'f8TDbc2r0DCe9sgc3rEXMt:APA91bGu1ZemJrWGOJr-dGG9uyQzLMudljE8wSzLu8gprrVa6f7iplBsDHOUSu_9FGYyYqaPXcbVyxfrFUDHi78-d62Ks2TA4HGP3uoW-Im0_n7YaX93D5CRzCmiZLfzsfXzbC4HwfFt'

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: databaseURL
})

function getAccessToken() {
  return new Promise(function(resolve, reject) {
    var key = serviceAccount
    var jwtClient = new google.auth.JWT(
      key.client_email,
      null,
      key.private_key,
      SCOPES,
      null
    )
    jwtClient.authorize(function(err, tokens) {
      if (err) {
        reject(err)
        return
      }
      resolve(tokens.access_token)
    })
  })
}

async function init() {
  const body = {
    message: {
      data: { key: 'value' },
      notification: {
        title: 'Notification title',
        body: 'Notification body'
      },
      webpush: {
        headers: {
          Urgency: 'high'
        },
        notification: {
          requireInteraction: 'true'
        }
      },
      token: deviceToken
    }
  }

  try {
    const accessToken = await getAccessToken()
    console.log('accessToken: ', accessToken)
    const { data } = await axios.post(URL, JSON.stringify(body), {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`
      }
    })
    console.log('name: ', data.name)
  } catch (err) {
    console.log('err: ', err.message)
  }
}

init()