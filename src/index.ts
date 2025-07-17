import { R } from '@faker-js/faker/dist/airline-CLphikKp';
import { Channel } from 'amqplib';

// have to define interface because declaration option is true
export interface MrConsumerInterface<R, Q> {
  new (): {
    queueName: Q;
    message: R;
    handleMessage(): Promise<void>;
  };
  consume(): Promise<void>;
}

export function MrConsumer<R extends object, Q extends string>() {
  return class BasePublisher {
    channel: Channel;
    message: R;
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
          this.message = JSON.parse(msg.content.toString());

          await this.consumeMessage();

          this.channel.ack(msg);
        }
      });
    }

    async consumeMessage() {
      if (!this.message)  return;

      await this.handleMessage();
    }

    async handleMessage() {
      throw new Error('[Consumer][handleMessage] Method not implemented.');
    }

    async attachChannel() {
      this.channel = await this.setupChannel();
    }

    validate() {
      this.validateQueueName();
    }

    validateQueueName() {
      if (this.queueName) return;

      throw new Error(
        '[MrConsumer][validateQueueName] Queue name is required',
      );
    }

    async setupChannel(): Promise<Channel> {
      throw new Error('[MrConsumer][setupChannel] Method not implemented');
    }
  };
}
