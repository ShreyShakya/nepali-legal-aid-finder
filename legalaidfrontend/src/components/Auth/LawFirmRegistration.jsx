"use client"

import { useState } from "react"
import { Scale, Building, ArrowLeft, CheckCircle } from "lucide-react"
import styles from "./LawFirmRegistration.module.css"

function LawFirmRegistration() {
  const [formStep, setFormStep] = useState(1)
  const [formSubmitted, setFormSubmitted] = useState(false)

  const [formData, setFormData] = useState({
    firmName: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    country: "",
    phone: "",
    email: "",
    website: "",
    taxId: "",
    establishedYear: "",
    description: "",
    logo: null,
  })

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })
  }

  const handleFileChange = (e) => {
    setFormData({
      ...formData,
      logo: e.target.files[0],
    })
  }

  const nextStep = () => {
    setFormStep(formStep + 1)
    window.scrollTo(0, 0)
  }

  const prevStep = () => {
    setFormStep(formStep - 1)
    window.scrollTo(0, 0)
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formDataToSend = new FormData();
    formDataToSend.append('user_id', '1'); // Replace with actual user ID
    formDataToSend.append('firmName', formData.firmName);
    formDataToSend.append('address', formData.address);
    formDataToSend.append('city', formData.city);
    formDataToSend.append('state', formData.state);
    formDataToSend.append('zipCode', formData.zipCode);
    formDataToSend.append('country', formData.country);
    formDataToSend.append('phone', formData.phone);
    formDataToSend.append('email', formData.email);
    formDataToSend.append('website', formData.website);
    formDataToSend.append('taxId', formData.taxId);
    formDataToSend.append('establishedYear', formData.establishedYear);
    formDataToSend.append('description', formData.description);
    formDataToSend.append('logo', formData.logo);

    try {
        const response = await fetch('/register_law_firm', {
            method: 'POST',
            body: formDataToSend,
        });

        if (response.ok) {
            setFormSubmitted(true);
            window.scrollTo(0, 0);
        } else {
            console.error('Registration failed');
        }
    } catch (error) {
        console.error('Error:', error);
    }
  }

  return (
    <div className={styles.registrationContainer}>
      <main className={styles.mainContent}>
        {formSubmitted ? (
          <div className={styles.successCard}>
            <div className={styles.successIcon}>
              <CheckCircle size={48} />
            </div>
            <h2>Registration Successful!</h2>
            <p>
              Your law firm has been registered successfully. Our team will review your information and contact you
              shortly.
            </p>
            <div className={styles.successActions}>
              <a href="/" className={styles.primaryButton}>
                Return to Home
              </a>
              <a href="/login" className={styles.secondaryButton}>
                Login to Dashboard
              </a>
            </div>
          </div>
        ) : (
          <>
            <div className={styles.pageHeader}>
              <h1>Register Your Law Firm</h1>
              <p>Join our platform to connect with clients and manage your practice efficiently</p>
            </div>
            <form className={styles.registrationForm} onSubmit={handleSubmit}>
              {formStep === 1 && (
                <div className={styles.formCard}>
                  <div className={styles.cardHeader}>
                    <Building className={styles.cardIcon} />
                    <h2>Law Firm Information</h2>
                  </div>
                  <div className={styles.formSection}>
                    <div className={styles.formRow}>
                      <div className={styles.formGroup}>
                        <label htmlFor="firmName">Firm Name *</label>
                        <input
                          type="text"
                          id="firmName"
                          name="firmName"
                          value={formData.firmName}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                      <div className={styles.formGroup}>
                        <label htmlFor="establishedYear">Year Established</label>
                        <input
                          type="number"
                          id="establishedYear"
                          name="establishedYear"
                          value={formData.establishedYear}
                          onChange={handleInputChange}
                          min="1900"
                          max={new Date().getFullYear()}
                        />
                      </div>
                    </div>
                    <div className={styles.formRow}>
                      <div className={styles.formGroup}>
                        <label htmlFor="address">Address *</label>
                        <input
                          type="text"
                          id="address"
                          name="address"
                          value={formData.address}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                    </div>
                    <div className={styles.formRow}>
                      <div className={styles.formGroup}>
                        <label htmlFor="city">City *</label>
                        <input
                          type="text"
                          id="city"
                          name="city"
                          value={formData.city}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                      <div className={styles.formGroup}>
                        <label htmlFor="state">State/Province *</label>
                        <input
                          type="text"
                          id="state"
                          name="state"
                          value={formData.state}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                    </div>
                    <div className={styles.formRow}>
                      <div className={styles.formGroup}>
                        <label htmlFor="zipCode">Zip/Postal Code *</label>
                        <input
                          type="text"
                          id="zipCode"
                          name="zipCode"
                          value={formData.zipCode}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                      <div className={styles.formGroup}>
                        <label htmlFor="country">Country *</label>
                        <input
                          type="text"
                          id="country"
                          name="country"
                          value={formData.country}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                    </div>
                    <div className={styles.formRow}>
                      <div className={styles.formGroup}>
                        <label htmlFor="phone">Phone Number *</label>
                        <input
                          type="tel"
                          id="phone"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                      <div className={styles.formGroup}>
                        <label htmlFor="email">Email Address *</label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                    </div>
                    <div className={styles.formRow}>
                      <div className={styles.formGroup}>
                        <label htmlFor="website">Website</label>
                        <input
                          type="url"
                          id="website"
                          name="website"
                          value={formData.website}
                          onChange={handleInputChange}
                          placeholder="https://"
                        />
                      </div>
                      <div className={styles.formGroup}>
                        <label htmlFor="taxId">Tax ID / Registration Number</label>
                        <input
                          type="text"
                          id="taxId"
                          name="taxId"
                          value={formData.taxId}
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>
                    <div className={styles.formGroup}>
                      <label htmlFor="description">Firm Description</label>
                      <textarea
                        id="description"
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                        rows={4}
                        placeholder="Tell us about your law firm, its history, mission, and values..."
                      ></textarea>
                    </div>
                    <div className={styles.formGroup}>
                      <label htmlFor="logo">Firm Logo</label>
                      <div className={styles.fileUpload}>
                        <input type="file" id="logo" name="logo" onChange={handleFileChange} accept="image/*" />
                        <p className={styles.fileHint}>Recommended size: 300x300px, Max: 2MB</p>
                      </div>
                    </div>
                  </div>
                  <div className={styles.formActions}>
                    <button type="submit" className={styles.submitButton}>
                      Register Law Firm
                    </button>
                  </div>
                </div>
              )}
            </form>
          </>
        )}
      </main>
    </div>
  )
}

export default LawFirmRegistration