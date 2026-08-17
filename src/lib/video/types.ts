export type CreateVideoRoomInput = {
  sessionId: string;
  startsAt?: Date | null;
};

export type CreateVideoRoomResult = {
  provider: string;
  providerSessionId: string;
  joinUrl: string;
};

export type VideoSessionProvider = {
  readonly name: string;
  createRoom(input: CreateVideoRoomInput): Promise<CreateVideoRoomResult>;
};
