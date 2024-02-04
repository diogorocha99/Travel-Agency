import { Injectable } from '@nestjs/common';
import { connect, Channel, Connection } from 'amqplib';
import axios from 'axios';

@Injectable()
export class RabbitMQService {
  private readonly QUEUE_NAME = 'users_queue';
  private connection: Connection;
  private channel: Channel;
  private connected = false;


  async connect() {
    try {
      let connectionString;
  
      //if (process.env.DOCKER === 'true') {
        // Running inside a Docker container
        connectionString = 'amqp://guest:guest@rabbitmq';
      // } else {
      //   // Not running inside a Docker container
      //   connectionString = 'amqp://guest:guest@localhost:5672';
      // }
  
      this.connection = await connect(connectionString);
      this.channel = await this.connection.createChannel();
      await this.channel.assertQueue(this.QUEUE_NAME);
      this.connected = true;
      console.log('RabbitMQ connection established.');
    } catch (error) {
      console.error('Failed to connect to RabbitMQ:', error);
    }
  }
  
  async sendMessage(userid: string, msg: string) {
    if (this.channel) {
      const content = JSON.stringify({ userid, msg });
      this.channel.sendToQueue('users_queue', Buffer.from(content));
    } else {
      console.error('Channel is not defined.');
    }
  }
  
  async callLogsApi() {
    const url = 'http://host.docker.internal:3005/rabbit';
    const headers = { 'Content-Type': 'application/json' };
  
    try {
      const response = await axios.post(url, null, { headers });
      console.log('Response:', response.data);
    } catch (error) {
      console.error('Error:', error.message);
    }
  }

}