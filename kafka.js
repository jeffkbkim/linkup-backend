const kafka = require('kafka-node');
const kafkaHost = 'localhost:9092';
const client = new kafka.KafkaClient({kafkaHost: kafkaHost});
const producer = new kafka.HighLevelProducer(client);
const offset = new kafka.Offset(client);
const topic_prefix = 'userId_';
let map = {};

function createTopic(userId) {
  const topicName = topic_prefix + userId;
  client.loadMetadataForTopics([topicName], (err, response) => {});
}

function writeToTopic(userId, position) {
  const topicName = topic_prefix + userId;
  console.log('topicName:',topicName);
  producer.send([{
    topic: topicName,
    messages: JSON.stringify(position)
  }], (err, data) => {
    console.log('sent to topic ' + topicName, data);
  })
}

function getLastPosition(userId, callback) {
  offset.fetch([{ topic: topic_prefix + userId, time: -1 }], (err, data) => {
    if (err) {
      console.log('err', err);
      return;
    }
    const topicName = topic_prefix + userId;

    return getPositionFromOffset(data, topicName, callback);
    
  });
}

function getPositionFromOffset(data, topicName, callback) {
  console.log('getting last position from topic: ', topicName);

    const obj = data[topicName];
    const partition = Object.keys(obj)[0];
    const off = obj[partition][0];
    console.log(parseInt(partition), typeof(parseInt(partition)), off, typeof(off));
    const consumerOptions = {
      groupId: topicName,
      fromOffset: true
    }
    const consumer = new kafka.Consumer(client, [{ 
      topic: topicName,
      partition: parseInt(partition),
      offset: off < 1 ? 0 : off - 1
    }], consumerOptions);
    consumer.on('error', (error) => {
      console.log('error: ', error);
    });
    consumer.on('offsetOutOfRange', (error) => {
      console.log('error: ', error);
    });
    consumer.on('message', (message) => {
      console.log('message: ', message);
      consumer.pause();
      return callback(message);
    });
}

module.exports.createTopic = createTopic;
module.exports.writeToTopic = writeToTopic;
module.exports.getLastPosition = getLastPosition;