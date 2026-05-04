import { ArrowLeft, ExternalLink } from "lucide-react";
import Link from "next/link";

export const metadata = {
  title: "Terms of Service | EduCore",
  description: "Read our terms of service to understand how EduCore works and your rights and responsibilities.",
};

export default function TermsOfService() {
  const sections = [
    "acceptance",
    "account-registration",
    "acceptable-use",
    "intellectual-property",
    "student-data",
    "curriculum-content",
    "accounts-responsibility",
    "disclaimers",
    "limitation-liability",
    "indemnification",
    "third-party-links",
    "modifications",
    "termination",
    "governing-law",
    "contact",
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-blue-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
    
      <article className="max-w-4xl mx-auto px-6 py-12 lg:py-16">
        {/* Page Introduction */}
        <div className="mb-12">
          <h1 className="text-4xl lg:text-5xl font-bold text-slate-900 dark:text-white mb-4 leading-tight">
            Terms of Service
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-300 mb-6">
            Welcome to EduCore. These terms govern your use of our platform. Please read them carefully.
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
          {/* 1. Acceptance */}
          <section id="acceptance" className="scroll-mt-24">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
              1. Acceptance of Terms
            </h2>
            <div className="space-y-4 text-slate-700 dark:text-slate-300">
              <p>
                By accessing and using EduCore, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
              </p>
              <p>
                We may update these terms at any time. Your continued use of EduCore following the posting of revised terms means that you accept and agree to the changes.
              </p>
            </div>
          </section>

          {/* 2. Account Registration */}
          <section id="account-registration" className="scroll-mt-24">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
              2. Account Registration
            </h2>
            <div className="space-y-4 text-slate-700 dark:text-slate-300">
              <p>
                To use EduCore, you must register and create a school account. School administrators are responsible for all account credentials and activities conducted through their account.
              </p>
              <div className="bg-blue-50 dark:bg-slate-800/50 rounded-lg p-4 border-l-4 border-blue-500">
                <h3 className="font-semibold text-slate-900 dark:text-white mb-2">You agree to:</h3>
                <ul className="space-y-2 text-sm">
                  <li>• Provide accurate and complete registration information</li>
                  <li>• Maintain the confidentiality of your password</li>
                  <li>• Accept responsibility for all activities under your account</li>
                  <li>• Notify us immediately of unauthorized account use</li>
                </ul>
              </div>
            </div>
          </section>

          {/* 3. Acceptable Use */}
          <section id="acceptable-use" className="scroll-mt-24">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
              3. Acceptable Use Policy
            </h2>
            <div className="space-y-4 text-slate-700 dark:text-slate-300">
              <p>
                You agree not to use EduCore for any unlawful purpose or in any way that could damage, disable, or impair the platform. Prohibited conduct includes:
              </p>
              <ul className="space-y-3">
                <li className="flex gap-3">
                  <span className="text-blue-600 dark:text-blue-400 flex-shrink-0 font-bold">•</span>
                  <span>Uploading viruses, malware, or any code intended to harm the platform</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-blue-600 dark:text-blue-400 flex-shrink-0 font-bold">•</span>
                  <span>Attempting to gain unauthorized access to systems or data</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-blue-600 dark:text-blue-400 flex-shrink-0 font-bold">•</span>
                  <span>Harassing, threatening, or abusing other platform users</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-blue-600 dark:text-blue-400 flex-shrink-0 font-bold">•</span>
                  <span>Collecting or storing personal information of other users</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-blue-600 dark:text-blue-400 flex-shrink-0 font-bold">•</span>
                  <span>Using EduCore for commercial purposes not authorized by your school</span>
                </li>
              </ul>
            </div>
          </section>

          {/* 4. Intellectual Property */}
          <section id="intellectual-property" className="scroll-mt-24">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
              4. Intellectual Property Rights
            </h2>
            <div className="space-y-4 text-slate-700 dark:text-slate-300">
              <p>
                EduCore and all content, features, and functionality (including but not limited to all information, software, text, displays, images, video, and audio) are owned by EduCore, its licensors, or other providers of such material and are protected by copyright, trademark, and other intellectual property laws.
              </p>
              <div className="bg-amber-50 dark:bg-slate-800/50 rounded-lg p-4 border-l-4 border-amber-500">
                <p className="text-sm font-semibold text-slate-900 dark:text-white mb-2">Personal Use Only</p>
                <p className="text-sm">
                  You may download and print sections of EduCore solely for your school's internal educational purposes. Commercial redistribution or unauthorized modification is strictly prohibited.
                </p>
              </div>
            </div>
          </section>

          {/* 5. Student Data Protection */}
          <section id="student-data" className="scroll-mt-24">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
              5. Student Data & Privacy
            </h2>
            <div className="space-y-4 text-slate-700 dark:text-slate-300">
              <p>
                EduCore takes student data protection seriously. Schools retain all ownership rights to student records and educational content created within EduCore.
              </p>
              <div className="space-y-3">
                <h3 className="font-semibold text-slate-900 dark:text-white">Your Responsibilities:</h3>
                <ul className="space-y-2 text-sm">
                  <li className="flex gap-3">
                    <span className="text-blue-600 dark:text-blue-400 flex-shrink-0">✓</span>
                    <span>Maintain appropriate access controls to student data</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-blue-600 dark:text-blue-400 flex-shrink-0">✓</span>
                    <span>Comply with FERPA, COPPA, GDPR, and applicable data protection laws</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-blue-600 dark:text-blue-400 flex-shrink-0">✓</span>
                    <span>Notify parents/guardians as required by applicable law</span>
                  </li>
                  <li className="flex gap-3">
                    <span className="text-blue-600 dark:text-blue-400 flex-shrink-0">✓</span>
                    <span>Request immediate deletion upon student withdrawal or school request</span>
                  </li>
                </ul>
              </div>
            </div>
          </section>

          {/* 6. Curriculum Content */}
          <section id="curriculum-content" className="scroll-mt-24">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
              6. Educational Content
            </h2>
            <div className="space-y-4 text-slate-700 dark:text-slate-300">
              <p>
                EduCore provides templates and frameworks for educational content, but schools are responsible for ensuring all curriculum, teaching materials, and student assessments comply with:
              </p>
              <ul className="space-y-2">
                <li className="flex gap-3">
                  <span className="text-blue-600 dark:text-blue-400 flex-shrink-0">•</span>
                  <span>State and federal education standards</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-blue-600 dark:text-blue-400 flex-shrink-0">•</span>
                  <span>District policies and curriculum frameworks</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-blue-600 dark:text-blue-400 flex-shrink-0">•</span>
                  <span>Copyright and licensing laws</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-blue-600 dark:text-blue-400 flex-shrink-0">•</span>
                  <span>Accessibility requirements (WCAG, ADA)</span>
                </li>
              </ul>
            </div>
          </section>

          {/* 7. User Responsibility */}
          <section id="accounts-responsibility" className="scroll-mt-24">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
              7. Your Responsibilities
            </h2>
            <div className="space-y-4 text-slate-700 dark:text-slate-300">
              <p>
                Schools using EduCore agree that they:
              </p>
              <ul className="space-y-2">
                <li className="flex gap-3">
                  <span className="text-blue-600 dark:text-blue-400 flex-shrink-0 font-bold">→</span>
                  <span>Have the authority to authorize users to access EduCore</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-blue-600 dark:text-blue-400 flex-shrink-0 font-bold">→</span>
                  <span>Are responsible for maintaining secure credentials and account access</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-blue-600 dark:text-blue-400 flex-shrink-0 font-bold">→</span>
                  <span>Will promptly remove access for transferred or terminated staff</span>
                </li>
                <li className="flex gap-3">
                  <span className="text-blue-600 dark:text-blue-400 flex-shrink-0 font-bold">→</span>
                  <span>Indemnify EduCore for unauthorized or misuse of accounts</span>
                </li>
              </ul>
            </div>
          </section>

          {/* 8. Disclaimers */}
          <section id="disclaimers" className="scroll-mt-24">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
              8. Disclaimers
            </h2>
            <div className="space-y-4 text-slate-700 dark:text-slate-300">
              <p className="font-semibold text-slate-900 dark:text-white">
                EduCore is provided on an "AS IS" and "AS AVAILABLE" basis.
              </p>
              <p>
                We disclaim all warranties, express or implied, including but not limited to warranties of merchantability, fitness for a particular purpose, and non-infringement. We make no representation that the platform will meet your requirements or that it will be uninterrupted, timely, secure, or error-free.
              </p>
              <div className="bg-red-50 dark:bg-slate-800/50 rounded-lg p-4 border-l-4 border-red-500">
                <p className="text-sm">
                  EduCore is not responsible for: data loss, service interruptions, security breaches resulting from user negligence, or third-party service failures.
                </p>
              </div>
            </div>
          </section>

          {/* 9. Limitation of Liability */}
          <section id="limitation-liability" className="scroll-mt-24">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
              9. Limitation of Liability
            </h2>
            <div className="space-y-4 text-slate-700 dark:text-slate-300">
              <p>
                To the fullest extent permissible under applicable law, in no event shall EduCore, its directors, employees, or agents be liable for any indirect, incidental, special, consequential, or punitive damages, including loss of data, loss of profits, or business interruption, even if advised of the possibility of such damages.
              </p>
              <p>
                The maximum liability of EduCore for any claim arising out of or relating to these terms shall not exceed the fees paid by your school in the 12 months preceding the claim.
              </p>
            </div>
          </section>

          {/* 10. Indemnification */}
          <section id="indemnification" className="scroll-mt-24">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
              10. Indemnification
            </h2>
            <div className="space-y-4 text-slate-700 dark:text-slate-300">
              <p>
                You agree to indemnify, defend, and hold harmless EduCore and its officers, directors, employees, and agents from any claims, damages, losses, liabilities, and expenses (including reasonable attorneys' fees) arising from:
              </p>
              <ul className="space-y-2 text-sm">
                <li>• Your use of EduCore in violation of these terms</li>
                <li>• Content you upload or create in violation of intellectual property rights</li>
                <li>• Your breach of applicable laws or regulations</li>
                <li>• Any violation of third-party rights by your use of the platform</li>
              </ul>
            </div>
          </section>

          {/* 11. Third-Party Links */}
          <section id="third-party-links" className="scroll-mt-24">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
              11. Third-Party Links & Services
            </h2>
            <div className="space-y-4 text-slate-700 dark:text-slate-300">
              <p>
                EduCore may contain links to third-party websites and services. We are not responsible for the content, accuracy, or practices of external sites. Your access to and use of third-party services is at your own risk and subject to their terms of service and privacy policies.
              </p>
              <p>
                Please review the terms and privacy policies of any third-party service before providing personal or educational information.
              </p>
            </div>
          </section>

          {/* 12. Modifications */}
          <section id="modifications" className="scroll-mt-24">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
              12. Modifications to Service
            </h2>
            <div className="space-y-4 text-slate-700 dark:text-slate-300">
              <p>
                EduCore may modify or discontinue services at any time, with or without notice. We will strive to provide reasonable advance notice of significant changes that materially affect functionality.
              </p>
              <p>
                We are not liable to you or any third party for any modification, suspension, or discontinuation of EduCore or any feature thereof.
              </p>
            </div>
          </section>

          {/* 13. Termination */}
          <section id="termination" className="scroll-mt-24">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
              13. Termination of Account
            </h2>
            <div className="space-y-4 text-slate-700 dark:text-slate-300">
              <p>
                We may suspend or terminate your account if you violate these terms or engage in conduct that we believe is harmful to EduCore or other users.
              </p>
              <p>
                Schools may request account termination at any time by contacting our support team. Upon termination, you remain responsible for all charges incurred up to the termination date.
              </p>
              <div className="bg-blue-50 dark:bg-slate-800/50 rounded-lg p-4 border-l-4 border-blue-500">
                <p className="text-sm">
                  <strong>Data Handling upon Termination:</strong> Schools must request and download a complete data export before account termination. EduCore will securely delete all account data 30 days after termination.
                </p>
              </div>
            </div>
          </section>

          {/* 14. Governing Law */}
          <section id="governing-law" className="scroll-mt-24">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
              14. Governing Law & Jurisdiction
            </h2>
            <div className="space-y-4 text-slate-700 dark:text-slate-300">
              <p>
                These terms shall be governed by and construed in accordance with the laws of the United States, without regard to its conflict of laws provisions.
              </p>
              <p>
                Any legal action or proceeding relating to these terms shall be brought exclusively in the federal or state courts of the United States, and you consent to the personal jurisdiction and venue of those courts.
              </p>
            </div>
          </section>

          {/* 15. Contact */}
          <section id="contact" className="scroll-mt-24">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
              15. Contact Us
            </h2>
            <div className="space-y-4 text-slate-700 dark:text-slate-300">
              <p>
                If you have questions about these Terms of Service, please contact us:
              </p>
              <div className="bg-blue-50 dark:bg-slate-800/50 rounded-lg p-6 border border-blue-100 dark:border-slate-700">
                <div className="space-y-3">
                  <div>
                    <p className="text-sm font-semibold text-slate-900 dark:text-white">Email</p>
                    <a href="mailto:support@educore.com" className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors">
                      support@educore.com
                    </a>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-900 dark:text-white">Address</p>
                    <p>EduCore Inc.<br />Education Technology Division<br />United States</p>
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
              These Terms of Service were last updated in April 2026. EduCore reserves the right to modify these terms at any time. Continued use of the platform following modifications constitutes acceptance of the updated terms.
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
