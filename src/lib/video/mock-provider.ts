import { randomUUID } from "crypto";
import type {
  CreateVideoRoomInput,
  CreateVideoRoomResult,
  VideoSessionProvider,
} from "@/lib/video/types";

export class MockVideoSessionProvider implements VideoSessionProvider {
  readonly name = "mock";

  async createRoom(input: CreateVideoRoomInput): Promise<CreateVideoRoomResult> {
    void input;
    const providerSessionId = `mock_room_${randomUUID()}`;
    return {
      provider: this.name,
      providerSessionId,
      joinUrl: `/community/video/${providerSessionId}`,
    };
  }
}
