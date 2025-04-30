"use client"

import { useEffect, useRef, useState } from "react"
import { useNavigate, useLocation } from "react-router-dom"
import io from "socket.io-client"
import { Mic, MicOff, Video as VideoIcon, VideoOff, PhoneOff } from "lucide-react"
import { Tooltip } from "react-tooltip"
import styles from "./VideoCall.module.css"

export default function VideoCall() {
  const [socket, setSocket] = useState(null)
  const [localStream, setLocalStream] = useState(null)
  const [remoteStream, setRemoteStream] = useState(null)
  const [isAudioMuted, setIsAudioMuted] = useState(false)
  const [isVideoOff, setIsVideoOff] = useState(false)
  const [callStatus, setCallStatus] = useState("Connecting...")
  const [error, setError] = useState("")
  const peerConnectionRef = useRef(null)
  const localVideoRef = useRef(null)
  const remoteVideoRef = useRef(null)
  const navigate = useNavigate()
  const location = useLocation()

  // Extract case_id and role from URL query parameters
  const queryParams = new URLSearchParams(location.search)
  const caseId = queryParams.get("case_id")
  const role = queryParams.get("role") // 'client' or 'lawyer'

  useEffect(() => {
    if (!caseId || !role || !["client", "lawyer"].includes(role)) {
      setError("Invalid call parameters")
      setCallStatus("Error")
      return
    }

    // Initialize SocketIO with token
    const token = localStorage.getItem(role === "client" ? "clientToken" : "token")
    if (!token) {
      setError("Please log in to join the call")
      setCallStatus("Error")
      navigate(role === "client" ? "/client-login" : "/lawyer-login")
      return
    }

    const newSocket = io("http://127.0.0.1:5000", {
      query: { token },
      transports: ["websocket"],
    })
    setSocket(newSocket)

    // Initialize WebRTC
    const initWebRTC = async () => {
      try {
        // Get local media stream
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        })
        setLocalStream(stream)
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream
        }

        // Create RTCPeerConnection
        const configuration = {
          iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
        }
        const pc = new RTCPeerConnection(configuration)
        peerConnectionRef.current = pc

        // Add local stream tracks to peer connection
        stream.getTracks().forEach((track) => pc.addTrack(track, stream))

        // Handle remote stream
        pc.ontrack = (event) => {
          const remote = new MediaStream()
          event.streams[0].getTracks().forEach((track) => remote.addTrack(track))
          setRemoteStream(remote)
          if (remoteVideoRef.current) {
            remoteVideoRef.current.srcObject = remote
          }
          setCallStatus("Connected")
        }

        // Handle ICE candidates
        pc.onicecandidate = (event) => {
          if (event.candidate) {
            newSocket.emit("ice_candidate", {
              case_id: caseId,
              candidate: event.candidate,
            })
          }
        }

        // Handle ICE connection state
        pc.oniceconnectionstatechange = () => {
          if (pc.iceConnectionState === "disconnected") {
            setCallStatus("Disconnected")
            handleEndCall()
          }
        }

        // Handle negotiation needed (for initiator)
        pc.onnegotiationneeded = async () => {
          if (role === "client") {
            try {
              const offer = await pc.createOffer()
              await pc.setLocalDescription(offer)
              newSocket.emit("offer", {
                case_id: caseId,
                offer,
              })
            } catch (err) {
              setError("Failed to create offer")
              setCallStatus("Error")
            }
          }
        }

        // SocketIO event listeners
        newSocket.on("connect", () => {
          console.log("Connected to Socket.IO server")
          newSocket.emit("join_call", { case_id: caseId, role })
        })

        newSocket.on("offer", async (data) => {
          if (role === "lawyer" && pc.signalingState === "stable") {
            try {
              await pc.setRemoteDescription(new RTCSessionDescription(data.offer))
              const answer = await pc.createAnswer()
              await pc.setLocalDescription(answer)
              newSocket.emit("answer", {
                case_id: caseId,
                answer,
              })
            } catch (err) {
              setError("Failed to handle offer")
              setCallStatus("Error")
            }
          }
        })

        newSocket.on("answer", async (data) => {
          if (role === "client" && pc.signalingState === "have-local-offer") {
            try {
              await pc.setRemoteDescription(new RTCSessionDescription(data.answer))
            } catch (err) {
              setError("Failed to set answer")
              setCallStatus("Error")
            }
          }
        })

        newSocket.on("ice_candidate", async (data) => {
          try {
            await pc.addIceCandidate(new RTCIceCandidate(data.candidate))
          } catch (err) {
            console.error("Error adding ICE candidate:", err)
          }
        })

        newSocket.on("call_ended", () => {
          setCallStatus("Call Ended")
          handleEndCall()
        })

        newSocket.on("call_error", (data) => {
          setError(data.error)
          setCallStatus("Error")
          handleEndCall()
        })

      } catch (err) {
        setError("Failed to access camera/microphone")
        setCallStatus("Error")
      }
    }

    initWebRTC()

    // Cleanup on unmount
    return () => {
      handleCleanup(newSocket)
    }
  }, [caseId, role, navigate])

  const handleCleanup = (socketInstance) => {
    if (localStream) {
      localStream.getTracks().forEach((track) => track.stop())
    }
    if (peerConnectionRef.current) {
      peerConnectionRef.current.close()
      peerConnectionRef.current = null
    }
    if (socketInstance) {
      socketInstance.emit("end_call", { case_id: caseId })
      socketInstance.off("connect")
      socketInstance.off("offer")
      socketInstance.off("answer")
      socketInstance.off("ice_candidate")
      socketInstance.off("call_ended")
      socketInstance.off("call_error")
      socketInstance.disconnect()
    }
    setLocalStream(null)
    setRemoteStream(null)
    setSocket(null)
  }

  const handleEndCall = () => {
    handleCleanup(socket)
    navigate(role === "client" ? "/client-dashboard" : "/lawyerdashboard")
  }

  const toggleAudio = () => {
    if (localStream) {
      const audioTrack = localStream.getAudioTracks()[0]
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled
        setIsAudioMuted(!audioTrack.enabled)
      }
    }
  }

  const toggleVideo = () => {
    if (localStream) {
      const videoTrack = localStream.getVideoTracks()[0]
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled
        setIsVideoOff(!videoTrack.enabled)
      }
    }
  }

  return (
    <div className={`${styles.videoCallPage} ${callStatus === "Error" ? styles.errorState : ""}`}>
      <Tooltip id="control-tooltip" />
      <div className={styles.videoContainer}>
        <div className={styles.remoteVideoWrapper}>
          <video
            ref={remoteVideoRef}
            autoPlay
            playsInline
            className={styles.remoteVideo}
            muted={false}
          />
          {!remoteStream && (
            <div className={styles.videoPlaceholder}>
              <p>{callStatus}</p>
              {error && <p className={styles.errorMessage}>{error}</p>}
            </div>
          )}
        </div>
        <div className={styles.localVideoWrapper}>
          <video
            ref={localVideoRef}
            autoPlay
            playsInline
            muted
            className={styles.localVideo}
          />
        </div>
      </div>
      <div className={styles.controls}>
        <button
          onClick={toggleAudio}
          className={`${styles.controlButton} ${isAudioMuted ? styles.controlButtonActive : ""}`}
          data-tooltip-id="control-tooltip"
          data-tooltip-content={isAudioMuted ? "Unmute Audio" : "Mute Audio"}
        >
          {isAudioMuted ? <MicOff className={styles.controlIcon} /> : <Mic className={styles.controlIcon} />}
        </button>
        <button
          onClick={toggleVideo}
          className={`${styles.controlButton} ${isVideoOff ? styles.controlButtonActive : ""}`}
          data-tooltip-id="control-tooltip"
          data-tooltip-content={isVideoOff ? "Turn On Video" : "Turn Off Video"}
        >
          {isVideoOff ? <VideoOff className={styles.controlIcon} /> : <VideoIcon className={styles.controlIcon} />}
        </button>
        <button
          onClick={handleEndCall}
          className={`${styles.controlButton} ${styles.endCallButton}`}
          data-tooltip-id="control-tooltip"
          data-tooltip-content="End Call"
        >
          <PhoneOff className={styles.controlIcon} />
        </button>
      </div>
    </div>
  )
}