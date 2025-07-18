# Mr.Consumer

![Node.js CI Tests](https://github.com/IlyaDonskikh/mr-consumer/actions/workflows/node.js.yml/badge.svg?branch=main)

Effortlessly consume your data from RabbitMQ with a clean, TypeScript-friendly API.

<img width="200" alt="Mr.Consumer" src="https://user-images.githubusercontent.com/3100222/118412068-9bcf2a80-b6a0-11eb-8977-98c66c165052.png">

## Introduction

The MrConsumer layer allows you to achieve significant benefits in the following parts of writing code:

- Make development process clear for all participants
- Speed up the development of production-ready projects
- Avoid complexity
- Reduce coupling

So, developers and Mr.Consumer have to be friends🤝 forever at least for reasons outlined above.

## Installation

Just one step.

```shell
npm i mr-consumer
```

And use it where you need it.

```typescript
import { MrConsumer } from 'mr-consumer';
```

#### Setup

To get started, simply connect a RabbitMQ channel to your Mr.Consumer and define your list of possible queues.

```typescript
import { MrConsumer } from 'mr-consumer';
import { rabbitMQ } from './rabbitMQ';

enum MessageBrokerQueue {
  coreMessageCreated = 'core.message.created',
}

export function Consumer<ConsumerResponse extends object>() {
  return class Consumer extends MrConsumer<
    ConsumerResponse,
    MessageBrokerQueue
  >() {
    async setupChannel() {
      return rabbitMQ.getChannel();
    }
  };
}
```

You can configure RabbitMQ however you prefer for use with MrConsumer.

<details>
<summary>Here is an example of a working setup.</summary>

```typescript
import amqp, { Channel, ChannelModel } from 'amqplib';

let connection: ChannelModel;
let channel: Channel;

async function getConnection(): Promise<amqp.ChannelModel> {
  if (!connection) {
    const rabbitUrl = process.env.RABBITMQ_URL ?? '';
    connection = await amqp.connect(rabbitUrl);
  }

  return connection;
}

async function getChannel(): Promise<Channel> {
  if (!channel) {
    const conn = await getConnection();
    channel = await conn.createChannel();
  }

  return channel;
}

const rabbitMQ = {
  getConnection,
  getChannel,
};

export { rabbitMQ };
```

</details>

## Overview

This section contains a simple case that shows us an example of `Mr.Consumer` implementation. Let's take a quick look at the following piece of code:

```typescript
import { MessageBrokerQueue } from '../utils/mr.consumer';

interface ConsumerResponse {
  message: {
    uuid: string;
  };
}

export class SampleMessageCreatedConsumer extends Consumer<ConsumerResponse>() {
  queueName = MessageBrokerQueue.coreMessageCreated;

  async handlePayload() {
    // Process the received message
    const { message } = this.message;
    // Your business logic here
    await this.processMessage(message);
  }

  private async processMessage(message: { uuid: string }) {
    // Implement your message processing logic
    // For example: save to database, send notifications, etc.
  }
}
```

Now you can start consuming messages from the queue:

```typescript
await SampleMessageCreatedConsumer.consume();
```

As you can see, the code is pretty simple and easy to user.

Now let's see how we may use it in the positive scenario:

## Conclusion

Using consumers makes your workflow simpler, more organized, and efficient. `Mr.Consumer` offers an intuitive interface so you can enjoy these benefits without any hassle.

Give it a try!

> ⚠️ At this moment you probably would like to see an integration of the module to something more ready to use. And specifically for this purpose [🐨 Mr.Koa boilerplate](https://github.com/IlyaDonskikh/mrkoa) exists.
