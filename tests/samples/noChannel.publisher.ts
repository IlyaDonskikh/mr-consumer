import { MrPublisher } from '../../src';
import amqp, { Channel } from 'amqplib';

interface Payload {
  text: string;
}

enum MessageBrokerQueue {
  basePublisher = 'base.publisher',
}

export class NoChannelPublisher extends MrPublisher<
  Payload,
  MessageBrokerQueue
>() {
  queueName: MessageBrokerQueue = MessageBrokerQueue.basePublisher;
}
