import { Mail, Phone, MapPin, MessageSquare, Clock, AlertCircle } from "lucide-react";
import Link from "next/link";

export const metadata = {
  title: "Contact Us | EduCore",
  description: "Get in touch with EduCore. We're here to help with support, sales inquiries, and partnership opportunities.",
};

export default function ContactUs() {
  const supportChannels = [
    {
      icon: Mail,
      title: "Email Support",
      contact: "support@educore.com",
      description: "General support and technical issues",
      responseTime: "24-48 hours",
    },
    {
      icon: Phone,
      title: "Phone Support",
      contact: "+1 (555) 123-4567",
      description: "For urgent matters and priority support",
      responseTime: "Business hours",
    },
    {
      icon: MessageSquare,
      title: "Live Chat",
      contact: "In-app support chat",
      description: "Quick answers during business hours",
      responseTime: "15-30 minutes",
    },
  ];

  const departments = [
    {
      name: "General Support",
      email: "support@educore.com",
      description: "Technical issues, account help, and general questions",
    },
    {
      name: "Sales & Partnerships",
      email: "sales@educore.com",
      description: "School licenses, bulk pricing, and partnerships",
    },
    {
      name: "Privacy & Security",
      email: "privacy@educore.com",
      description: "Data protection, security inquiries, and FERPA concerns",
    },
    {
      name: "Billing",
      email: "billing@educore.com",
      description: "Invoice questions, payment issues, and subscriptions",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-blue-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <article className="max-w-4xl mx-auto px-6 py-12 lg:py-16">
        {/* Page Introduction */}
        <div className="mb-12">
          <h1 className="text-4xl lg:text-5xl font-bold text-slate-900 dark:text-white mb-4 leading-tight">
            Get in Touch
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-300 mb-6">
            Have questions about EduCore? We're here to help. Reach out through any of these channels.
          </p>
        </div>

        {/* Quick Support Channels */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {supportChannels.map((channel) => {
            const Icon = channel.icon;
            return (
              <div
                key={channel.title}
                className="bg-white dark:bg-slate-800 rounded-lg p-6 border border-blue-100 dark:border-slate-700 hover:border-blue-300 dark:hover:border-blue-500 transition-colors"
              >
                <Icon className="w-8 h-8 text-blue-600 dark:text-blue-400 mb-3" />
                <h3 className="font-semibold text-slate-900 dark:text-white mb-1">
                  {channel.title}
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">
                  {channel.description}
                </p>
                <a
                  href={
                    channel.title === "Email Support"
                      ? `mailto:${channel.contact}`
                      : channel.title === "Phone Support"
                      ? `tel:${channel.contact.replace(/\D/g, "")}`
                      : "#"
                  }
                  className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium text-sm transition-colors"
                >
                  {channel.contact}
                </a>
                <div className="mt-3 pt-3 border-t border-slate-200 dark:border-slate-700">
                  <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    Response: {channel.responseTime}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Contact Form */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">
            Send us a Message
          </h2>
          <form className="bg-white dark:bg-slate-800 rounded-lg p-8 border border-blue-100 dark:border-slate-700 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="name" className="block text-sm font-semibold text-slate-900 dark:text-white mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  placeholder="John Doe"
                  className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-colors"
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-slate-900 dark:text-white mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="john@school.edu"
                  className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-colors"
                />
              </div>
            </div>

            <div>
              <label htmlFor="school" className="block text-sm font-semibold text-slate-900 dark:text-white mb-2">
                School Name
              </label>
              <input
                type="text"
                id="school"
                name="school"
                placeholder="Lincoln High School"
                className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-colors"
              />
            </div>

            <div>
              <label htmlFor="subject" className="block text-sm font-semibold text-slate-900 dark:text-white mb-2">
                Subject
              </label>
              <select
                id="subject"
                name="subject"
                className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-colors"
              >
                <option value="">Select a topic...</option>
                <option value="support">Technical Support</option>
                <option value="sales">Sales Inquiry</option>
                <option value="privacy">Privacy & Security</option>
                <option value="billing">Billing Question</option>
                <option value="feature">Feature Request</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <label htmlFor="message" className="block text-sm font-semibold text-slate-900 dark:text-white mb-2">
                Message
              </label>
              <textarea
                id="message"
                name="message"
                placeholder="Tell us how we can help..."
                rows={6}
                className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 transition-colors resize-none"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 dark:bg-blue-500 hover:bg-blue-700 dark:hover:bg-blue-600 text-white font-semibold py-3 rounded-lg transition-colors duration-200"
            >
              Send Message
            </button>
            <p className="text-xs text-slate-500 dark:text-slate-400 text-center">
              We typically respond within 24-48 hours.
            </p>
          </form>
        </section>

        {/* Department Directory */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">
            Department Directory
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {departments.map((dept) => (
              <div
                key={dept.name}
                className="bg-blue-50 dark:bg-slate-800/50 rounded-lg p-4 border border-blue-100 dark:border-slate-700"
              >
                <h3 className="font-semibold text-slate-900 dark:text-white mb-1">
                  {dept.name}
                </h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">
                  {dept.description}
                </p>
                <a
                  href={`mailto:${dept.email}`}
                  className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors text-sm font-medium"
                >
                  {dept.email}
                </a>
              </div>
            ))}
          </div>
        </section>

        {/* FAQ Section */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-6">
            Frequently Asked Questions
          </h2>
          <div className="space-y-4">
            {[
              {
                q: "What are your support hours?",
                a: "We provide support Monday-Friday, 8 AM - 6 PM EST. Urgent issues can be reported 24/7 via email.",
              },
              {
                q: "How quickly will I get a response?",
                a: "Live chat: 15-30 minutes. Email: 24-48 hours. Phone: immediate (during business hours).",
              },
              {
                q: "Do you offer training for new users?",
                a: "Yes! We provide onboarding training, webinars, and comprehensive documentation for all schools.",
              },
              {
                q: "How can I report a security issue?",
                a: "Please email security@educore.com with detailed information. We take security seriously and will respond promptly.",
              },
              {
                q: "What if I have FERPA or COPPA concerns?",
                a: "Contact our Privacy & Security team at privacy@educore.com. We're happy to discuss compliance and address any concerns.",
              },
              {
                q: "Can I schedule a demo or consultation?",
                a: "Absolutely! Email sales@educore.com to schedule a personalized demo with our team.",
              },
            ].map((faq, idx) => (
              <details
                key={idx}
                className="group bg-white dark:bg-slate-800 rounded-lg border border-blue-100 dark:border-slate-700 p-4 transition-colors hover:border-blue-300 dark:hover:border-blue-500"
              >
                <summary className="cursor-pointer flex items-start justify-between font-semibold text-slate-900 dark:text-white select-none">
                  <span className="text-left">{faq.q}</span>
                  <span className="text-blue-600 dark:text-blue-400 group-open:rotate-180 transition-transform flex-shrink-0 ml-2">
                    ▼
                  </span>
                </summary>
                <p className="text-slate-600 dark:text-slate-300 text-sm mt-3">
                  {faq.a}
                </p>
              </details>
            ))}
          </div>
        </section>

        {/* Status & Maintenance */}
        <section className="bg-amber-50 dark:bg-slate-800/50 rounded-lg p-6 border border-amber-200 dark:border-slate-700 mb-12">
          <div className="flex gap-3">
            <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-amber-900 dark:text-amber-100 mb-2">
                System Status
              </h3>
              <p className="text-sm text-amber-800 dark:text-amber-200">
                All systems are operating normally. For real-time updates on any issues, check our{" "}
                <a href="#" className="underline font-semibold hover:text-amber-950 dark:hover:text-amber-50 transition-colors">
                  status page
                </a>
                .
              </p>
            </div>
          </div>
        </section>

        {/* Legal Links */}
        <section className="bg-blue-50 dark:bg-slate-800/50 rounded-lg p-6 border border-blue-100 dark:border-slate-700">
          <h3 className="font-semibold text-slate-900 dark:text-white mb-4">
            Legal Documents
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Link
              href="/terms-of-service"
              className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors text-sm font-medium"
            >
              → Terms of Service
            </Link>
            <Link
              href="/privacy-policy"
              className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors text-sm font-medium"
            >
              → Privacy Policy
            </Link>
          </div>
        </section>
      </article>
    </div>
  );
}
