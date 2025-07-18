import { Channel } from 'amqplib';

// have to define interface because declaration option is true
export interface MrConsumerInterface<P, Q> {
  new (): {
    queueName: Q;
    payload: P;
    handlePayload(): Promise<void>;
  };
  consume(): Promise<void>;
}

export function MrConsumer<P extends object, Q extends string>() {
  return class BasePublisher {
    channel: Channel;
    payload: P;
    queueName: Q;

    static async consume() {
      return new this().consume();
    }

    async consume() {
      this.validate();
      await this.attachChannel();

      await this.channel.assertQueue(this.queueName, { durable: true });

      await this.channel.consume(this.queueName, async (msg) => {
        if (msg) {
          this.payload = JSON.parse(msg.content.toString());

          await this.consumePayload();

          this.channel.ack(msg);
        }
      });
    }

    async consumePayload() {
      if (!this.payload) return;

      await this.handlePayload();
    }

    async handlePayload() {
      throw new Error('[MrConsumer][handlePayload] Method not implemented');
    }

    async attachChannel() {
      this.channel = await this.setupChannel();
    }

    validate() {
      this.validateQueueName();
    }

    validateQueueName() {
      if (this.queueName) return;

      throw new Error('[MrConsumer][validateQueueName] Queue name is required');
    }

    async setupChannel(): Promise<Channel> {
      throw new Error('[MrConsumer][setupChannel] Method not implemented');
    }
  };
}
