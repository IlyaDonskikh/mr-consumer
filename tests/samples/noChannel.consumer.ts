import { MrConsumer } from '../../src';
import amqp, { Channel } from 'amqplib';

interface Payload {
  text: string;
}

enum MessageBrokerQueue {
  consumerQueue = 'consumer.queue',
}

export class NoChannelConsumer extends MrConsumer<
  Payload,
  MessageBrokerQueue
>() {
  queueName: MessageBrokerQueue = MessageBrokerQueue.consumerQueue;
}
