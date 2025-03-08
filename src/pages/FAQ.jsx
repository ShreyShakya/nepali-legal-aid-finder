import { useState } from "react"
import { FaChevronDown, FaQuestion, FaCalendar, FaDollarSign, FaFileAlt, FaShieldAlt } from "react-icons/fa"
import "./FAQ.css"

// Sample FAQ data
const faqData = [
  {
    id: 1,
    question: "What is Nepali Legal Aid Finder?",
    answer:
      "Nepali Legal Aid Finder is a platform that connects individuals seeking legal assistance with qualified legal professionals in Nepal. We aim to make legal services more accessible to everyone who needs them.",
    icon: <FaQuestion />,
  },
  {
    id: 2,
    question: "How can I schedule a consultation?",
    answer:
      "You can schedule a consultation by creating an account on our platform and selecting your preferred lawyer and time slot. Our online booking system is available 24/7 for your convenience.",
    icon: <FaCalendar />,
  },
  {
    id: 3,
    question: "Are the consultations free?",
    answer:
      "Initial consultations may be free depending on the lawyer. Each legal professional sets their own rates, which are clearly displayed on their profile before you schedule a consultation.",
    icon: <FaDollarSign />,
  },
  {
    id: 4,
    question: "How do I access case-related documents?",
    answer:
      'You can access all case-related documents through your secure personal dashboard. Simply log in to your account and navigate to the "Documents" section to view or download your files.',
    icon: <FaFileAlt />,
  },
  {
    id: 5,
    question: "How secure is my data on the platform?",
    answer:
      "We take data security very seriously. All data is encrypted using industry-standard protocols, and we comply with relevant data protection regulations to ensure your information remains confidential.",
    icon: <FaShieldAlt />,
  },
]

export default function FAQ() {
  const [activeId, setActiveId] = useState(null) // Changed from TypeScript type to null

  const toggleAccordion = (id) => {
    setActiveId(activeId === id ? null : id)
  }

  return (
    <div className="faq-container">
      <div className="faq-header">
        <h1>Frequently Asked Questions</h1>
        <p>Find answers to common questions about our services.</p>
      </div>

      <div className="faq-list">
        {faqData.map((item) => (
          <div key={item.id} className={`faq-item ${activeId === item.id ? "active" : ""}`}>
            <button
              className="faq-question"
              onClick={() => toggleAccordion(item.id)}
              aria-expanded={activeId === item.id}
            >
              <span className="faq-icon">{item.icon}</span>
              <span className="question-text">{item.question}</span>
              <FaChevronDown className="chevron-icon" />
            </button>
            <div className="faq-answer">
              <div className="answer-content">{item.answer}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
