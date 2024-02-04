import { connect, Channel, ConsumeMessage } from 'amqplib';
import { Rabbit } from './entities/rabbitconsumer';
import { Injectable } from '@nestjs/common';

@Injectable()
export class RabbitConsumer {

  async  startConsumer(): Promise<Rabbit> {
    try {


      const connection = await connect('amqp://guest:guest@rabbitmq');
      const channel = await connection.createChannel();
      const queueName = 'users_queue';
  
      await channel.assertQueue(queueName);
  
      console.log('Waiting for messages...');
  
      const receivedMessagePromise = new Promise<Rabbit>((resolve, reject) => {
        channel.consume(queueName, (message: ConsumeMessage | null) => {
          if (message) {
            const content = message.content.toString();
            const parsedMessage = JSON.parse(content);


            const { userId: userid, message: msg } = parsedMessage;

            
  
            //var receivedMessage = new Rabbit(userid, msg);
  
            console.log('Received message:', parsedMessage);
  
            channel.ack(message); // Acknowledge the message to remove it from the queue
  
            resolve(parsedMessage);
          }
        });
  
        // Reject the promise if the consumer gets cancelled or an error occurs
        channel.on('cancel', () => reject(new Error('Consumer was cancelled')));
        channel.on('error', (error) => reject(error));
      });
  
      return receivedMessagePromise;
    } catch (error) {
      console.error('Failed to connect to RabbitMQ:', error);
      throw error;
    }
  }

}
    