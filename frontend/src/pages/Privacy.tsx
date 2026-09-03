import { Link } from "react-router-dom";
import {
  FaShieldAlt,
  FaUserShield,
  FaDatabase,
  FaLock,
  FaCookieBite,
  FaGoogle,
  FaEnvelope,
  FaTrashAlt,
} from "react-icons/fa";

function Privacy() {
  return (
    <main className="min-h-screen bg-[#050816] px-6 py-24 text-white md:px-10">
      <div className="mx-auto max-w-5xl">

        {/* HEADER */}

        <div className="mb-14 text-center">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl border border-blue-500/20 bg-blue-500/10">
            <FaShieldAlt className="text-3xl text-blue-400" />
          </div>

          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.25em] text-blue-400">
            Privacy & Security
          </p>

          <h1 className="text-4xl font-bold tracking-tight md:text-6xl">
            Privacy Policy
          </h1>

          <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-slate-400 md:text-lg">
            Your privacy matters to CareerPilot AI. This Privacy Policy
            explains what information we collect, why we use it, how we
            protect it, and what choices you have.
          </p>

          <p className="mt-5 text-sm text-slate-500">
            Effective date: August 25, 2026
          </p>
        </div>

        {/* POLICY CARD */}

        <div className="space-y-6">

          {/* 1 */}

          <section className="rounded-3xl border border-slate-800 bg-slate-900/60 p-7 shadow-xl backdrop-blur-xl md:p-9">
            <div className="mb-5 flex items-center gap-4">
              <div className="rounded-xl bg-blue-500/10 p-3">
                <FaUserShield className="text-xl text-blue-400" />
              </div>

              <h2 className="text-2xl font-bold">
                1. Who We Are
              </h2>
            </div>

            <p className="leading-8 text-slate-400">
              CareerPilot AI is an AI-powered career development platform
              designed to help students, fresh graduates and career seekers
              improve their resumes, prepare for interviews, discover
              opportunities and plan their career development.
            </p>

            <p className="mt-4 leading-8 text-slate-400">
              In this policy, "CareerPilot AI", "we", "our" or "us" refers
              to the CareerPilot AI platform and its operators.
            </p>
          </section>

          {/* 2 */}

          <section className="rounded-3xl border border-slate-800 bg-slate-900/60 p-7 shadow-xl backdrop-blur-xl md:p-9">
            <div className="mb-5 flex items-center gap-4">
              <div className="rounded-xl bg-purple-500/10 p-3">
                <FaDatabase className="text-xl text-purple-400" />
              </div>

              <h2 className="text-2xl font-bold">
                2. Information We May Collect
              </h2>
            </div>

            <p className="mb-5 leading-8 text-slate-400">
              Depending on the features you use, CareerPilot AI may process
              the following categories of information:
            </p>

            <div className="space-y-4">

              <div className="rounded-2xl border border-slate-800 bg-slate-950/50 p-5">
                <h3 className="font-semibold text-white">
                  Account Information
                </h3>

                <p className="mt-2 leading-7 text-slate-400">
                  This may include your name, email address, authentication
                  information and profile information that you provide when
                  creating or managing an account.
                </p>
              </div>

              <div className="rounded-2xl border border-slate-800 bg-slate-950/50 p-5">
                <h3 className="font-semibold text-white">
                  Resume & Career Information
                </h3>

                <p className="mt-2 leading-7 text-slate-400">
                  If you use our resume analysis features, we may process
                  information contained in your uploaded resume, including
                  education, skills, experience, projects and other career
                  information.
                </p>
              </div>

              <div className="rounded-2xl border border-slate-800 bg-slate-950/50 p-5">
                <h3 className="font-semibold text-white">
                  Communications
                </h3>

                <p className="mt-2 leading-7 text-slate-400">
                  If you contact us, we may receive the name, email address
                  and message or other information that you choose to provide.
                </p>
              </div>

              <div className="rounded-2xl border border-slate-800 bg-slate-950/50 p-5">
                <h3 className="font-semibold text-white">
                  Technical Information
                </h3>

                <p className="mt-2 leading-7 text-slate-400">
                  We may process technical information such as browser type,
                  device information, IP address, timestamps and basic
                  diagnostic information where necessary for security,
                  reliability and troubleshooting.
                </p>
              </div>
            </div>
          </section>

          {/* 3 */}

          <section className="rounded-3xl border border-slate-800 bg-slate-900/60 p-7 shadow-xl backdrop-blur-xl md:p-9">
            <h2 className="mb-5 text-2xl font-bold">
              3. How We Use Information
            </h2>

            <p className="mb-5 leading-8 text-slate-400">
              We use information only for legitimate purposes connected with
              providing and improving CareerPilot AI, including:
            </p>

            <ul className="space-y-3 text-slate-400">
              <li>• Creating and managing user accounts.</li>
              <li>• Providing resume analysis and ATS-related insights.</li>
              <li>• Providing career recommendations and career tools.</li>
              <li>• Supporting AI-powered interview and preparation features.</li>
              <li>• Improving platform functionality and user experience.</li>
              <li>• Preventing fraud, abuse and unauthorized access.</li>
              <li>• Responding to support and contact requests.</li>
              <li>• Maintaining platform security and reliability.</li>
            </ul>
          </section>

          {/* 4 */}

          <section className="rounded-3xl border border-slate-800 bg-slate-900/60 p-7 shadow-xl backdrop-blur-xl md:p-9">
            <h2 className="mb-5 text-2xl font-bold">
              4. AI & Automated Processing
            </h2>

            <p className="leading-8 text-slate-400">
              Some CareerPilot AI features use automated or AI-assisted
              processing to analyze career-related information and generate
              recommendations, resume insights, interview preparation and
              other career guidance.
            </p>

            <p className="mt-4 leading-8 text-slate-400">
              AI-generated recommendations are intended to assist users and
              should not be treated as guaranteed employment outcomes or
              professional advice.
            </p>
          </section>

          {/* 5 */}

          <section className="rounded-3xl border border-slate-800 bg-slate-900/60 p-7 shadow-xl backdrop-blur-xl md:p-9">
            <div className="mb-5 flex items-center gap-4">
              <div className="rounded-xl bg-red-500/10 p-3">
                <FaLock className="text-xl text-red-400" />
              </div>

              <h2 className="text-2xl font-bold">
                5. Security
              </h2>
            </div>

            <p className="leading-8 text-slate-400">
              We take reasonable technical and organizational measures to
              protect information against unauthorized access, alteration,
              disclosure, misuse or destruction.
            </p>

            <p className="mt-4 leading-8 text-slate-400">
              No internet-based service can guarantee absolute security.
              Users should also take reasonable steps to protect their
              account credentials and devices.
            </p>
          </section>

          {/* 6 */}

          <section className="rounded-3xl border border-slate-800 bg-slate-900/60 p-7 shadow-xl backdrop-blur-xl md:p-9">
            <div className="mb-5 flex items-center gap-4">
              <div className="rounded-xl bg-red-500/10 p-3">
                <FaTrashAlt className="text-xl text-red-400" />
              </div>

              <h2 className="text-2xl font-bold">
                6. Data Retention & Deletion
              </h2>
            </div>

            <p className="leading-8 text-slate-400">
              We retain information only for as long as reasonably necessary
              to provide the requested services, maintain security, comply
              with applicable obligations and resolve disputes.
            </p>

            <p className="mt-4 leading-8 text-slate-400">
              You may request deletion of personal information associated
              with your account, subject to legitimate legal, security or
              operational requirements.
            </p>
          </section>

          {/* 7 */}

          <section className="rounded-3xl border border-slate-800 bg-slate-900/60 p-7 shadow-xl backdrop-blur-xl md:p-9">
            <div className="mb-5 flex items-center gap-4">
              <div className="rounded-xl bg-green-500/10 p-3">
                <FaGoogle className="text-xl text-green-400" />
              </div>

              <h2 className="text-2xl font-bold">
                7. Third-Party Services
              </h2>
            </div>

            <p className="leading-8 text-slate-400">
              CareerPilot AI may use trusted third-party services to provide
              specific functionality, such as authentication, AI processing,
              analytics, hosting, communication and other infrastructure.
            </p>

            <p className="mt-4 leading-8 text-slate-400">
              For example, Google authentication may be used when a user
              chooses to sign in using Google. Third-party services may
              process information according to their own privacy policies.
            </p>

            <p className="mt-4 leading-8 text-slate-400">
              We do not sell users' personal information.
            </p>
          </section>

          {/* 8 */}

          <section className="rounded-3xl border border-slate-800 bg-slate-900/60 p-7 shadow-xl backdrop-blur-xl md:p-9">
            <div className="mb-5 flex items-center gap-4">
              <div className="rounded-xl bg-yellow-500/10 p-3">
                <FaCookieBite className="text-xl text-yellow-400" />
              </div>

              <h2 className="text-2xl font-bold">
                8. Cookies & Local Storage
              </h2>
            </div>

            <p className="leading-8 text-slate-400">
              CareerPilot AI may use browser storage technologies, including
              cookies or local storage, to support authentication, remember
              preferences, maintain functionality and improve the user
              experience.
            </p>

            <p className="mt-4 leading-8 text-slate-400">
              Your browser may allow you to control or delete cookies and
              stored website data. Disabling certain storage technologies may
              affect some platform functionality.
            </p>
          </section>

          {/* 9 */}

          <section className="rounded-3xl border border-slate-800 bg-slate-900/60 p-7 shadow-xl backdrop-blur-xl md:p-9">
            <h2 className="mb-5 text-2xl font-bold">
              9. Your Privacy Choices
            </h2>

            <p className="mb-5 leading-8 text-slate-400">
              Depending on applicable law, you may have rights relating to
              your personal information, including the ability to:
            </p>

            <ul className="space-y-3 text-slate-400">
              <li>• Request access to personal information we hold about you.</li>
              <li>• Request correction of inaccurate information.</li>
              <li>• Request deletion of eligible information.</li>
              <li>• Withdraw consent where processing is based on consent.</li>
              <li>• Ask questions about how your information is processed.</li>
              <li>• Contact us regarding privacy concerns.</li>
            </ul>
          </section>

          {/* 10 */}

          <section className="rounded-3xl border border-slate-800 bg-slate-900/60 p-7 shadow-xl backdrop-blur-xl md:p-9">
            <h2 className="mb-5 text-2xl font-bold">
              10. Children's Privacy
            </h2>

            <p className="leading-8 text-slate-400">
              CareerPilot AI is intended for students, graduates and adult
              users seeking career development services. We do not knowingly
              design the service to collect personal information from
              children in violation of applicable law.
            </p>
          </section>

          {/* 11 */}

          <section className="rounded-3xl border border-slate-800 bg-slate-900/60 p-7 shadow-xl backdrop-blur-xl md:p-9">
            <h2 className="mb-5 text-2xl font-bold">
              11. Policy Updates
            </h2>

            <p className="leading-8 text-slate-400">
              We may update this Privacy Policy when our services, technology,
              legal requirements or data practices change. The updated policy
              will be published on this page with a revised effective date.
            </p>
          </section>

          {/* 12 */}

          <section className="rounded-3xl border border-blue-500/20 bg-blue-500/5 p-7 shadow-xl backdrop-blur-xl md:p-9">
            <div className="mb-5 flex items-center gap-4">
              <div className="rounded-xl bg-blue-500/10 p-3">
                <FaEnvelope className="text-xl text-blue-400" />
              </div>

              <h2 className="text-2xl font-bold">
                12. Contact Us
              </h2>
            </div>

            <p className="leading-8 text-slate-400">
              If you have questions, concerns or requests regarding this
              Privacy Policy or your personal information, please contact
              CareerPilot AI through our Contact page.
            </p>

            <Link
              to="/contact"
              className="
                mt-6
                inline-flex
                items-center
                rounded-xl
                bg-blue-600
                px-6
                py-3
                font-semibold
                text-white
                transition
                hover:bg-blue-500
              "
            >
              Contact CareerPilot AI
            </Link>
          </section>

        </div>

        {/* FOOTER NOTE */}

        <div className="mt-12 text-center">
          <p className="text-sm leading-6 text-slate-500">
            This Privacy Policy is intended to transparently describe
            CareerPilot AI's current and planned privacy practices. It is not
            legal advice. Applicable privacy requirements may vary depending
            on where our users are located.
          </p>
        </div>

      </div>
    </main>
  );
}

export default Privacy;