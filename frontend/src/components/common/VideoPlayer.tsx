import * as React from 'react';
import videojs, { PlayerOptions, VideoJsPlayer } from 'video.js'; // Import types

// Styles
import 'video.js/dist/video-js.css';

interface VideoPlayerProps {
  videoJsOptions: PlayerOptions; // Use PlayerOptions type
}

export default class VideoPlayer extends React.Component<VideoPlayerProps> {
  private player?: VideoJsPlayer; // Use VideoJsPlayer type
  private videoNode?: HTMLVideoElement;

  constructor(props: VideoPlayerProps) {
    super(props);
    this.player = undefined;
    this.videoNode = undefined;
  }

  componentDidMount() {
    if (this.videoNode) {
      // Instantiate video.js
      this.player = videojs(this.videoNode, this.props.videoJsOptions, () => {
        console.log('onPlayerReady', this.player);
      });
    }
  }

  // Destroy player on unmount
  componentWillUnmount() {
    if (this.player) {
      this.player.dispose();
    }
  }

  render() {
    return (
      <div className="c-player">
        <div className="c-player__screen" data-vjs-player>
          <video
            ref={(node: HTMLVideoElement) => { this.videoNode = node; }}
            className="video-js vjs-big-play-centered"
          />
        </div>
        {/* <div className="c-player__controls">
          <button onClick={() => this.player?.play()}>Play</button>
          <button onClick={() => this.player?.pause()}>Pause</button>
        </div> */}
      </div>
    );
  }
}
