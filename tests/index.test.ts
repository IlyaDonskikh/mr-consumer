import { BasePublisher } from './samples/base.publisher';
import { faker } from '@faker-js/faker';
import amqp from 'amqplib';
import { NoChannelPublisher } from './samples/noChannel.publisher';
import { NoQueueNamePublisher } from './samples/noQueueName.publisher';

// Mock amqplib
jest.mock('amqplib', () => ({
  __esModule: true,
  default: {
    connect: jest.fn(),
  },
}));

describe('MrPublisher', () => {
  it('success', async () => {
    const text = faker.lorem.word();
    const payload = { text };
    const mockChannel = {
      assertQueue: jest.fn().mockResolvedValue(undefined),
      sendToQueue: jest.fn(),
    };

    const mockConnection = {
      createChannel: jest.fn().mockResolvedValue(mockChannel),
    };

    (amqp.connect as jest.Mock).mockResolvedValue(mockConnection);

    await BasePublisher.publish({ payload });

    // Verify the mocks were called correctly
    expect(amqp.connect).toHaveBeenCalled();
    expect(mockConnection.createChannel).toHaveBeenCalled();
    expect(mockChannel.assertQueue).toHaveBeenCalledWith('base.publisher', {
      durable: true,
    });
    expect(mockChannel.sendToQueue).toHaveBeenCalledWith(
      'base.publisher',
      Buffer.from(JSON.stringify(payload)),
    );
  });

  describe('when setupChannel method is not implemented', () => {
    it('should throw an error', () => {
      const text = faker.lorem.word();
      const payload = { text };

      expect(NoChannelPublisher.publish({ payload })).rejects.toThrow(
        '[MrPublisher][setupChannel] Method not implemented',
      );
    });
  });

  describe('when queue name is not provided', () => {
    it('should throw an error', () => {
      const text = faker.lorem.word();
      const payload = { text };

      expect(NoQueueNamePublisher.publish({ payload })).rejects.toThrow(
        '[MrPublisher][validateQueueName] Queue name is required',
      );
    });
  });
});
