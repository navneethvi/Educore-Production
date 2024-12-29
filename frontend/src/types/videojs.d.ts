declare module 'video.js' {
    export interface VideoJsPlayer {
      play(): void;
      pause(): void;
      dispose(): void;
      on(event: string, callback: () => void): void;
    }
  
    export interface PlayerOptions {
      autoplay?: boolean;
      controls?: boolean;
      sources?: Array<{
        src: string;
        type: string;
      }>;
    }
  
    export default function videojs(
      videoNode: HTMLVideoElement,
      options?: PlayerOptions,
      ready?: () => void
    ): VideoJsPlayer;
  
    export function registerPlugin(pluginName: string, pluginFn: Function): void;
  
    export function getPlayers(): { [key: string]: VideoJsPlayer };
    export function players(): VideoJsPlayer[];
  }
  