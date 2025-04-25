<template>
  <footer class="footer">
    <div class="footer-content">
      <div class="footer-section">
        <h3>Dashboard 1C</h3>
        <p class="footer-description">
          Powerful analytics and visualization tool for your 1C enterprise data
        </p>
        <div class="social-links">
          <a href="https://t.me/yourtelegram" target="_blank" title="Telegram">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M21.5 2L2 9.5l7 4L18 6l-5 11 8.5-8.5L21.5 2z"/>
            </svg>
          </a>
          <a href="https://github.com/yourgithub" target="_blank" title="GitHub">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/>
            </svg>
          </a>
          <a href="mailto:contact@example.com" target="_blank" title="Email">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
              <polyline points="22,6 12,13 2,6"/>
            </svg>
          </a>
        </div>
      </div>

      <div class="footer-section">
        <h4>Quick Links</h4>
        <ul>
          <li><a href="#dashboard">Dashboard</a></li>
          <li><a href="#reports">Reports</a></li>
          <li><a href="#analytics">Analytics</a></li>
          <li><a href="#settings">Settings</a></li>
        </ul>
      </div>

      <div class="footer-section">
        <h4>Resources</h4>
        <ul>
          <li><a href="#docs">Documentation</a></li>
          <li><a href="#api">API Reference</a></li>
          <li><a href="#support">Support</a></li>
          <li><a href="#faq">FAQ</a></li>
        </ul>
      </div>

      <div class="footer-section">
        <h4>Contact</h4>
        <ul class="contact-info">
          <li>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
              <circle cx="12" cy="10" r="3"/>
            </svg>
            Moscow, Russia
          </li>
          <li>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
            </svg>
            +7 (XXX) XXX-XX-XX
          </li>
        </ul>
      </div>
    </div>

    <div class="footer-bottom">
      <div class="footer-bottom-content">
        <p>&copy; {{ currentYear }} Dashboard 1C. All rights reserved.</p>
        <div class="footer-links">
          <a href="#privacy">Privacy Policy</a>
          <a href="#terms">Terms of Service</a>
        </div>
      </div>
    </div>
  </footer>
</template>

<script>
export default {
  name: 'Footer',
  computed: {
    currentYear() {
      return new Date().getFullYear()
    }
  }
}
</script>

<style scoped>
.footer {
  background: linear-gradient(to right, var(--background-dark), var(--background-light));
  color: var(--text-primary);
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  width: 100%;
  margin-top: auto;
}

.footer-content {
  max-width: 1920px;
  margin: 0 auto;
  padding: 64px 48px;
  display: grid;
  grid-template-columns: 2.5fr 1fr 1fr 1.5fr;
  gap: 80px;
}

.footer-section h3 {
  font-size: 2rem;
  font-weight: 600;
  margin: 0 0 24px;
  color: var(--text-primary);
  letter-spacing: 0.5px;
}

.footer-section h4 {
  font-size: 1.4rem;
  font-weight: 600;
  margin: 0 0 24px;
  color: var(--text-primary);
  letter-spacing: 0.3px;
}

.footer-description {
  margin: 0 0 40px;
  opacity: 0.8;
  line-height: 1.8;
  font-size: 1.2rem;
  max-width: 600px;
}

.social-links {
  display: flex;
  gap: 24px;
}

.social-links a {
  color: var(--text-primary);
  transition: all 0.3s ease;
  padding: 16px;
  border-radius: 14px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.social-links a:hover {
  transform: translateY(-4px);
  background: rgba(255, 255, 255, 0.1);
  border-color: rgba(255, 255, 255, 0.2);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
}

.social-links svg {
  width: 28px;
  height: 28px;
}

ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

ul li {
  margin-bottom: 20px;
}

ul li:last-child {
  margin-bottom: 0;
}

a {
  color: var(--text-primary);
  text-decoration: none;
  opacity: 0.8;
  transition: all 0.3s ease;
  font-size: 1.15rem;
  display: inline-block;
}

a:hover {
  opacity: 1;
  text-decoration: none;
  transform: translateX(8px);
}

.contact-info li {
  display: flex;
  align-items: center;
  gap: 16px;
  opacity: 0.8;
  font-size: 1.15rem;
  margin-bottom: 24px;
}

.contact-info svg {
  flex-shrink: 0;
  width: 24px;
  height: 24px;
}

.footer-bottom {
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  padding: 32px 0;
  background: rgba(0, 0, 0, 0.2);
}

.footer-bottom-content {
  max-width: 1920px;
  margin: 0 auto;
  padding: 0 48px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.footer-bottom p {
  margin: 0;
  opacity: 0.8;
  font-size: 1.1rem;
}

.footer-links {
  display: flex;
  gap: 40px;
}

@media (max-width: 1600px) {
  .footer-content,
  .footer-bottom-content {
    max-width: 100%;
    padding: 48px 40px;
  }

  .footer-bottom-content {
    padding: 0 40px;
  }
}

@media (max-width: 1200px) {
  .footer-content {
    grid-template-columns: 2fr 1fr 1fr;
    gap: 60px;
    padding: 40px;
  }

  .footer-section:last-child {
    grid-column: 1 / -1;
  }

  .footer-description {
    max-width: 500px;
  }
}

@media (max-width: 1024px) {
  .footer-content {
    grid-template-columns: 1fr 1fr;
    gap: 48px;
    padding: 40px 32px;
  }

  .footer-section:first-child {
    grid-column: 1 / -1;
  }

  .footer-description {
    max-width: 100%;
  }
}

@media (max-width: 768px) {
  .footer-content {
    grid-template-columns: 1fr;
    gap: 40px;
    padding: 32px 24px;
  }

  .footer-bottom-content {
    flex-direction: column;
    gap: 20px;
    text-align: center;
    padding: 0 24px;
  }

  .footer-section h3 {
    font-size: 1.8rem;
  }

  .footer-section h4 {
    font-size: 1.3rem;
  }

  .footer-description {
    font-size: 1.1rem;
  }

  a, .contact-info li {
    font-size: 1.1rem;
  }
}
</style> 