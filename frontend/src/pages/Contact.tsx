import { FormEvent, useState } from "react";
import emailjs from "@emailjs/browser";
import {
  FaEnvelope,
  FaPaperPlane,
} from "react-icons/fa";

function Contact() {
  const [submitted, setSubmitted] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState(false);

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    setSending(true);
    setSubmitted(false);
    setError(false);

    const form = event.currentTarget;

    try {
      await emailjs.sendForm(
        "service_7hxhfgc",
        "template_jzx8j14",
        form,
        {
          publicKey: "2NTH886TdKdLOcExL",
        }
      );

      setSubmitted(true);
      form.reset();
    } catch (error) {
      console.error("Email sending failed:", error);
      setError(true);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050816] text-white">
      <main className="max-w-6xl mx-auto px-6 md:px-10 pt-24 pb-24">
        <div className="grid lg:grid-cols-2 gap-12 items-start">

          {/* Information */}
          <div>
            <p className="text-blue-400 uppercase tracking-[0.3em] text-sm font-semibold">
              Contact & Support
            </p>

            <h1 className="text-4xl md:text-6xl font-bold mt-5 leading-tight">
              We're Here to
              <span className="text-blue-400"> Help</span>
            </h1>

            <p className="text-gray-400 text-lg leading-8 mt-6 max-w-xl">
              Have a question, suggestion, partnership idea, or feedback
              about CareerPilot AI? Send us a message and we'll get back
              to you.
            </p>

            {/* Email Information */}
            <div className="mt-10 rounded-3xl border border-white/10 bg-white/[0.04] p-7">
              <div className="flex items-start gap-5">
                <div className="w-12 h-12 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center text-xl">
                  <FaEnvelope />
                </div>

                <div>
                  <h3 className="font-bold text-lg">
                    Get in Touch
                  </h3>

                  <p className="text-gray-400 mt-1 leading-7">
                    Whether you need assistance, want to share feedback,
                    or have a question about CareerPilot AI, feel free
                    to reach out through the form.
                  </p>
                </div>
              </div>
            </div>

            {/* Support Information */}
            <div className="mt-5 rounded-3xl border border-white/10 bg-white/[0.04] p-7">
              <h3 className="font-bold text-lg mb-2">
                How Can We Help?
              </h3>

              <p className="text-gray-400 leading-7">
                We can help with questions about CareerPilot AI features,
                account-related concerns, career tools, feedback, and
                general support.
              </p>
            </div>
          </div>

          {/* Contact Form */}
          <div className="rounded-3xl border border-white/10 bg-white/[0.04] backdrop-blur-xl p-7 md:p-9">
            <h2 className="text-2xl font-bold mb-2">
              Send a Message
            </h2>

            <p className="text-gray-400 mb-8">
              Fill in the details below and we'll get back to you.
            </p>

            {/* Success Message */}
            {submitted && (
              <div className="mb-6 rounded-xl border border-green-400/20 bg-green-400/10 px-4 py-3 text-green-300">
                Your message has been sent successfully. We'll get
                back to you soon.
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="mb-6 rounded-xl border border-red-400/20 bg-red-400/10 px-4 py-3 text-red-300">
                Something went wrong while sending your message.
                Please try again.
              </div>
            )}

            <form
              onSubmit={handleSubmit}
              className="space-y-6"
            >
              {/* Name */}
              <div>
                <label className="block text-sm font-semibold mb-2">
                  Name
                </label>

                <input
                  type="text"
                  name="name"
                  placeholder="Enter your name"
                  required
                  disabled={sending}
                  className="
                    w-full
                    rounded-xl
                    border
                    border-white/10
                    bg-black/20
                    px-4
                    py-3.5
                    text-white
                    placeholder-gray-500
                    outline-none
                    focus:border-blue-400/60
                    transition
                    disabled:opacity-50
                  "
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-semibold mb-2">
                  Email
                </label>

                <input
                  type="email"
                  name="email"
                  placeholder="you@example.com"
                  required
                  disabled={sending}
                  className="
                    w-full
                    rounded-xl
                    border
                    border-white/10
                    bg-black/20
                    px-4
                    py-3.5
                    text-white
                    placeholder-gray-500
                    outline-none
                    focus:border-blue-400/60
                    transition
                    disabled:opacity-50
                  "
                />
              </div>

              {/* Message */}
              <div>
                <label className="block text-sm font-semibold mb-2">
                  Message
                </label>

                <textarea
                  name="message"
                  rows={6}
                  placeholder="Write your message..."
                  required
                  disabled={sending}
                  className="
                    w-full
                    resize-none
                    rounded-xl
                    border
                    border-white/10
                    bg-black/20
                    px-4
                    py-3.5
                    text-white
                    placeholder-gray-500
                    outline-none
                    focus:border-blue-400/60
                    transition
                    disabled:opacity-50
                  "
                />
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={sending}
                className="
                  w-full
                  flex
                  items-center
                  justify-center
                  gap-3
                  rounded-xl
                  bg-blue-500
                  px-6
                  py-3.5
                  font-bold
                  text-white
                  hover:bg-blue-400
                  hover:-translate-y-0.5
                  transition
                  disabled:cursor-not-allowed
                  disabled:opacity-60
                  disabled:hover:translate-y-0
                "
              >
                <FaPaperPlane />

                {sending
                  ? "Sending..."
                  : "Send Message"}
              </button>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Contact;