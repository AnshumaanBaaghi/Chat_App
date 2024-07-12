class PeerService {
  constructor() {
    if (!this.peer) {
      console.log("this.peer:", this.peer);
      this.peer = new RTCPeerConnection({
        iceServers: [
          {
            urls: [
              "stun:stun.l.google.com:19302",
              "stun:global.stun.twilio.com:3478",
            ],
          },
        ],
      });
    }
  }
  async createRTCPeerConnection() {
    if (!this.peer) {
      this.peer = new RTCPeerConnection({
        iceServers: [
          {
            urls: [
              "stun:stun.l.google.com:19302",
              "stun:global.stun.twilio.com:3478",
            ],
          },
        ],
      });
    }
  }

  async closeRTCPeerConnection() {
    if (!this.peer) return;
    this.peer.onicecandidate = null;
    this.peer.ontrack = null;
    this.peer.oniceconnectionstatechange = null;
    this.peer.close();
    this.peer = null;
    await this.createRTCPeerConnection();
  }

  async setLocalDescription(ans) {
    if (!this.peer) await this.createRTCPeerConnection();
    await this.peer.setRemoteDescription(new RTCSessionDescription(ans));
  }
  async generateOffer() {
    if (!this.peer) await this.createRTCPeerConnection();
    const offer = await this.peer.createOffer();
    await this.peer.setLocalDescription(new RTCSessionDescription(offer));
    return offer;
  }

  async acceptAnswer(offer) {
    if (!this.peer) await this.createRTCPeerConnection();
    await this.peer.setRemoteDescription(offer);
    const ans = await this.peer.createAnswer();
    await this.peer.setLocalDescription(new RTCSessionDescription(ans));
    return ans;
  }
}

export default new PeerService();
