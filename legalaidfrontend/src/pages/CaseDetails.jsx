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
  Upload,
  Trash2,
  MessageSquare,
  Eye,
  Clock,
  Download,
  Send,
  Check,
} from "lucide-react"
import axios from "axios"
import styles from "./CaseDetails.module.css"

export default function CaseDetails() {
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
  const [privateNotes, setPrivateNotes] = useState("")
  const [isEditingOverview, setIsEditingOverview] = useState(false)
  const [overviewFormData, setOverviewFormData] = useState({
    case_status: "pending",
    next_hearing_date: "",
    jurisdiction: "District Court",
    priority: "Medium",
    description: "",
  })
  const [progressFormData, setProgressFormData] = useState({
    progress_event: "",
    event_date: "",
  })
  const [newDocument, setNewDocument] = useState(null)
  const [newEvidence, setNewEvidence] = useState({ file: null, description: "" })
  const [newMessage, setNewMessage] = useState("")
  const [activeTab, setActiveTab] = useState("notes")

  // Helper function for notifications
  const addNotification = (message, type = "success") => {
    const id = Date.now()
    setNotifications((prev) => [...prev, { id, message, type }])
    setTimeout(() => setNotifications((prev) => prev.filter((n) => n.id !== id)), 3000)
  }

  // Fetch case details on mount
  useEffect(() => {
    const fetchCaseDetails = async () => {
      const token = localStorage.getItem("token")
      if (!token) {
        addNotification("Please log in to access case details", "error")
        navigate("/lawyer-login")
        return
      }

      setIsLoading(true)
      try {
        const response = await axios.get(`http://127.0.0.1:5000/api/case/${caseId}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        const { case: caseDetails, timeline, documents, evidence, messages } = response.data
        setCaseData(caseDetails)
        setTimelineEvents(timeline)
        setDocuments(documents)
        setEvidenceList(evidence)
        setMessages(messages)
        setPrivateNotes(caseDetails.private_notes || "")
        setOverviewFormData({
          case_status: caseDetails.status || "pending",
          next_hearing_date: caseDetails.next_hearing_date || "",
          jurisdiction: caseDetails.jurisdiction || "District Court",
          priority: caseDetails.priority || "Medium",
          description: caseDetails.description || "",
        })
      } catch (err) {
        addNotification(err.response?.data?.error || "Failed to load case details", "error")
        if (err.response?.status === 401 || err.response?.status === 403) {
          localStorage.removeItem("token")
          navigate("/lawyer-login")
        }
      } finally {
        setIsLoading(false)
      }
    }
    fetchCaseDetails()
  }, [caseId, navigate])

  // Form handlers
  const handleOverviewFormChange = (e) => {
    const { name, value } = e.target
    setOverviewFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleProgressFormChange = (e) => {
    const { name, value } = e.target
    setProgressFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleEvidenceChange = (e) => {
    const { name, value, files } = e.target
    if (name === "file") {
      setNewEvidence((prev) => ({ ...prev, file: files[0] }))
    } else {
      setNewEvidence((prev) => ({ ...prev, [name]: value }))
    }
  }

  // Form submission handlers
  const handleOverviewSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const token = localStorage.getItem("token")
      const response = await axios.put(
        `http://127.0.0.1:5000/api/case/${caseId}`,
        overviewFormData,
        { headers: { Authorization: `Bearer ${token}` } }
      )
      setCaseData(response.data.case)
      setIsEditingOverview(false)
      addNotification("Case overview updated successfully")
    } catch (err) {
      addNotification(err.response?.data?.error || "Failed to update case overview", "error")
    } finally {
      setIsLoading(false)
    }
  }

  const handleProgressSubmit = async (e) => {
    e.preventDefault()
    if (!progressFormData.progress_event || !progressFormData.event_date) {
      addNotification("Please fill in all fields", "error")
      return
    }

    setIsLoading(true)

    try {
      const token = localStorage.getItem("token")
      const response = await axios.post(
        `http://127.0.0.1:5000/api/case/${caseId}/timeline`,
        progressFormData,
        { headers: { Authorization: `Bearer ${token}` } }
      )
      setTimelineEvents([...timelineEvents, response.data.event])
      setProgressFormData({ progress_event: "", event_date: "" })
      addNotification("Timeline event added successfully")
    } catch (err) {
      addNotification(err.response?.data?.error || "Failed to add timeline event", "error")
    } finally {
      setIsLoading(false)
    }
  }

  const handleDocumentUpload = async () => {
    if (!newDocument) {
      addNotification("Please select a file to upload", "error")
      return
    }

    setIsLoading(true)

    try {
      const token = localStorage.getItem("token")
      const formData = new FormData()
      formData.append("file", newDocument)
      const response = await axios.post(
        `http://127.0.0.1:5000/api/case/${caseId}/documents`,
        formData,
        { headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" } }
      )
      setDocuments([...documents, response.data.document])
      setNewDocument(null)
      document.getElementById("document-upload").value = ""
      addNotification("Document uploaded successfully")
    } catch (err) {
      addNotification(err.response?.data?.error || "Failed to upload document", "error")
    } finally {
      setIsLoading(false)
    }
  }

  const handleDocumentDelete = async (documentId) => {
    setIsLoading(true)

    try {
      const token = localStorage.getItem("token")
      await axios.delete(
        `http://127.0.0.1:5000/api/case/${caseId}/documents/${documentId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      )
      setDocuments(documents.filter((doc) => doc.id !== documentId))
      addNotification("Document deleted successfully")
    } catch (err) {
      addNotification(err.response?.data?.error || "Failed to delete document", "error")
    } finally {
      setIsLoading(false)
    }
  }

  const handleEvidenceSubmit = async () => {
    if (!newEvidence.description) {
      addNotification("Please provide a description for the evidence", "error")
      return
    }

    setIsLoading(true)

    try {
      const token = localStorage.getItem("token")
      const formData = new FormData()
      if (newEvidence.file) {
        formData.append("file", newEvidence.file)
      }
      formData.append("description", newEvidence.description)
      const response = await axios.post(
        `http://127.0.0.1:5000/api/case/${caseId}/evidence`,
        formData,
        { headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" } }
      )
      setEvidenceList([...evidenceList, response.data.evidence])
      setNewEvidence({ file: null, description: "" })
      if (document.getElementById("evidence-upload")) {
        document.getElementById("evidence-upload").value = ""
      }
      addNotification("Evidence added successfully")
    } catch (err) {
      addNotification(err.response?.data?.error || "Failed to add evidence", "error")
    } finally {
      setIsLoading(false)
    }
  }

  const handleMarkEvidenceReviewed = async (evidenceId) => {
    setIsLoading(true)

    try {
      const token = localStorage.getItem("token")
      const response = await axios.put(
        `http://127.0.0.1:5000/api/case/${caseId}/evidence/${evidenceId}/review`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      )
      setEvidenceList(
        evidenceList.map((ev) => (ev.id === evidenceId ? response.data.evidence : ev))
      )
      addNotification("Evidence marked as reviewed")
    } catch (err) {
      addNotification(err.response?.data?.error || "Failed to mark evidence as reviewed", "error")
    } finally {
      setIsLoading(false)
    }
  }

  const handlePrivateNotesSubmit = async () => {
    setIsLoading(true)

    try {
      const token = localStorage.getItem("token")
      await axios.put(
        `http://127.0.0.1:5000/api/case/${caseId}/notes`,
        { private_notes: privateNotes },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      addNotification("Private notes updated successfully")
    } catch (err) {
      addNotification(err.response?.data?.error || "Failed to update private notes", "error")
    } finally {
      setIsLoading(false)
    }
  }

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return

    setIsLoading(true)

    try {
      const token = localStorage.getItem("token")
      const response = await axios.post(
        `http://127.0.0.1:5000/api/case/${caseId}/messages`,
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
        <button onClick={() => navigate("/lawyerdashboard")} className={styles.backButton}>
          Back to Dashboard
        </button>
      </header>

      <main className={styles.main}>
        <div className={styles.contentGrid}>
          {/* Left column - Main case information */}
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
                      <strong>Client:</strong> {caseData.client_name}
                    </p>
                    <p>
                      <strong>Contact:</strong> {caseData.client_contact_info || "N/A"}
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

                {isEditingOverview ? (
                  <form onSubmit={handleOverviewSubmit} className={styles.editForm}>
                    <div className={styles.formRow}>
                      <div className={styles.formGroup}>
                        <label>Case Status:</label>
                        <select
                          name="case_status"
                          value={overviewFormData.case_status}
                          onChange={handleOverviewFormChange}
                          className={styles.formInput}
                        >
                          <option value="pending">Pending</option>
                          <option value="accepted">Accepted</option>
                          <option value="rejected">Rejected</option>
                          <option value="completed">Completed</option>
                        </select>
                      </div>
                      <div className={styles.formGroup}>
                        <label>Next Hearing Date:</label>
                        <input
                          type="date"
                          name="next_hearing_date"
                          value={overviewFormData.next_hearing_date}
                          onChange={handleOverviewFormChange}
                          className={styles.formInput}
                        />
                      </div>
                    </div>
                    <div className={styles.formRow}>
                      <div className={styles.formGroup}>
                        <label>Jurisdiction:</label>
                        <select
                          name="jurisdiction"
                          value={overviewFormData.jurisdiction}
                          onChange={handleOverviewFormChange}
                          className={styles.formInput}
                        >
                          <option value="District Court">District Court</option>
                          <option value="High Court">High Court</option>
                          <option value="Supreme Court">Supreme Court</option>
                        </select>
                      </div>
                      <div className={styles.formGroup}>
                        <label>Priority:</label>
                        <select
                          name="priority"
                          value={overviewFormData.priority}
                          onChange={handleOverviewFormChange}
                          className={styles.formInput}
                        >
                          <option value="Low">Low</option>
                          <option value="Medium">Medium</option>
                          <option value="High">High</option>
                        </select>
                      </div>
                    </div>
                    <div className={styles.formGroup}>
                      <label>Description:</label>
                      <textarea
                        name="description"
                        value={overviewFormData.description}
                        onChange={handleOverviewFormChange}
                        className={styles.formTextarea}
                      />
                    </div>
                    <div className={styles.formActions}>
                      <button type="submit" className={styles.actionButton}>
                        Save
                      </button>
                      <button type="button" onClick={() => setIsEditingOverview(false)} className={styles.cancelButton}>
                        Cancel
                      </button>
                    </div>
                  </form>
                ) : (
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
                    <button onClick={() => setIsEditingOverview(true)} className={styles.actionButton}>
                      Update Status
                    </button>
                  </div>
                )}
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

              <div className={styles.addEventSection}>
                <h3>Add Timeline Event</h3>
                <form onSubmit={handleProgressSubmit} className={styles.editForm}>
                  <div className={styles.formRow}>
                    <div className={styles.formGroup}>
                      <label>Event Description:</label>
                      <input
                        type="text"
                        name="progress_event"
                        value={progressFormData.progress_event}
                        onChange={handleProgressFormChange}
                        className={styles.formInput}
                        placeholder="e.g., Evidence Submission"
                      />
                    </div>
                    <div className={styles.formGroup}>
                      <label>Date:</label>
                      <input
                        type="date"
                        name="event_date"
                        value={progressFormData.event_date}
                        onChange={handleProgressFormChange}
                        className={styles.formInput}
                      />
                    </div>
                  </div>
                  <button type="submit" className={styles.actionButton}>
                    Add Event
                  </button>
                </form>
              </div>
            </div>

            {/* Document Manager Section */}
            <div className={styles.card}>
              <h2>
                <File className={styles.icon} /> Documents
              </h2>

              <div className={styles.uploadSection}>
                <div className={styles.formGroup}>
                  <label htmlFor="document-upload" className={styles.uploadLabel}>
                    <Upload className={styles.iconSmall} /> Select Document
                  </label>
                  <input
                    id="document-upload"
                    type="file"
                    accept=".pdf,.doc,.docx,image/*"
                    onChange={(e) => setNewDocument(e.target.files[0])}
                    className={styles.fileInput}
                  />
                  {newDocument && (
                    <div className={styles.selectedFile}>
                      <span>{newDocument.name}</span>
                      <button onClick={handleDocumentUpload} className={styles.uploadButton}>
                        Upload
                      </button>
                    </div>
                  )}
                </div>
              </div>

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
                          <button
                            onClick={() => handleDocumentDelete(doc.id)}
                            className={`${styles.iconButton} ${styles.deleteButton}`}
                            title="Delete"
                          >
                            <Trash2 className={styles.iconSmall} />
                          </button>
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

          {/* Right column - Evidence and communication */}
          <div className={styles.sideColumn}>
            {/* Evidence Manager Section */}
            <div className={styles.card}>
              <h2>
                <File className={styles.icon} /> Evidence
              </h2>

              <div className={styles.evidenceForm}>
                <div className={styles.formGroup}>
                  <label htmlFor="evidence-upload" className={styles.uploadLabel}>
                    <Upload className={styles.iconSmall} /> Select Evidence File
                  </label>
                  <input
                    id="evidence-upload"
                    type="file"
                    accept=".pdf,image/*"
                    name="file"
                    onChange={handleEvidenceChange}
                    className={styles.fileInput}
                  />
                  {newEvidence.file && (
                    <div className={styles.selectedFile}>
                      <span>{newEvidence.file.name}</span>
                    </div>
                  )}
                </div>

                <div className={styles.formGroup}>
                  <label>Description:</label>
                  <textarea
                    name="description"
                    value={newEvidence.description}
                    onChange={handleEvidenceChange}
                    className={styles.formTextarea}
                    placeholder="Describe the evidence..."
                  />
                </div>

                <button
                  onClick={handleEvidenceSubmit}
                  className={styles.actionButton}
                  disabled={!newEvidence.description}
                >
                  Add Evidence
                </button>
              </div>

              {evidenceList.length > 0 ? (
                <div className={styles.evidenceList}>
                  <h3>Evidence Items</h3>
                  {evidenceList.map((evidence) => (
                    <div key={evidence.id} className={styles.evidenceItem}>
                      <div className={styles.evidenceHeader}>
                        <div
                          className={`${styles.evidenceStatus} ${evidence.reviewed ? styles.reviewed : styles.pending}`}
                        >
                          {evidence.reviewed ? (
                            <>
                              <Check className={styles.iconSmall} /> Reviewed
                            </>
                          ) : (
                            <>
                              <Eye className={styles.iconSmall} /> Pending Review
                            </>
                          )}
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
                      {!evidence.reviewed && (
                        <button onClick={() => handleMarkEvidenceReviewed(evidence.id)} className={styles.reviewButton}>
                          Mark as Reviewed
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className={styles.emptyState}>No evidence items added yet</p>
              )}
            </div>

            {/* Case Notes & Communication Section */}
            <div className={styles.card}>
              <h2>
                <MessageSquare className={styles.icon} /> Notes & Communication
              </h2>

              <div className={styles.tabsContainer}>
                <div className={styles.tabs}>
                  <button
                    className={`${styles.tab} ${activeTab === "notes" ? styles.activeTab : ""}`}
                    onClick={() => setActiveTab("notes")}
                  >
                    Private Notes
                  </button>
                  <button
                    className={`${styles.tab} ${activeTab === "messages" ? styles.activeTab : ""}`}
                    onClick={() => setActiveTab("messages")}
                  >
                    Client Messages
                  </button>
                </div>

                <div className={styles.tabContent}>
                  {activeTab === "notes" ? (
                    <div className={styles.notesSection}>
                      <textarea
                        value={privateNotes}
                        onChange={(e) => setPrivateNotes(e.target.value)}
                        className={styles.notesTextarea}
                        placeholder="Enter your private notes here..."
                      />
                      <button onClick={handlePrivateNotesSubmit} className={styles.actionButton}>
                        Save Notes
                      </button>
                    </div>
                  ) : (
                    <div className={styles.messagesSection}>
                      <div className={styles.messageList}>
                        {messages.length > 0 ? (
                          messages.map((msg) => (
                            <div
                              key={msg.id}
                              className={`${styles.message} ${
                                msg.sender === "lawyer" ? styles.sentMessage : styles.receivedMessage
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
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

