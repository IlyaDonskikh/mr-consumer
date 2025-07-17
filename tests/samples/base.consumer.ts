import { MrConsumer } from '../../src';
import amqp, { Channel } from 'amqplib';

interface ConsumerResponse {
  text: string;
}

enum MessageBrokerQueue {
  consumerQueue = 'consumer.queue',
}

export class BaseConsumer extends MrConsumer<
  ConsumerResponse,
  MessageBrokerQueue
>() {
  queueName: MessageBrokerQueue = MessageBrokerQueue.consumerQueue;

  async setupChannel() {
    return createChannel();
  }

  async handleMessage() {
    this.messageCheckHelper({ message: this.message });
  }

  async messageCheckHelper({ message }: { message: ConsumerResponse }) {
    void message;
  }
}

// helpers

async function createChannel() {
  const rabbitUrl = process.env.RABBITMQ_URL ?? '';
  const connection = await amqp.connect(rabbitUrl);

  return connection.createChannel();
}
