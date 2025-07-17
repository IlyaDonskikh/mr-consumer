import { MrPublisher } from '../../src';
import amqp, { Channel } from 'amqplib';

interface Payload {
  text: string;
}

enum MessageBrokerQueue {
  basePublisher = 'base.publisher',
}

export class NoQueueNamePublisher extends MrPublisher<
  Payload,
  MessageBrokerQueue
>() {}
