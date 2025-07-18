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

  async handlePayload() {
    this.payloadCheckHelper({ payload: this.payload });
  }

  async payloadCheckHelper({ payload }: { payload: ConsumerResponse }) {
    void payload;
  }
}

// helpers

async function createChannel() {
  const rabbitUrl = process.env.RABBITMQ_URL ?? '';
  const connection = await amqp.connect(rabbitUrl);

  return connection.createChannel();
}
