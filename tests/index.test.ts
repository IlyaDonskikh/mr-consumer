import { BaseConsumer } from './samples/base.consumer';
import { faker } from '@faker-js/faker';
import amqp from 'amqplib';
import { NoChannelConsumer } from './samples/noChannel.consumer';
import { NoQueueNameConsumer } from './samples/noQueueName.consumer';
import { NoHandleMessageConsumer } from './samples/noHandeMessage.consumer';

// Mock amqplib
jest.mock('amqplib', () => ({
  __esModule: true,
  default: {
    connect: jest.fn(),
  },
}));

describe('MrConsumer', () => {
  it('success', async () => {
    const text = faker.lorem.word();
    const payload = { text };
    let consumeCallback: ((msg: any) => void) | null = null;

    const mockChannel = {
      assertQueue: jest.fn().mockResolvedValue(undefined),
      consume: jest.fn().mockImplementation((queueName, callback) => {
        consumeCallback = callback;
      }),
      ack: jest.fn(),
    };

    const mockConnection = {
      createChannel: jest.fn().mockResolvedValue(mockChannel),
    };

    (amqp.connect as jest.Mock).mockResolvedValue(mockConnection);

    // Spy on messageCheckHelper
    const messageCheckHelperSpy = jest.spyOn(
      BaseConsumer.prototype,
      'messageCheckHelper',
    );

    await BaseConsumer.consume();

    // Verify the mocks were called correctly
    expect(amqp.connect).toHaveBeenCalled();
    expect(mockConnection.createChannel).toHaveBeenCalled();
    expect(mockChannel.assertQueue).toHaveBeenCalledWith('consumer.queue', {
      durable: true,
    });
    expect(mockChannel.consume).toHaveBeenCalledWith(
      'consumer.queue',
      expect.any(Function),
    );

    // Simulate a message being received
    const mockMessage = {
      content: Buffer.from(JSON.stringify(payload)),
    };

    // Since handleMessage does not throw anymore, just call the callback
    await consumeCallback!(mockMessage);

    // Ensure messageCheckHelper was called with the correct argument
    expect(messageCheckHelperSpy).toHaveBeenCalledWith({ message: payload });

    // Ensure that ack is called
    expect(mockChannel.ack).toHaveBeenCalled();

    // Clean up the spy
    messageCheckHelperSpy.mockRestore();
  });

  describe('when message is not sent', () => {
    it('should not call handleMessage', async () => {
      let consumeCallback: ((msg: any) => void) | null = null;

      const mockChannel = {
        assertQueue: jest.fn().mockResolvedValue(undefined),
        consume: jest.fn().mockImplementation((queueName, callback) => {
          consumeCallback = callback;
        }),
        ack: jest.fn(),
      };

      const mockConnection = {
        createChannel: jest.fn().mockResolvedValue(mockChannel),
      };

      (amqp.connect as jest.Mock).mockResolvedValue(mockConnection);

      // Spy on handleMessage to ensure it's not called
      const handleMessageSpy = jest.spyOn(
        BaseConsumer.prototype,
        'handleMessage',
      );

      await BaseConsumer.consume();

      // Simulate a message being received with null content (results in falsy message)
      const mockMessage = {
        content: Buffer.from('null'),
      };

      // Call the callback with null message
      await consumeCallback!(mockMessage);

      // Ensure handleMessage was NOT called because message is null
      expect(handleMessageSpy).not.toHaveBeenCalled();

      // Clean up the spy
      handleMessageSpy.mockRestore();
    });
  });

  describe('when handleMessage method is not implemented', () => {
    it('should throw an error', async () => {
      let consumeCallback: ((msg: any) => void) | null = null;

      const mockChannel = {
        assertQueue: jest.fn().mockResolvedValue(undefined),
        consume: jest.fn().mockImplementation((queueName, callback) => {
          consumeCallback = callback;
        }),
        ack: jest.fn(),
      };

      const mockConnection = {
        createChannel: jest.fn().mockResolvedValue(mockChannel),
      };

      (amqp.connect as jest.Mock).mockResolvedValue(mockConnection);

      // Start consuming
      await NoHandleMessageConsumer.consume();

      // Simulate a message being received to trigger handleMessage
      const mockMessage = {
        content: Buffer.from(JSON.stringify({ text: 'test' })),
      };

      // This should throw the error from handleMessage
      await expect(consumeCallback!(mockMessage)).rejects.toThrow(
        '[MrConsumer][handleMessage] Method not implemented',
      );
    });
  });

  describe('when setupChannel method is not implemented', () => {
    it('should throw an error', () => {
      expect(NoChannelConsumer.consume()).rejects.toThrow(
        '[MrConsumer][setupChannel] Method not implemented',
      );
    });
  });

  describe('when queue name is not provided', () => {
    it('should throw an error', () => {
      expect(NoQueueNameConsumer.consume()).rejects.toThrow(
        '[MrConsumer][validateQueueName] Queue name is required',
      );
    });
  });
});
