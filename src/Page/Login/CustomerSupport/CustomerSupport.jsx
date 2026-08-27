import React from "react";
import "./CustomerSupport.css";

function CustomerSupport({ onBack }) {
  const openWhatsApp = (number) => {
    const cleanNumber = number.replace(/\D/g, "");
    window.open(`https://wa.me/${cleanNumber}`, "_blank");
  };

  const openTelegram = () => {
    window.open("https://t.me/betzone72", "_blank");
  };

  const openEmail = () => {
    window.location.href =
      "mailto:betzone72@gmail.com?subject=BETZONE Customer Support";
  };

  return (
    <div className="support-page">

      {/* Animated background */}
      <div className="support-bg">
        <div className="orb orb-one"></div>
        <div className="orb orb-two"></div>
        <div className="orb orb-three"></div>
      </div>

      {/* Top Header */}
      <header className="support-header">

        <button
          type="button"
          className="support-back-btn"
          onClick={onBack}
        >
          <span>←</span>
          Back
        </button>

        <div className="support-logo">
          BET<span>ZONE</span>
        </div>

        <div className="online-status">
          <span className="online-dot"></span>
          Support Online
        </div>

      </header>

      {/* Main */}
      <main className="support-container">

        {/* Hero */}
        <section className="support-hero">

          <div className="support-crown">
            ♛
          </div>

          <div className="support-badge">
            <span className="badge-dot"></span>
            CUSTOMER SUPPORT
          </div>

          <h1>
            How can we
            <span> help you?</span>
          </h1>

          <p>
            Our support team is here to help you.
            Choose your preferred contact method
            and get in touch with BETZONE support.
          </p>

        </section>

        {/* Support Cards */}
        <section className="support-grid">

          {/* WhatsApp 1 */}
          <button
            type="button"
            className="support-card whatsapp-card"
            onClick={() =>
              openWhatsApp("+9779714532079")
            }
          >

            <div className="card-glow"></div>

            <div className="support-icon whatsapp-icon">
              <span>◉</span>
            </div>

            <div className="support-card-content">
              <div className="support-card-top">
                <span className="service-label">
                  WHATSAPP
                </span>

                <span className="arrow-icon">
                  ↗
                </span>
              </div>

              <h2>
                WhatsApp Support
              </h2>

              <p>
                Chat directly with our support team.
              </p>

              <div className="contact-number">
                +977 9714532079
              </div>
            </div>

            <div className="card-bottom-line">
              <span>Start Chat</span>
              <span>→</span>
            </div>

          </button>

          {/* WhatsApp 2 */}
          <button
            type="button"
            className="support-card whatsapp-card"
            onClick={() =>
              openWhatsApp("9821946727")
            }
          >

            <div className="card-glow"></div>

            <div className="support-icon whatsapp-icon">
              <span>◉</span>
            </div>

            <div className="support-card-content">
              <div className="support-card-top">
                <span className="service-label">
                  WHATSAPP
                </span>

                <span className="arrow-icon">
                  ↗
                </span>
              </div>

              <h2>
                WhatsApp Support
              </h2>

              <p>
                Contact our second support number.
              </p>

              <div className="contact-number">
                +977 9821946727
              </div>
            </div>

            <div className="card-bottom-line">
              <span>Start Chat</span>
              <span>→</span>
            </div>

          </button>

          {/* Telegram */}
          <button
            type="button"
            className="support-card telegram-card"
            onClick={openTelegram}
          >

            <div className="card-glow"></div>

            <div className="support-icon telegram-icon">
              <span>➤</span>
            </div>

            <div className="support-card-content">
              <div className="support-card-top">
                <span className="service-label">
                  TELEGRAM
                </span>

                <span className="arrow-icon">
                  ↗
                </span>
              </div>

              <h2>
                Telegram Support
              </h2>

              <p>
                Message our official Telegram support.
              </p>

              <div className="contact-number">
                @betzone72
              </div>
            </div>

            <div className="card-bottom-line">
              <span>Open Telegram</span>
              <span>→</span>
            </div>

          </button>

          {/* Email */}
          <button
            type="button"
            className="support-card email-card"
            onClick={openEmail}
          >

            <div className="card-glow"></div>

            <div className="support-icon email-icon">
              <span>✉</span>
            </div>

            <div className="support-card-content">
              <div className="support-card-top">
                <span className="service-label">
                  EMAIL
                </span>

                <span className="arrow-icon">
                  ↗
                </span>
              </div>

              <h2>
                Email Support
              </h2>

              <p>
                Send us your question by email.
              </p>

              <div className="contact-number email-address">
                betzone72@gmail.com
              </div>
            </div>

            <div className="card-bottom-line">
              <span>Send Email</span>
              <span>→</span>
            </div>

          </button>

        </section>

        {/* Bottom Info */}
        <section className="support-info">

          <div className="info-icon">
            ✓
          </div>

          <div>
            <strong>
              Need help with your account?
            </strong>

            <p>
              Please keep your account information
              private. Never share your password,
              OTP or security codes with anyone.
            </p>
          </div>

        </section>

        {/* Footer */}
        <footer className="support-footer">

          <div className="footer-logo">
            BET<span>ZONE</span>
          </div>

          <p>
            Customer Support Center
          </p>

          <div className="footer-contact">
            <span>WhatsApp</span>
            <span>Telegram</span>
            <span>Email</span>
          </div>

        </footer>

      </main>

    </div>
  );
}

export default CustomerSupport;