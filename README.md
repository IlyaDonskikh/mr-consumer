# Mr.Consumer

![Node.js CI Tests](https://github.com/IlyaDonskikh/mr-consumer/actions/workflows/node.js.yml/badge.svg?branch=main)

Effortlessly publish your data to RabbitMQ with a clean, TypeScript-friendly API.

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
npm i mr-publisher
```

And use it where you need it.

```typescript
import { MrConsumer } from 'mr-publisher';
```

#### Setup

To get started, simply connect a RabbitMQ channel to your Mr.Consumer and define your list of possible queues.

```typescript
import { MrConsumer } from 'mr-publisher';
import { rabbitMQ } from './rabbitMQ';

enum MessageBrokerQueue {
  coreMessageCreated = 'core.message.created',
  telegramTelegramMessagesCreated = 'telegram.telegramMessage.created',
}

export function Consumer<Payload extends object>() {
  return class Consumer extends MrConsumer<Payload, MessageBrokerQueue>() {
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
import { MessageBrokerQueue } from '../utils/mr.publisher';

interface Payload {
  message: {
    uuid: string;
  };
}

export class SampleMessageCreatedConsumer extends Consumer<Payload>() {
  queueName = MessageBrokerQueue.coreMessageCreated;
}
```

Now you can safely publish your data from anywhere in your code:

```typescript
const message = { uuid: '94e95f6f-b49f-482f-96d5-410b21edf9c0' };

await SampleMessageCreatedConsumer.publish({
  payload: {
    message: {
      uuid: message.uuid,
    },
  },
});
```

As you can see, the code is pretty simple and easy to user.

Now let's see how we may use it in the positive scenario:

Let's make a conclusion.

> ⚠️ At this moment you probably would like to see an integration of the module to something more ready to use. And specifically for this purpose [🐨 Mr.Koa boilerplate](https://github.com/IlyaDonskikh/mrkoa) exists.

## Conclusion

Using publishers makes your workflow simpler, more organized, and efficient. `Mr.Consumer` offers an intuitive interface so you can enjoy these benefits without any hassle.

Give it a try!
