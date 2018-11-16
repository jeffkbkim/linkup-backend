// const app = require('express')
// const http = require('http').Server(app)
// const io = require('socket.io')(http)
const kafka = require('kafka-node')

// function callSockets (io, message) {
//   io.sockets.emit('channel', message)
// }

// const kafkaClient = new kafka.KafkaClient()
const client = new kafka.Client()
let producer = new kafka.HighLevelProducer(client)
let consumer = new kafka.HighLevelConsumer(client, [{ topic: 'topic3' }, { topic: 'topic4' }])
consumer.on('message', (message) => {
  console.log(message)
})
producer.on('ready', () => {
  console.log('ready')
})
producer.on('error', () => {
  console.log('err')
})
const record = [
  {
    topic: 'topic3',
    messages: ['hi'],
    attributes: 1 /* Use GZip compression for the payload */
  }
]
const topicsToCreate = [{
  topic: 'topic1',
  partitions: 2,
  replicationFactor: 1
},
{
  topic: 'topic2',
  partitions: 2,
  replicationFactor: 1
}]

const newTopics = ['topic3', 'topic4']

client.on('ready', () => {
  initTopics()
})

function initTopics () {
  client.createTopics(newTopics, (err, result) => {
    if (err) console.log('err', err)
    else {
      console.log('result', result)
      initProducers()
    }
  })
}

function initProducers () {
  // const producer = new kafka.HighLevelProducer(client)

  producer.send(record, (err, result) => {
    if (err) console.log('err', err)
    else {
      console.log('result', result)
    }
  })
}

// kafkaClient.on('ready', (err, result) => {
//   if (err) {
//     console.log('err.')
//     console.log(err)
//   } else {
//     kafkaClient.createTopics(topicsToCreate, (error, result) => {
//       // result is an array of any errors if a given topic could not be created
//       console.log('here.')
//       if (error) console.log('err', error)
//       else console.log('result', result)
//     })
//   }
// })

// const consumer1 = new kafka.ConsumerGroup({
//   kafkaHost: 'localhost:2181'
// }, 'topic12')
// const consumer2 = new kafka.ConsumerGroup()

// consumer1.on('message', function (message) {
//   console.log(message)
//   callSockets(io, message)
// })
// consumer2.on('message', function (message) {
//   console.log(message)
//   callSockets(io, message)
// })
// const producer = new kafka.HighLevelProducer(new kafka.Client())

// const payloads = [
//   { topic: 'topic1', messages: 'hi' },
//   { topic: 'topic2', messages: ['hello', 'world'] }
// ]

// producer.on('ready', function () {
//   console.log('in producer ready.')
//   producer.send(payloads, function (err, data) {
//     if (err) { console.log(err) } else { console.log(data) }
//   })
// })
