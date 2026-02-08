import React, { useState } from "react";
import { FiMail, FiSend, FiCheck } from "react-icons/fi";

const NewsletterBox = () => {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  const onSubmitHandler = (event) => {
    event.preventDefault();
    if (email) {
      setIsSubmitted(true);
      setTimeout(() => {
        setIsSubmitted(false);
        setEmail("");
      }, 3000);
    }
  };

  return (
    <div className="relative py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">

      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-emerald-600 via-teal-600 to-emerald-700"></div>

      {/* Soft Blobs */}
      <div className="absolute -top-20 -left-20 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-blob" />
      <div className="absolute -bottom-20 -right-20 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-blob animation-delay-2000" />

      {/* Content */}
      <div className="relative max-w-4xl mx-auto text-center text-white">

        {/* Icon */}
        <div className="inline-flex items-center justify-center w-20 h-20 bg-white/15 backdrop-blur rounded-full mb-6 animate-float">
          <FiMail className="w-10 h-10" />
        </div>

        {/* Heading */}
        <h2 className="text-3xl md:text-5xl font-bold mb-4 animate-fade-in-up">
          Subscribe & Get 20% Off
        </h2>

        {/* Subheading */}
        <p className="text-white/90 text-lg mb-8 max-w-2xl mx-auto animate-fade-in-up animation-delay-200">
          Join our newsletter to receive exclusive offers, latest collections,
          and special discounts directly in your inbox.
        </p>

        {/* Form */}
        <form
          onSubmit={onSubmitHandler}
          className="max-w-2xl mx-auto animate-fade-in-up animation-delay-400"
        >
          <div className="flex flex-col sm:flex-row gap-4 p-2 bg-white/95 backdrop-blur rounded-2xl shadow-2xl">

            {/* Email Input */}
            <div className="flex-1 flex items-center gap-3 px-4">
              <FiMail className="w-5 h-5 text-slate-400" />
              <input
                type="email"
                placeholder="Enter your email address"
                className="flex-1 py-4 bg-transparent outline-none text-slate-900 placeholder:text-slate-400"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitted}
              className={`group px-8 py-4 rounded-xl font-semibold text-white transition-all duration-300 flex items-center justify-center gap-2
                ${
                  isSubmitted
                    ? "bg-emerald-600"
                    : "bg-gradient-to-r from-emerald-600 to-teal-600 hover:shadow-xl hover:scale-105"
                }`}
            >
              {isSubmitted ? (
                <>
                  <FiCheck className="w-5 h-5" />
                  <span className="hidden sm:inline">Subscribed!</span>
                </>
              ) : (
                <>
                  <span>Subscribe</span>
                  <FiSend className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </div>

          {/* Privacy */}
          <p className="mt-4 text-white/70 text-sm">
            🔒 We respect your privacy. Unsubscribe anytime.
          </p>
        </form>

        {/* Features */}
        <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-6">
          {[
            { icon: "🎁", text: "Exclusive Deals" },
            { icon: "📦", text: "Early Access" },
            { icon: "✨", text: "Special Offers" },
          ].map((item, index) => (
            <div
              key={index}
              className="flex flex-col items-center gap-2 p-4 bg-white/10 backdrop-blur rounded-2xl animate-slide-in-left"
              style={{ animationDelay: `${index * 120}ms` }}
            >
              <span className="text-3xl">{item.icon}</span>
              <span className="text-sm font-medium">{item.text}</span>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
};

export default NewsletterBox;
