import { MrPublisher } from '../../src';
import amqp, { Channel } from 'amqplib';

interface Payload {
  text: string;
}

enum MessageBrokerQueue {
  basePublisher = 'base.publisher',
}

export class BasePublisher extends MrPublisher<Payload, MessageBrokerQueue>() {
  queueName: MessageBrokerQueue = MessageBrokerQueue.basePublisher;

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
