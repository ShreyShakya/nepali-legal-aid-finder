import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Scale } from "lucide-react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import styles from "./LawyerProfile.module.css";

const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

const slideUp = {
  hidden: { y: 30, opacity: 0 },
  visible: { y: 0, opacity: 1 },
};

export default function LawyerProfile() {
  const { id } = useParams();
  const [lawyer, setLawyer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [appointmentDate, setAppointmentDate] = useState(new Date());
  const [bookedTimes, setBookedTimes] = useState([]);
  const [isTimeSlotAvailable, setIsTimeSlotAvailable] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchLawyer = async () => {
      setLoading(true);
      setError("");
      try {
        const response = await axios.get(`http://127.0.0.1:5000/api/lawyer/${id}`);
        const fetchedLawyer = response.data.lawyer;

        if (fetchedLawyer.working_hours_start && fetchedLawyer.working_hours_end) {
          const [startHours, startMinutes] = fetchedLawyer.working_hours_start.split(':').map(Number);
          const [endHours, endMinutes] = fetchedLawyer.working_hours_end.split(':').map(Number);
          fetchedLawyer.workingHoursStart = new Date();
          fetchedLawyer.workingHoursStart.setHours(startHours, startMinutes, 0);
          fetchedLawyer.workingHoursEnd = new Date();
          fetchedLawyer.workingHoursEnd.setHours(endHours, endMinutes, 0);
        }

        setLawyer(fetchedLawyer);
        fetchBookedTimes(id);
      } catch (err) {
        setError(err.response?.data?.error || "Failed to fetch lawyer details.");
      } finally {
        setLoading(false);
      }
    };

    fetchLawyer();
  }, [id]);

  const fetchBookedTimes = async (lawyerId) => {
    try {
      const response = await axios.get(`http://127.0.0.1:5000/api/lawyer-appointments/${lawyerId}`);
      const appointments = response.data.appointments || [];
      const times = appointments.map((appt) => new Date(appt.appointment_date));
      setBookedTimes(times);
      checkTimeSlotAvailability(appointmentDate, times);
    } catch (err) {
      console.error("Failed to fetch booked times:", err);
    }
  };

  const checkTimeSlotAvailability = (selectedTime, bookedTimesArray) => {
    const isBooked = bookedTimesArray.some((booked) => {
      const diff = Math.abs(new Date(booked) - new Date(selectedTime)) / (1000 * 60);
      return diff < 30;
    });
    setIsTimeSlotAvailable(!isBooked);
  };

  const handleBookAppointment = () => {
    const token = localStorage.getItem('clientToken');
    if (!token) {
      navigate('/client-registration');
      return;
    }
    if (lawyer.availability_status === "Busy") {
      alert("This lawyer is currently busy and not accepting appointments.");
      return;
    }
    setShowModal(true);
  };

  const filterTime = (time) => {
    if (!lawyer?.workingHoursStart || !lawyer?.workingHoursEnd) return true;

    const selectedTime = new Date(time);
    const hours = selectedTime.getHours();
    const minutes = selectedTime.getMinutes();
    const startHours = lawyer.workingHoursStart.getHours();
    const startMinutes = lawyer.workingHoursStart.getMinutes();
    const endHours = lawyer.workingHoursEnd.getHours();
    const endMinutes = lawyer.workingHoursEnd.getMinutes();

    const isWithinWorkingHours =
      (hours > startHours || (hours === startHours && minutes >= startMinutes)) &&
      (hours < endHours || (hours === endHours && minutes <= endMinutes));

    const isBooked = bookedTimes.some((booked) => {
      const diff = Math.abs(new Date(booked) - selectedTime) / (1000 * 60);
      return diff < 30;
    });

    return isWithinWorkingHours && !isBooked;
  };

  const handleDateChange = (date) => {
    setAppointmentDate(date);
    checkTimeSlotAvailability(date, bookedTimes);
  };

  const handleSubmitAppointment = async () => {
    if (!isTimeSlotAvailable) {
      alert("This time slot is already booked. Please select another time.");
      return;
    }

    const token = localStorage.getItem('clientToken');
    try {
      await axios.post(
        'http://127.0.0.1:5000/api/book-appointment',
        {
          lawyer_id: id,
          appointment_date: appointmentDate.toISOString(),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      alert("Appointment booked successfully!");
      setShowModal(false);
      fetchBookedTimes(id);
    } catch (err) {
      const errorMessage = err.response?.data?.error || "Failed to book appointment.";
      alert(errorMessage);
    }
  };

  const handleBack = () => {
    navigate('/browse-lawyers');
  };

  const handleImageError = (e) => {
    e.target.style.display = 'none';
    e.target.nextSibling.style.display = 'flex';
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div className={styles.error}>{error}</div>;
  if (!lawyer) return <div>Lawyer not found.</div>;

  return (
    <motion.div
      className={styles.lawyerProfile}
      initial="hidden"
      animate="visible"
      variants={fadeIn}
    >
      <header className={styles.header}>
        <div className={styles.container}>
          <a href="/">
          <div className={styles.logo}>
            <Scale className={styles.logoIcon} />
            <span>NepaliLegalAidFinder</span>
          </div>
          </a>
          <nav className={styles.mainNav}>
            <ul>
              <li><a href="/">Home</a></li>
              <li><a href="/browse-lawyers">Browse Lawyers</a></li>
              <li><a href="/client-login">Client Login</a></li>
              <li><a href="/lawyer-login">Lawyer Login</a></li>
            </ul>
          </nav>
        </div>
      </header>

      <section className={styles.profileSection}>
        <div className={styles.container}>
          <motion.div className={styles.profileContent} variants={slideUp}>
            <button onClick={handleBack} className={styles.backButton}>
              Back to Browse Lawyers
            </button>

            <div className={styles.profileHeader}>
              <div className={styles.profileImage}>
                {lawyer.profile_picture ? (
                  <>
                    <img
                      src={`http://127.0.0.1:5000${lawyer.profile_picture}`}
                      alt={lawyer.name}
                      className={styles.profilePicture}
                      onError={handleImageError}
                    />
                    <div
                      className={styles.placeholderPicture}
                      style={{ display: 'none' }}
                    >
                      No Image
                    </div>
                  </>
                ) : (
                  <div className={styles.placeholderPicture}>No Image</div>
                )}
              </div>
              <div className={styles.profileInfo}>
                <h1>{lawyer.name}</h1>
                <p className={styles.specialization}>
                  <strong>Specialization:</strong> {lawyer.specialization || 'Not specified'}
                </p>
                <p>
                  <strong>Location:</strong> {lawyer.location || 'Not specified'}
                </p>
                <p>
                  <strong>Rating:</strong> {lawyer.rating ? lawyer.rating.toFixed(1) : 'Not rated'}
                </p>
                <p>
                  <strong>Availability:</strong> {lawyer.availability_status || 'Not specified'}
                </p>
                <button
                  onClick={handleBookAppointment}
                  className={`${styles.bookButton} ${
                    lawyer.availability_status === "Busy" ? styles.disabledButton : ""
                  }`}
                  disabled={lawyer.availability_status === "Busy"}
                >
                  Book an Appointment
                </button>
              </div>
            </div>

            <div className={styles.profileDetails}>
              <h2>About {lawyer.name}</h2>
              <p>{lawyer.bio || 'No bio available.'}</p>

              <h2>Contact Information</h2>
              <p>
                <strong>Preferred Contact Method:</strong> {lawyer.preferred_contact || 'Not specified'}
              </p>
              <p>
                <strong>Working Hours:</strong> {lawyer.working_hours_start} - {lawyer.working_hours_end}
              </p>
              <p>
                <strong>Email Notifications:</strong> {lawyer.email_notifications ? 'Enabled' : 'Disabled'}
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {showModal && (
        <div className={styles.modalOverlay}>
          <motion.div
            className={styles.modal}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
          >
            <h2>Book an Appointment with {lawyer.name}</h2>
            <div className={styles.modalContent}>
              <label>Select Date and Time:</label>
              <DatePicker
                selected={appointmentDate}
                onChange={handleDateChange}
                showTimeSelect
                timeFormat="HH:mm"
                timeIntervals={15}
                dateFormat="MMMM d, yyyy h:mm aa"
                minDate={new Date()}
                filterTime={filterTime}
                className={styles.datePicker}
              />
              <p className={styles.note}>
                Note: Appointments must be within working hours ({lawyer.working_hours_start} - {lawyer.working_hours_end}).
              </p>
              {!isTimeSlotAvailable && (
                <p className={styles.errorMessage}>
                  This time slot is already booked. Please select another time.
                </p>
              )}
            </div>
            <div className={styles.modalActions}>
              <button
                onClick={() => setShowModal(false)}
                className={styles.cancelButton}
              >
                Cancel
              </button>
              <button
                onClick={handleSubmitAppointment}
                className={styles.submitButton}
                disabled={!isTimeSlotAvailable}
              >
                Confirm Appointment
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </motion.div>
  );
}