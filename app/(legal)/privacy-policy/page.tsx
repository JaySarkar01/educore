import { ArrowLeft, ExternalLink } from "lucide-react";
import Link from "next/link";

export const metadata = {
  title: "Privacy Policy | EduCore",
  description: "Learn how EduCore collects, uses, and protects your data. We're committed to safeguarding student privacy and complying with FERPA, COPPA, and GDPR.",
};

export default function PrivacyPolicy() {
  const sections = [
    "introduction",
    "information-we-collect",
    "how-we-use-information",
    "data-sharing",
    "student-data-protection",
    "security",
    "cookies-tracking",
    "retention",
    "user-rights",
    "children-privacy",
    "international-transfers",
    "third-party-services",
    "updates",
    "contact",
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-blue-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
    

      <article className="max-w-4xl mx-auto px-6 py-12 lg:py-16">
        {/* Page Introduction */}
        <div className="mb-12">
          <h1 className="text-4xl lg:text-5xl font-bold text-slate-900 dark:text-white mb-4 leading-tight">
            Privacy Policy
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-300 mb-6">
            Your privacy matters to us. Learn how EduCore collects, uses, and protects your information.
          </p>
          <div className="flex flex-wrap gap-4 text-sm text-slate-600 dark:text-slate-400">
            <div className="flex items-center gap-2">
              <span className="text-blue-600 dark:text-blue-400">Last updated:</span>
              <span>April 2026</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-blue-600 dark:text-blue-400">Effective date:</span>
              <span>May 1, 2026</span>
            </div>
          </div>
        </div>

        {/* Table of Contents */}
        <div className="bg-blue-50 dark:bg-slate-800/50 rounded-lg p-6 mb-12 border border-blue-100 dark:border-slate-700">
          <h2 className="text-sm font-semibold text-slate-900 dark:text-white uppercase tracking-wide mb-4">
            Quick Navigation
          </h2>
          <nav className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {sections.map((section) => (
              <a
                key={section}
                href={`#${section}`}
                className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors text-sm"
              >
                • {section.replace(/-/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())}
              </a>
            ))}
          </nav>
        </div>

        {/* Content Sections */}
        <div className="space-y-10">
          {/* 1. Introduction */}
          <section id="introduction" className="scroll-mt-24">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
              1. Introduction
            </h2>
            <div className="space-y-4 text-slate-700 dark:text-slate-300">
              <p>
                EduCore ("we," "our," or "Company") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and otherwise process your information when you use our website, applications, and services (collectively, the "Service").
              </p>
              <p>
                We comply with applicable data protection laws including FERPA (Family Educational Rights and Privacy Act), COPPA (Children's Online Privacy Protection Act), GDPR (General Data Protection Regulation), and other relevant regulations. If you have questions about our privacy practices, please review this entire policy or contact us at the address provided below.
              </p>
            </div>
          </section>

          {/* 2. Information We Collect */}
          <section id="information-we-collect" className="scroll-mt-24">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
              2. Information We Collect
            </h2>
            <div className="space-y-6 text-slate-700 dark:text-slate-300">
              <div>
                <h3 className="font-semibold text-slate-900 dark:text-white mb-3">School Account Information</h3>
                <p>When you create a school account, we collect:</p>
                <ul className="mt-3 space-y-2 text-sm">
                  <li className="flex gap-3">
                    <span className="text-blue-600 dark:text-blue-400 flex-shrink-0">•</span>
                    <span>School name, address, phone number, and email</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-blue-600 dark:text-blue-400 flex-shrink-0">•</span>
                    <span>Administrator name, email, and hashed passwords</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-blue-600 dark:text-blue-400 flex-shrink-0">•</span>
                    <span>Billing and payment information</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-blue-600 dark:text-blue-400 flex-shrink-0">•</span>
                    <span>School district and grade information</span>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-slate-900 dark:text-white mb-3">User Information</h3>
                <p>When staff, teachers, or administrators use EduCore, we collect:</p>
                <ul className="mt-3 space-y-2 text-sm">
                  <li className="flex gap-3">
                    <span className="text-blue-600 dark:text-blue-400 flex-shrink-0">•</span>
                    <span>Name, email, and role within the school</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-blue-600 dark:text-blue-400 flex-shrink-0">•</span>
                    <span>Login credentials and authentication data</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-blue-600 dark:text-blue-400 flex-shrink-0">•</span>
                    <span>IP address, browser type, and device information</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-blue-600 dark:text-blue-400 flex-shrink-0">•</span>
                    <span>Activity logs and usage patterns</span>
                  </li>
                </ul>
              </div>

              <div className="bg-red-50 dark:bg-slate-800/50 rounded-lg p-4 border-l-4 border-red-500">
                <h3 className="font-semibold text-slate-900 dark:text-white mb-2">Student Data</h3>
                <p className="text-sm">
                  Schools upload and maintain student records including names, IDs, grades, attendance, behavioral records, and academic assessments. <strong>This data is owned and controlled entirely by the school.</strong> EduCore acts as a data processor under the direction of the school.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-slate-900 dark:text-white mb-3">Automatically Collected Information</h3>
                <ul className="space-y-2 text-sm">
                  <li className="flex gap-3">
                    <span className="text-blue-600 dark:text-blue-400 flex-shrink-0">•</span>
                    <span>Log files (access times, pages viewed, referrer information)</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-blue-600 dark:text-blue-400 flex-shrink-0">•</span>
                    <span>Cookies and similar tracking technologies</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-blue-600 dark:text-blue-400 flex-shrink-0">•</span>
                    <span>Performance and analytics data</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-blue-600 dark:text-blue-400 flex-shrink-0">•</span>
                    <span>Error reports and system diagnostics</span>
                  </li>
                </ul>
              </div>
            </div>
          </section>

          {/* 3. How We Use Information */}
          <section id="how-we-use-information" className="scroll-mt-24">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
              3. How We Use Your Information
            </h2>
            <div className="space-y-4 text-slate-700 dark:text-slate-300">
              <p>We use collected information for these purposes:</p>
              <div className="space-y-3">
                <div className="flex gap-4">
                  <div className="text-blue-600 dark:text-blue-400 font-bold flex-shrink-0">✓</div>
                  <div>
                    <h3 className="font-semibold text-slate-900 dark:text-white">Service Delivery</h3>
                    <p className="text-sm">Providing, maintaining, and improving EduCore features</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="text-blue-600 dark:text-blue-400 font-bold flex-shrink-0">✓</div>
                  <div>
                    <h3 className="font-semibold text-slate-900 dark:text-white">Authentication & Security</h3>
                    <p className="text-sm">Verifying user identity and protecting against fraud</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="text-blue-600 dark:text-blue-400 font-bold flex-shrink-0">✓</div>
                  <div>
                    <h3 className="font-semibold text-slate-900 dark:text-white">Communication</h3>
                    <p className="text-sm">Sending service updates, security alerts, and support responses</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="text-blue-600 dark:text-blue-400 font-bold flex-shrink-0">✓</div>
                  <div>
                    <h3 className="font-semibold text-slate-900 dark:text-white">Analytics & Improvement</h3>
                    <p className="text-sm">Analyzing usage patterns to enhance user experience</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="text-blue-600 dark:text-blue-400 font-bold flex-shrink-0">✓</div>
                  <div>
                    <h3 className="font-semibold text-slate-900 dark:text-white">Legal Compliance</h3>
                    <p className="text-sm">Meeting regulatory requirements and responding to lawful requests</p>
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="text-blue-600 dark:text-blue-400 font-bold flex-shrink-0">✓</div>
                  <div>
                    <h3 className="font-semibold text-slate-900 dark:text-white">Product Development</h3>
                    <p className="text-sm">Creating new features and improving existing functionality</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* 4. Data Sharing */}
          <section id="data-sharing" className="scroll-mt-24">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
              4. Data Sharing & Disclosure
            </h2>
            <div className="space-y-4 text-slate-700 dark:text-slate-300">
              <p>
                We do not sell personal information or student data. We may share information in these limited circumstances:
              </p>

              <div className="bg-blue-50 dark:bg-slate-800/50 rounded-lg p-4 border-l-4 border-blue-500">
                <h3 className="font-semibold text-slate-900 dark:text-white mb-3">Service Providers</h3>
                <p className="text-sm">
                  We share information with third-party vendors (hosting providers, payment processors, analytics services) who process data on our behalf under strict data processing agreements.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-slate-900 dark:text-white mb-2">Legal Requirements</h3>
                <p className="text-sm">
                  We may disclose information if required by law, court order, or government request. We will provide notice where legally permitted.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-slate-900 dark:text-white mb-2">School Authorization</h3>
                <p className="text-sm">
                  Schools may authorize EduCore to share specific data with third-party educational services, parents, or authorized representatives. We honor only explicit written authorization from school administrators.
                </p>
              </div>

              <div className="bg-amber-50 dark:bg-slate-800/50 rounded-lg p-4 border-l-4 border-amber-500">
                <h3 className="font-semibold text-slate-900 dark:text-white mb-2">We Do NOT:</h3>
                <ul className="space-y-1 text-sm">
                  <li>• Sell student data to third parties</li>
                  <li>• Use student data for behavioral advertising or marketing</li>
                  <li>• Share student records without school authorization</li>
                  <li>• Transfer data without proper safeguards</li>
                </ul>
              </div>
            </div>
          </section>

          {/* 5. Student Data Protection */}
          <section id="student-data-protection" className="scroll-mt-24">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
              5. Student Data Protection (FERPA & COPPA Compliance)
            </h2>
            <div className="space-y-4 text-slate-700 dark:text-slate-300">
              <p>
                EduCore is designed to comply with FERPA and COPPA, safeguarding educational records and student privacy:
              </p>

              <div>
                <h3 className="font-semibold text-slate-900 dark:text-white mb-3">FERPA Compliance</h3>
                <ul className="space-y-2 text-sm">
                  <li className="flex gap-3">
                    <span className="text-blue-600 dark:text-blue-400 flex-shrink-0">•</span>
                    <span>Schools retain ownership and control of all student educational records</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-blue-600 dark:text-blue-400 flex-shrink-0">•</span>
                    <span>We do not use student data for commercial purposes unrelated to education</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-blue-600 dark:text-blue-400 flex-shrink-0">•</span>
                    <span>We maintain records of data access and disclosures as required by law</span>
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-slate-900 dark:text-white mb-3">COPPA Compliance</h3>
                <ul className="space-y-2 text-sm">
                  <li className="flex gap-3">
                    <span className="text-blue-600 dark:text-blue-400 flex-shrink-0">•</span>
                    <span>We do not collect information from children under 13 directly</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-blue-600 dark:text-blue-400 flex-shrink-0">•</span>
                    <span>Schools provide verifiable parental consent for student participation</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-blue-600 dark:text-blue-400 flex-shrink-0">•</span>
                    <span>We limit collection to information necessary for educational purposes</span>
                  </li>
                </ul>
              </div>

              <div className="bg-blue-50 dark:bg-slate-800/50 rounded-lg p-4 border-l-4 border-blue-500">
                <h3 className="font-semibold text-slate-900 dark:text-white mb-2">School Responsibility</h3>
                <p className="text-sm">
                  Schools are responsible for providing proper parental notification and obtaining consent as required by FERPA and COPPA. Schools must ensure that parental authorization is in place before student data is uploaded to EduCore.
                </p>
              </div>
            </div>
          </section>

          {/* 6. Data Security */}
          <section id="security" className="scroll-mt-24">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
              6. Data Security
            </h2>
            <div className="space-y-4 text-slate-700 dark:text-slate-300">
              <p>
                We implement comprehensive security measures to protect your information:
              </p>

              <div className="space-y-3">
                <div className="flex gap-3">
                  <span className="text-green-600 dark:text-green-400 flex-shrink-0 font-bold">✓</span>
                  <div>
                    <h3 className="font-semibold text-slate-900 dark:text-white">Encryption</h3>
                    <p className="text-sm">All data transmitted over HTTPS using TLS 1.2+; sensitive data encrypted at rest</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <span className="text-green-600 dark:text-green-400 flex-shrink-0 font-bold">✓</span>
                  <div>
                    <h3 className="font-semibold text-slate-900 dark:text-white">Access Controls</h3>
                    <p className="text-sm">Role-based access, multi-factor authentication, and strict permission management</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <span className="text-green-600 dark:text-green-400 flex-shrink-0 font-bold">✓</span>
                  <div>
                    <h3 className="font-semibold text-slate-900 dark:text-white">Monitoring & Auditing</h3>
                    <p className="text-sm">Continuous monitoring for suspicious activity and regular security audits</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <span className="text-green-600 dark:text-green-400 flex-shrink-0 font-bold">✓</span>
                  <div>
                    <h3 className="font-semibold text-slate-900 dark:text-white">Incident Response</h3>
                    <p className="text-sm">Documented procedures for security breach detection and notification</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <span className="text-green-600 dark:text-green-400 flex-shrink-0 font-bold">✓</span>
                  <div>
                    <h3 className="font-semibold text-slate-900 dark:text-white">Employee Training</h3>
                    <p className="text-sm">Regular security training for all staff handling sensitive information</p>
                  </div>
                </div>
              </div>

              <div className="bg-red-50 dark:bg-slate-800/50 rounded-lg p-4 border-l-4 border-red-500">
                <p className="text-sm">
                  <strong>Important:</strong> While we maintain strong security practices, no system is completely immune to breaches. We encourage you to use strong passwords and report suspicious activity immediately.
                </p>
              </div>
            </div>
          </section>

          {/* 7. Cookies & Tracking */}
          <section id="cookies-tracking" className="scroll-mt-24">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
              7. Cookies & Tracking Technologies
            </h2>
            <div className="space-y-4 text-slate-700 dark:text-slate-300">
              <p>
                EduCore uses cookies and similar technologies to enhance your experience:
              </p>

              <div className="space-y-3">
                <div>
                  <h3 className="font-semibold text-slate-900 dark:text-white">Essential Cookies</h3>
                  <p className="text-sm">Required for authentication, security, and basic functionality. Cannot be disabled.</p>
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 dark:text-white">Analytics Cookies</h3>
                  <p className="text-sm">Help us understand how you use EduCore to improve performance and features.</p>
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 dark:text-white">Preference Cookies</h3>
                  <p className="text-sm">Remember your settings (theme, language, display preferences).</p>
                </div>
              </div>

              <div className="bg-blue-50 dark:bg-slate-800/50 rounded-lg p-4 border-l-4 border-blue-500">
                <p className="text-sm">
                  You can control cookies through your browser settings. Disabling certain cookies may affect functionality. We do not use cookies to track you across other websites.
                </p>
              </div>
            </div>
          </section>

          {/* 8. Data Retention */}
          <section id="retention" className="scroll-mt-24">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
              8. Data Retention
            </h2>
            <div className="space-y-4 text-slate-700 dark:text-slate-300">
              <p>
                We retain data for as long as necessary to provide services and comply with legal obligations:
              </p>

              <div className="space-y-3 text-sm">
                <div className="flex gap-4">
                  <span className="text-slate-900 dark:text-white font-semibold min-w-[140px]">School Accounts:</span>
                  <span>Retained during active subscription; archived for 1 year after cancellation</span>
                </div>
                <div className="flex gap-4">
                  <span className="text-slate-900 dark:text-white font-semibold min-w-[140px]">Student Records:</span>
                  <span>Retained per school's direction; deleted within 30 days of termination request</span>
                </div>
                <div className="flex gap-4">
                  <span className="text-slate-900 dark:text-white font-semibold min-w-[140px]">Log Files:</span>
                  <span>Retained for 90 days for security and compliance purposes</span>
                </div>
                <div className="flex gap-4">
                  <span className="text-slate-900 dark:text-white font-semibold min-w-[140px]">Backups:</span>
                  <span>Maintained as part of disaster recovery; deleted per legal retention schedule</span>
                </div>
              </div>

              <div className="bg-blue-50 dark:bg-slate-800/50 rounded-lg p-4 border-l-4 border-blue-500">
                <p className="text-sm">
                  <strong>Data Export & Deletion:</strong> Schools can request a complete data export at any time. Upon account termination, schools must request data deletion; we securely delete all data within 30 days.
                </p>
              </div>
            </div>
          </section>

          {/* 9. User Rights */}
          <section id="user-rights" className="scroll-mt-24">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
              9. Your Rights & Choices
            </h2>
            <div className="space-y-4 text-slate-700 dark:text-slate-300">
              <p>
                You have the following rights regarding your information:
              </p>

              <div className="space-y-3">
                <div className="flex gap-3">
                  <span className="text-blue-600 dark:text-blue-400 flex-shrink-0 font-bold">→</span>
                  <div>
                    <h3 className="font-semibold text-slate-900 dark:text-white">Right to Access</h3>
                    <p className="text-sm">Request a copy of your information collected by EduCore</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <span className="text-blue-600 dark:text-blue-400 flex-shrink-0 font-bold">→</span>
                  <div>
                    <h3 className="font-semibold text-slate-900 dark:text-white">Right to Correction</h3>
                    <p className="text-sm">Update inaccurate or incomplete information in your account</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <span className="text-blue-600 dark:text-blue-400 flex-shrink-0 font-bold">→</span>
                  <div>
                    <h3 className="font-semibold text-slate-900 dark:text-white">Right to Deletion</h3>
                    <p className="text-sm">Request deletion of your account and associated data</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <span className="text-blue-600 dark:text-blue-400 flex-shrink-0 font-bold">→</span>
                  <div>
                    <h3 className="font-semibold text-slate-900 dark:text-white">Right to Data Portability</h3>
                    <p className="text-sm">Export your data in a structured, machine-readable format</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <span className="text-blue-600 dark:text-blue-400 flex-shrink-0 font-bold">→</span>
                  <div>
                    <h3 className="font-semibold text-slate-900 dark:text-white">Right to Withdraw Consent</h3>
                    <p className="text-sm">Withdraw consent for optional data collection at any time</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <span className="text-blue-600 dark:text-blue-400 flex-shrink-0 font-bold">→</span>
                  <div>
                    <h3 className="font-semibold text-slate-900 dark:text-white">Right to Opt-Out</h3>
                    <p className="text-sm">Opt out of marketing communications and analytics (if non-essential)</p>
                  </div>
                </div>
              </div>

              <div>
                <p className="text-sm font-semibold text-slate-900 dark:text-white mb-2">
                  To exercise these rights, contact us at support@educore.com with your request and verification information.
                </p>
              </div>
            </div>
          </section>

          {/* 10. Children's Privacy */}
          <section id="children-privacy" className="scroll-mt-24">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
              10. Children's Privacy (COPPA)
            </h2>
            <div className="space-y-4 text-slate-700 dark:text-slate-300">
              <p>
                EduCore is designed for use by schools on behalf of students. We comply with COPPA by:
              </p>

              <ul className="space-y-2 text-sm">
                <li className="flex gap-3">
                  <span className="text-blue-600 dark:text-blue-400 flex-shrink-0">•</span>
                  <span>Not directly collecting information from children under 13</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-blue-600 dark:text-blue-400 flex-shrink-0">•</span>
                  <span>Requiring schools to provide parental consent before enrollment</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-blue-600 dark:text-blue-400 flex-shrink-0">•</span>
                  <span>Limiting student data collection to educational purposes only</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-blue-600 dark:text-blue-400 flex-shrink-0">•</span>
                  <span>Not using student data for behavioral advertising or marketing</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-blue-600 dark:text-blue-400 flex-shrink-0">•</span>
                  <span>Maintaining security safeguards appropriate for children's data</span>
                </li>
              </ul>

              <div className="bg-amber-50 dark:bg-slate-800/50 rounded-lg p-4 border-l-4 border-amber-500">
                <p className="text-sm">
                  <strong>Parents/Guardians:</strong> If you believe your child's information has been collected without proper consent, please contact us immediately at support@educore.com.
                </p>
              </div>
            </div>
          </section>

          {/* 11. International Data Transfers */}
          <section id="international-transfers" className="scroll-mt-24">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
              11. International Data Transfers
            </h2>
            <div className="space-y-4 text-slate-700 dark:text-slate-300">
              <p>
                EduCore operates primarily in the United States. If you access EduCore from outside the US, your information may be transferred to, stored in, and processed in the United States, which may have different privacy laws than your country.
              </p>

              <div className="bg-blue-50 dark:bg-slate-800/50 rounded-lg p-4 border-l-4 border-blue-500">
                <h3 className="font-semibold text-slate-900 dark:text-white mb-2">GDPR Compliance</h3>
                <p className="text-sm">
                  For schools in the EU, we provide appropriate safeguards for international data transfers, including Standard Contractual Clauses and other mechanisms required under GDPR.
                </p>
              </div>
            </div>
          </section>

          {/* 12. Third-Party Services */}
          <section id="third-party-services" className="scroll-mt-24">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
              12. Third-Party Services & Links
            </h2>
            <div className="space-y-4 text-slate-700 dark:text-slate-300">
              <p>
                EduCore may contain links to third-party websites and integrations. We are not responsible for the privacy practices of external services. We recommend reviewing third-party privacy policies before sharing information.
              </p>

              <div className="bg-blue-50 dark:bg-slate-800/50 rounded-lg p-4 border-l-4 border-blue-500">
                <h3 className="font-semibold text-slate-900 dark:text-white mb-2">Data Sharing with Third Parties</h3>
                <p className="text-sm mb-3">
                  We only share data with third-party services under strict Data Processing Agreements that require:
                </p>
                <ul className="space-y-1 text-sm">
                  <li>• Compliance with FERPA, COPPA, and GDPR</li>
                  <li>• Prohibition on selling or marketing to student data</li>
                  <li>• Encryption and security safeguards</li>
                  <li>• Liability for data breaches</li>
                </ul>
              </div>
            </div>
          </section>

          {/* 13. Policy Updates */}
          <section id="updates" className="scroll-mt-24">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
              13. Changes to This Policy
            </h2>
            <div className="space-y-4 text-slate-700 dark:text-slate-300">
              <p>
                We may update this Privacy Policy periodically to reflect changes in our practices, technology, legal requirements, or other factors. We will notify you of material changes by updating the "Last Updated" date and providing notice via email or dashboard alert.
              </p>
              <p>
                Your continued use of EduCore following the posting of modified Privacy Policy terms means you accept and agree to the changes. We encourage you to review this policy regularly.
              </p>
            </div>
          </section>

          {/* 14. Contact Us */}
          <section id="contact" className="scroll-mt-24">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
              14. Contact Us
            </h2>
            <div className="space-y-4 text-slate-700 dark:text-slate-300">
              <p>
                If you have questions about this Privacy Policy or believe we have violated your privacy rights, please contact us:
              </p>

              <div className="bg-blue-50 dark:bg-slate-800/50 rounded-lg p-6 border border-blue-100 dark:border-slate-700">
                <div className="space-y-4">
                  <div>
                    <p className="text-sm font-semibold text-slate-900 dark:text-white mb-1">Email</p>
                    <a href="mailto:privacy@educore.com" className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors">
                      privacy@educore.com
                    </a>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-900 dark:text-white mb-1">General Support</p>
                    <a href="mailto:support@educore.com" className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors">
                      support@educore.com
                    </a>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-900 dark:text-white mb-1">Mailing Address</p>
                    <p className="text-sm">EduCore Inc.<br />Privacy Department<br />United States</p>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-900 dark:text-white mb-1">Response Time</p>
                    <p className="text-sm">We aim to respond to all privacy inquiries within 30 days.</p>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* Footer Note */}
        <div className="mt-16 pt-8 border-t border-blue-100 dark:border-slate-800">
          <div className="bg-slate-50 dark:bg-slate-800/30 rounded-lg p-6">
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
              This Privacy Policy was last updated in April 2026 and is effective as of May 1, 2026. EduCore is committed to maintaining the highest standards of data protection and regulatory compliance.
            </p>
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
            >
              Return to Home
              <ExternalLink className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </article>
    </div>
  );
}
