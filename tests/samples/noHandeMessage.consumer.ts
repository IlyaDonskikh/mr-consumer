import { MrConsumer } from '../../src';
import amqp, { Channel } from 'amqplib';

interface ConsumerResponse {
  text: string;
}

enum MessageBrokerQueue {
  consumerQueue = 'consumer.queue',
}

export class NohandlePayloadConsumer extends MrConsumer<
  ConsumerResponse,
  MessageBrokerQueue
>() {
  queueName: MessageBrokerQueue = MessageBrokerQueue.consumerQueue;

  async setupChannel() {
    return createChannel();
  }
}

// helpers

async function createChannel() {
  const rabbitUrl = process.env.RABBITMQ_URL ?? '';
  const connection = await amqp.connect(rabbitUrl);

  return connection.createChannel();
}
