import { useState } from "react"
import { FaTrash, FaFile, FaPlus, FaFileUpload } from "react-icons/fa"
import "./CaseTrackingPage.css"

export default function CasePage() {
  const [newUpdate, setNewUpdate] = useState("")
  const [updates, setUpdates] = useState([
    {
      id: "1",
      date: "2023-10-25",
      description: "Case filed by client.",
      status: "In Progress",
    },
    {
      id: "2",
      date: "2023-10-28",
      description: "Lawyer assigned (Adv. Ramesh Sharma)",
      status: "In Progress",
    },
    {
      id: "3",
      date: "2023-11-01",
      description: "First hearing scheduled",
      status: "In Progress",
    },
  ])

  const [documents, setDocuments] = useState([])

  const handleAddUpdate = (e) => {
    e.preventDefault()
    if (!newUpdate.trim()) return

    const update = {
      id: Date.now().toString(),
      date: new Date().toISOString().split("T")[0],
      description: newUpdate,
      status: "In Progress",
    }

    setUpdates([...updates, update])
    setNewUpdate("")
  }

  const handleStatusChange = (id, status) => {
    setUpdates(updates.map((update) => (update.id === id ? { ...update, status } : update)))
  }

  const handleDeleteUpdate = (id) => {
    setUpdates(updates.filter((update) => update.id !== id))
  }

  const handleFileUpload = (e) => {
    const files = e.target.files
    if (!files) return

    const newDocuments = Array.from(files).map((file) => ({
      id: Date.now().toString(),
      name: file.name,
      type: file.type,
      uploadDate: new Date().toISOString().split("T")[0],
    }))

    setDocuments([...documents, ...newDocuments])
  }

  return (
    <div className="case-container">
      <header className="case-header">
        <div className="case-title">
          <h1>Case #NLF-2023-001</h1>
          <span className="status-badge">In Progress</span>
        </div>
      </header>

      <section className="case-section">
        <h2>Add New Update</h2>
        <form onSubmit={handleAddUpdate} className="update-form">
          <textarea
            value={newUpdate}
            onChange={(e) => setNewUpdate(e.target.value)}
            placeholder="Enter case update..."
            rows={4}
          />
          <button type="submit" className="add-button">
            <FaPlus /> Add Update
          </button>
        </form>
      </section>

      <section className="case-section">
        <h2>Case Updates</h2>
        <div className="updates-timeline">
          {updates.map((update) => (
            <div key={update.id} className="timeline-item">
              <div className="timeline-marker"></div>
              <div className="timeline-content">
                <div className="update-header">
                  <span className="update-date">{update.date}</span>
                  <select
                    value={update.status}
                    onChange={(e) => handleStatusChange(update.id, e.target.value)}
                    className="status-select"
                  >
                    <option value="In Progress">In Progress</option>
                    <option value="Completed">Completed</option>
                    <option value="Pending">Pending</option>
                  </select>
                  <button onClick={() => handleDeleteUpdate(update.id)} className="delete-button">
                    <FaTrash />
                  </button>
                </div>
                <p className="update-description">{update.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="case-section">
        <h2>Case Documents</h2>
        <div className="documents-grid">
          <label className="document-upload">
            <input type="file" multiple onChange={handleFileUpload} accept=".pdf,.doc,.docx,.txt" />
            <FaFileUpload />
            <span>Upload Documents</span>
          </label>
          {documents.map((doc) => (
            <div key={doc.id} className="document-card">
              <FaFile className="document-icon" />
              <div className="document-info">
                <span className="document-name">{doc.name}</span>
                <span className="document-date">{doc.uploadDate}</span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
