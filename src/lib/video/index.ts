import { MockVideoSessionProvider } from "@/lib/video/mock-provider";
import type { VideoSessionProvider } from "@/lib/video/types";

export function getVideoSessionProvider(): VideoSessionProvider {
  switch (process.env.VIDEO_PROVIDER ?? "mock") {
    case "mock":
      return new MockVideoSessionProvider();
    default:
      throw new Error(`Unknown video provider: ${process.env.VIDEO_PROVIDER}`);
  }
}

export * from "@/lib/video/types";
