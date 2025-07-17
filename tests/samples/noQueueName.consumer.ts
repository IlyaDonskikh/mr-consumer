import { MrConsumer } from '../../src';

interface Payload {
  text: string;
}

enum MessageBrokerQueue {
  consumerQueue = 'consumer.queue',
}

export class NoQueueNameConsumer extends MrConsumer<
  Payload,
  MessageBrokerQueue
>() {}
