"use client"

import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
import {
  FileText,
  Calendar,
  File,
  CheckCircle,
  AlertCircle,
  MessageSquare,
  Clock,
  Download,
  Send,
} from "lucide-react"
import axios from "axios"
import styles from "./ClientCaseDetails.module.css"

export default function ClientCaseDetails() {
  const { caseId } = useParams()
  const navigate = useNavigate()

  // State variables
  const [caseData, setCaseData] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [notifications, setNotifications] = useState([])
  const [timelineEvents, setTimelineEvents] = useState([])
  const [documents, setDocuments] = useState([])
  const [evidenceList, setEvidenceList] = useState([])
  const [messages, setMessages] = useState([])
  const [newMessage, setNewMessage] = useState("")

  // Helper function for notifications
  const addNotification = (message, type = "success") => {
    const id = Date.now()
    setNotifications((prev) => [...prev, { id, message, type }])
    setTimeout(() => setNotifications((prev) => prev.filter((n) => n.id !== id)), 3000)
  }

  // Fetch case details on mount
  useEffect(() => {
    const fetchCaseDetails = async () => {
      const token = localStorage.getItem("clientToken")
      if (!token) {
        addNotification("Please log in to access case details", "error")
        navigate("/client-login")
        return
      }

      setIsLoading(true)
      try {
        const response = await axios.get(`http://127.0.0.1:5000/api/client-case/${caseId}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        const { case: caseDetails, timeline, documents, evidence, messages } = response.data
        setCaseData(caseDetails)
        setTimelineEvents(timeline)
        setDocuments(documents)
        setEvidenceList(evidence)
        setMessages(messages)
      } catch (err) {
        addNotification(err.response?.data?.error || "Failed to load case details", "error")
        if (err.response?.status === 401 || err.response?.status === 403) {
          localStorage.removeItem("clientToken")
          navigate("/client-login")
        }
      } finally {
        setIsLoading(false)
      }
    }
    fetchCaseDetails()
  }, [caseId, navigate])

  // Handle sending messages
  const handleSendMessage = async () => {
    if (!newMessage.trim()) return

    setIsLoading(true)

    try {
      const token = localStorage.getItem("clientToken")
      const response = await axios.post(
        `http://127.0.0.1:5000/api/client-case/${caseId}/messages`,
        { message: newMessage },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      setMessages([...messages, response.data.message])
      setNewMessage("")
      addNotification("Message sent successfully")
    } catch (err) {
      addNotification(err.response?.data?.error || "Failed to send message", "error")
    } finally {
      setIsLoading(false)
    }
  }

  // Render loading state
  if (!caseData) {
    return (
      <div className={styles.caseDetailsPage}>
        <div className={styles.loader}></div>
      </div>
    )
  }

  return (
    <div className={styles.caseDetailsPage}>
      <header className={styles.header}>
        <h1>Case: {caseData.title}</h1>
        <button onClick={() => navigate("/client-dashboard")} className={styles.backButton}>
          Back to Dashboard
        </button>
      </header>

      <main className={styles.main}>
        <div className={styles.contentGrid}>
          {/* Main column - Case information */}
          <div className={styles.mainColumn}>
            {/* Case Overview Section */}
            <div className={styles.card}>
              <h2>
                <FileText className={styles.icon} /> Case Overview
              </h2>
              <div className={styles.caseInfo}>
                <div className={styles.infoGrid}>
                  <div>
                    <p>
                      <strong>Case ID:</strong> #{caseData.id}
                    </p>
                    <p>
                      <strong>Title:</strong> {caseData.title}
                    </p>
                    <p>
                      <strong>Case Type:</strong> {caseData.case_type}
                    </p>
                    <p>
                      <strong>Filing Date:</strong>{" "}
                      {caseData.filing_date
                        ? new Date(caseData.filing_date).toLocaleDateString()
                        : "N/A"}
                    </p>
                  </div>
                  <div>
                    <p>
                      <strong>Lawyer:</strong> {caseData.lawyer_name}
                    </p>
                    <p>
                      <strong>Contact:</strong> {caseData.lawyer_contact_info || "N/A"}
                    </p>
                    <p>
                      <strong>Plaintiff:</strong> {caseData.plaintiff_name || "N/A"}
                    </p>
                    <p>
                      <strong>Opposing Party:</strong> {caseData.defendant_name}
                    </p>
                  </div>
                  <div>
                    <p>
                      <strong>Jurisdiction:</strong> {caseData.jurisdiction}
                    </p>
                    <p>
                      <strong>Priority:</strong> {caseData.priority}
                    </p>
                    <p>
                      <strong>Description:</strong>{" "}
                      {caseData.description || "No description provided"}
                    </p>
                  </div>
                </div>
                <div className={styles.statusSection}>
                  <div className={styles.statusInfo}>
                    <div className={`${styles.statusBadge} ${styles[caseData.status]}`}>{caseData.status}</div>
                    <div className={styles.hearingDate}>
                      <strong>Next Hearing:</strong>{" "}
                      {caseData.next_hearing_date
                        ? new Date(caseData.next_hearing_date).toLocaleDateString()
                        : "Not scheduled"}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Case Timeline Section */}
            <div className={styles.card}>
              <h2>
                <Calendar className={styles.icon} /> Case Timeline
              </h2>
              {timelineEvents.length > 0 ? (
                <div className={styles.timelineContainer}>
                  {timelineEvents.map((event, index) => (
                    <div key={index} className={styles.timelineItem}>
                      <div className={styles.timelineDot}></div>
                      <div className={styles.timelineContent}>
                        <div className={styles.timelineHeader}>
                          <span className={styles.timelineDate}>
                            <Clock className={styles.iconSmall} />
                            {new Date(event.event_date).toLocaleDateString()}
                          </span>
                        </div>
                        <p className={styles.timelineEvent}>{event.progress_event}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className={styles.emptyState}>No timeline events recorded yet</p>
              )}
            </div>

            {/* Document Manager Section */}
            <div className={styles.card}>
              <h2>
                <File className={styles.icon} /> Documents
              </h2>
              {documents.length > 0 ? (
                <div className={styles.documentList}>
                  <h3>Case Documents</h3>
                  <div className={styles.documentGrid}>
                    {documents.map((doc) => (
                      <div key={doc.id} className={styles.documentCard}>
                        <div className={styles.documentIcon}>
                          <File className={styles.icon} />
                        </div>
                        <div className={styles.documentInfo}>
                          <p className={styles.documentName}>{doc.file_path}</p>
                          <p className={styles.documentDate}>{new Date(doc.uploaded_at).toLocaleDateString()}</p>
                        </div>
                        <div className={styles.documentActions}>
                          <a
                            href={`http://127.0.0.1:5000/court-files/${doc.file_path}`}
                            className={styles.iconButton}
                            title="Download"
                            download
                          >
                            <Download className={styles.iconSmall} />
                          </a>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <p className={styles.emptyState}>No documents uploaded yet</p>
              )}
            </div>
          </div>

          {/* Side column - Evidence and communication */}
          <div className={styles.sideColumn}>
            {/* Evidence Manager Section */}
            <div className={styles.card}>
              <h2>
                <File className={styles.icon} /> Evidence
              </h2>
              {evidenceList.length > 0 ? (
                <div className={styles.evidenceList}>
                  <h3>Reviewed Evidence</h3>
                  {evidenceList.map((evidence) => (
                    <div key={evidence.id} className={styles.evidenceItem}>
                      <div className={styles.evidenceHeader}>
                        <div className={`${styles.evidenceStatus} ${styles.reviewed}`}>
                          <CheckCircle className={styles.iconSmall} /> Reviewed
                        </div>
                        {evidence.file_path && (
                          <a
                            href={`http://127.0.0.1:5000/evidence/${evidence.file_path}`}
                            className={styles.downloadLink}
                            download
                          >
                            Download
                          </a>
                        )}
                      </div>
                      <p className={styles.evidenceDescription}>{evidence.description || "No description"}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className={styles.emptyState}>No reviewed evidence available</p>
              )}
            </div>

            {/* Communication Section */}
            <div className={styles.card}>
              <h2>
                <MessageSquare className={styles.icon} /> Messages
              </h2>
              <div className={styles.messagesSection}>
                <div className={styles.messageList}>
                  {messages.length > 0 ? (
                    messages.map((msg) => (
                      <div
                        key={msg.id}
                        className={`${styles.message} ${
                          msg.sender === "client" ? styles.sentMessage : styles.receivedMessage
                        }`}
                      >
                        <p>{msg.message}</p>
                        <span className={styles.messageTimestamp}>
                          {new Date(msg.created_at).toLocaleString()}
                        </span>
                      </div>
                    ))
                  ) : (
                    <p className={styles.emptyState}>No messages yet</p>
                  )}
                </div>
                <div className={styles.messageInput}>
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type your message..."
                    className={styles.formInput}
                  />
                  <button onClick={handleSendMessage} className={styles.sendButton}>
                    <Send className={styles.iconSmall} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Notifications */}
      <div className={styles.notificationContainer}>
        <AnimatePresence>
          {notifications.map((notification) => (
            <motion.div
              key={notification.id}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 50 }}
              className={`${styles.notification} ${styles[notification.type]}`}
            >
              {notification.type === "success" ? (
                <CheckCircle className={styles.notificationIcon} />
              ) : (
                <AlertCircle className={styles.notificationIcon} />
              )}
              <span>{notification.message}</span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Loading Overlay */}
      {isLoading && (
        <div className={styles.loadingOverlay}>
          <div className={styles.loader}></div>
        </div>
      )}
    </div>
  )
}