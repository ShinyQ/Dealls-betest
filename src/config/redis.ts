import { createClient } from "redis";
import { REDIS_URL } from "./env";

class RedisUtils {
  private client: any = createClient({ url: REDIS_URL });

  async get(key: string): Promise<string | null> {
    await this.client.connect();
    const data = await this.client.get(key);
    await this.client.disconnect();

    return data;
  }

  async set(key: string, value: any, timeoutSeconds?: number): Promise<void> {
    await this.client.connect();

    if (!timeoutSeconds) {
      timeoutSeconds = 3600;
    }

    await this.client.set(key, value, "EX", timeoutSeconds);
    await this.client.disconnect();
  }

  async delete(key: string): Promise<void> {
    await this.client.connect();
    await this.client.del(key);
    await this.client.disconnect();
  }
}

export default new RedisUtils();
