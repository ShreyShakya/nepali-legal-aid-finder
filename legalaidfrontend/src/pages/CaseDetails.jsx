// CaseDetails.jsx
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { FileText, Calendar, User, File, CheckCircle, AlertCircle } from "lucide-react";
import styles from "./CaseDetails.module.css";

export default function CaseDetails() {
  const { caseId } = useParams();
  const navigate = useNavigate();
  const [caseData, setCaseData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    next_hearing_date: "",
    case_progress_notes: "",
    case_status: "pending",
    verdict_summary: "",
    case_discussion_notes: "",
    client_contact_info: "",
    is_pro_bono: false,
  });
  const [evidenceFiles, setEvidenceFiles] = useState([]);
  const [courtFiles, setCourtFiles] = useState([]);

  const addNotification = (message, type = "success") => {
    const id = Date.now();
    setNotifications((prev) => [...prev, { id, message, type }]);
    setTimeout(() => setNotifications((prev) => prev.filter((n) => n.id !== id)), 3000);
  };

  useEffect(() => {
    const fetchCaseDetails = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        addNotification("Please log in to access case details", "error");
        navigate("/lawyer-login");
        return;
      }

      setIsLoading(true);
      try {
        const response = await axios.get(`http://127.0.0.1:5000/api/case/${caseId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCaseData(response.data.case);
        setFormData({
          next_hearing_date: response.data.case.next_hearing_date || "",
          case_progress_notes: response.data.case.case_progress_notes || "",
          case_status: response.data.case.status || "pending",
          verdict_summary: response.data.case.verdict_summary || "",
          case_discussion_notes: response.data.case.case_discussion_notes || "",
          client_contact_info: response.data.case.client_contact_info || "",
          is_pro_bono: response.data.case.is_pro_bono || false,
        });
      } catch (err) {
        addNotification(err.response?.data?.error || "Failed to load case details", "error");
        if (err.response?.status === 401 || err.response?.status === 403) {
          localStorage.removeItem("token");
          navigate("/lawyer-login");
        }
      } finally {
        setIsLoading(false);
      }
    };
    fetchCaseDetails();
  }, [caseId, navigate]);

  const handleFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleFileChange = (e, setFiles) => {
    const files = Array.from(e.target.files);
    setFiles(files);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    setIsLoading(true);

    try {
      const formDataToSend = new FormData();
      for (const key in formData) {
        formDataToSend.append(key, formData[key]);
      }
      evidenceFiles.forEach((file) => formDataToSend.append("evidence_files", file));
      courtFiles.forEach((file) => formDataToSend.append("court_files", file));

      const response = await axios.put(`http://127.0.0.1:5000/api/case/${caseId}`, formDataToSend, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      setCaseData(response.data.case);
      setIsEditing(false);
      setEvidenceFiles([]);
      setCourtFiles([]);
      addNotification(response.data.message || "Case updated successfully", "success");
    } catch (err) {
      addNotification(err.response?.data?.error || "Failed to update case", "error");
    } finally {
      setIsLoading(false);
    }
  };

  if (!caseData) {
    return (
      <div className={styles.caseDetailsPage}>
        <div className={styles.loader}>Loading...</div>
      </div>
    );
  }

  return (
    <div className={styles.caseDetailsPage}>
      <header className={styles.header}>
        <h1>Case Details: {caseData.title}</h1>
        <button onClick={() => navigate("/lawyer-dashboard")} className={styles.backButton}>
          Back to Dashboard
        </button>
      </header>

      <main className={styles.main}>
        <div className={styles.card}>
          <h2>
            <FileText className={styles.icon} /> Case Information
          </h2>
          <div className={styles.caseInfo}>
            <p><strong>Case Number:</strong> {caseData.id}</p>
            <p><strong>Case Type:</strong> {caseData.case_type}</p>
            <p><strong>Filing Date:</strong> {new Date(caseData.filing_date).toLocaleDateString()}</p>
            <p><strong>Jurisdiction:</strong> {caseData.jurisdiction}</p>
            <p><strong>Description:</strong> {caseData.description || "N/A"}</p>
            <p><strong>Plaintiff:</strong> {caseData.plaintiff_name}</p>
            <p><strong>Defendant:</strong> {caseData.defendant_name}</p>
            <p><strong>Client:</strong> {caseData.client_name}</p>
            <p><strong>Lawyer:</strong> {caseData.lawyer_name}</p>
            <p><strong>Priority:</strong> {caseData.priority}</p>
          </div>
        </div>

        <div className={styles.card}>
          <h2>
            <Calendar className={styles.icon} /> Case Progress
          </h2>
          {isEditing ? (
            <form onSubmit={handleSubmit} className={styles.editForm}>
              <div className={styles.formGroup}>
                <label>Next Hearing Date:</label>
                <input
                  type="date"
                  name="next_hearing_date"
                  value={formData.next_hearing_date}
                  onChange={handleFormChange}
                  className={styles.formInput}
                />
              </div>
              <div className={styles.formGroup}>
                <label>Case Progress Notes:</label>
                <textarea
                  name="case_progress_notes"
                  value={formData.case_progress_notes}
                  onChange={handleFormChange}
                  className={styles.formTextarea}
                />
              </div>
              <div className={styles.formGroup}>
                <label>Case Status:</label>
                <select
                  name="case_status"
                  value={formData.case_status}
                  onChange={handleFormChange}
                  className={styles.formInput}
                >
                  <option value="pending">Pending</option>
                  <option value="accepted">Accepted</option>
                  <option value="rejected">Rejected</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
              <div className={styles.formGroup}>
                <label>Verdict Summary:</label>
                <textarea
                  name="verdict_summary"
                  value={formData.verdict_summary}
                  onChange={handleFormChange}
                  className={styles.formTextarea}
                />
              </div>
              <div className={styles.formGroup}>
                <label>Case Discussion Notes:</label>
                <textarea
                  name="case_discussion_notes"
                  value={formData.case_discussion_notes}
                  onChange={handleFormChange}
                  className={styles.formTextarea}
                />
              </div>
              <div className={styles.formGroup}>
                <label>Client Contact Info:</label>
                <input
                  type="text"
                  name="client_contact_info"
                  value={formData.client_contact_info}
                  onChange={handleFormChange}
                  className={styles.formInput}
                />
              </div>
              <div className={styles.formGroup}>
                <label>Pro Bono:</label>
                <input
                  type="checkbox"
                  name="is_pro_bono"
                  checked={formData.is_pro_bono}
                  onChange={handleFormChange}
                />
              </div>
              <div className={styles.formGroup}>
                <label>Upload Evidence Files:</label>
                <input
                  type="file"
                  multiple
                  accept="image/*,.pdf"
                  onChange={(e) => handleFileChange(e, setEvidenceFiles)}
                  className={styles.formInput}
                />
                {evidenceFiles.length > 0 && (
                  <ul>
                    {evidenceFiles.map((file, index) => (
                      <li key={index}>{file.name}</li>
                    ))}
                  </ul>
                )}
              </div>
              <div className={styles.formGroup}>
                <label>Upload Court Files:</label>
                <input
                  type="file"
                  multiple
                  accept="image/*,.pdf"
                  onChange={(e) => handleFileChange(e, setCourtFiles)}
                  className={styles.formInput}
                />
                {courtFiles.length > 0 && (
                  <ul>
                    {courtFiles.map((file, index) => (
                      <li key={index}>{file.name}</li>
                    ))}
                  </ul>
                )}
              </div>
              <div className={styles.formActions}>
                <button type="submit" className={styles.actionButton} disabled={isLoading}>
                  Save
                </button>
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className={styles.cancelButton}
                  disabled={isLoading}
                >
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <div className={styles.caseProgress}>
              <p><strong>Next Hearing Date:</strong> {caseData.next_hearing_date ? new Date(caseData.next_hearing_date).toLocaleDateString() : "N/A"}</p>
              <p><strong>Case Progress Notes:</strong> {caseData.case_progress_notes || "N/A"}</p>
              <p><strong>Current Status:</strong> {caseData.status}</p>
              <p><strong>Verdict Summary:</strong> {caseData.verdict_summary || "N/A"}</p>
              <p><strong>Case Discussion Notes:</strong> {caseData.case_discussion_notes || "N/A"}</p>
              <p><strong>Client Contact Info:</strong> {caseData.client_contact_info || "N/A"}</p>
              <p><strong>Pro Bono:</strong> {caseData.is_pro_bono ? "Yes" : "No"}</p>
              <button onClick={() => setIsEditing(true)} className={styles.actionButton}>
                Update Case Details
              </button>
            </div>
          )}
        </div>
      </main>

      <div className={styles.notificationContainer}>
        <AnimatePresence>
          {notifications.map((notification) => (
            <motion.div
              key={notification.id}
              className={`${styles.notification} ${notification.type === "error" ? styles.errorNotification : styles.successNotification}`}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 50 }}
              transition={{ duration: 0.3 }}
            >
              {notification.type === "success" ? (
                <CheckCircle className={styles.notificationIcon} />
              ) : (
                <AlertCircle className={styles.notificationIcon} />
              )}
              {notification.message}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <div className={styles.loaderOverlay} style={{ display: isLoading ? "flex" : "none" }}>
        <div className={styles.loader}></div>
      </div>
    </div>
  );
}