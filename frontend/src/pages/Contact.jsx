import React, { useState, useContext, useEffect, useRef } from "react";
import Title from "../components/Title";
import { assets } from "../assets/assets";
import { ShopContext } from "../context/ShopContext";
import RippleButton from "../components/RippleButton";
import JustValidate from "just-validate";

const Contact = () => {
  const { submitContact, contactLoading } = useContext(ShopContext);
  const validateRef = useRef(null);
  const formRef = useRef(null);

  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  useEffect(() => {
    if (!formRef.current) return;

    if (validateRef.current) {
      validateRef.current.destroy();
    }

    const validate = new JustValidate(formRef.current, {
      errorFieldCssClass: "border-red-500",
      errorLabelCssClass: "text-red-500 text-sm mt-1",
      focusInvalidField: true,
    });

    validate
      .addField("#name", [
        { rule: "required", errorMessage: "Please enter your name" },
        { rule: "minLength", value: 3, errorMessage: "Minimum 3 characters" },
      ], { errorsContainer: "#name-error" })

      .addField("#email", [
        { rule: "required", errorMessage: "Please enter your email" },
        { rule: "email", errorMessage: "Enter valid email" },
      ], { errorsContainer: "#email-error" })

      .addField("#subject", [
        { rule: "required", errorMessage: "Please enter subject" },
      ], { errorsContainer: "#subject-error" })

      .addField("#message", [
        { rule: "required", errorMessage: "Please enter message" },
        { rule: "minLength", value: 10, errorMessage: "Minimum 10 characters" },
      ], { errorsContainer: "#message-error" })

      .onSuccess(() => {
        handleSubmit();
      });

    validateRef.current = validate;

    return () => {
      validate.destroy();
    };
  }, []);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = () => {
    submitContact(form);
    setForm({ name: "", email: "", subject: "", message: "" });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 via-white to-white px-5 pt-[100px] md:px-10">

      {/* Title */}
      <div className="text-center text-3xl pt-16 border-t border-emerald-100">
        <Title text1={"CONTACT"} text2={"US"} />
      </div>

      <div className="my-16 flex flex-col lg:flex-row gap-12 max-w-7xl mx-auto">

        {/* LEFT SIDE */}
        <div className="flex-1 flex flex-col gap-8">
          <div className="bg-white rounded-3xl border border-emerald-100 shadow-lg overflow-hidden">
            <img
              src={assets.contact_img}
              alt="contact"
              className="w-full object-cover"
            />
          </div>

          <div className="bg-white p-6 rounded-2xl border border-emerald-100 shadow-sm">
            <p className="font-semibold text-xl text-slate-800 mb-3">
              Our Store
            </p>
            <p className="text-slate-600">
              54709 Willms Station <br />
              Suite 350, Washington, USA
            </p>
            <p className="text-slate-600 mt-3">
              Tel: (415) 555-0132 <br />
              Email: admin@forever.com
            </p>
          </div>
        </div>

        {/* RIGHT SIDE FORM */}
        <div className="flex-1 bg-white p-8 rounded-3xl border border-emerald-100 shadow-xl">
          <p className="font-semibold text-2xl mb-6 text-slate-900">
            Send us a message
          </p>

          <form ref={formRef} className="flex flex-col gap-5" noValidate>

            {/* Name */}
            <div>
              <input
                id="name"
                type="text"
                name="name"
                placeholder="Your Name"
                value={form.name}
                onChange={handleChange}
                className="border border-emerald-200 px-4 py-3 rounded-xl w-full focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
              <div id="name-error"></div>
            </div>

            {/* Email */}
            <div>
              <input
                id="email"
                type="email"
                name="email"
                placeholder="Your Email"
                value={form.email}
                onChange={handleChange}
                className="border border-emerald-200 px-4 py-3 rounded-xl w-full focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
              <div id="email-error"></div>
            </div>

            {/* Subject */}
            <div>
              <input
                id="subject"
                type="text"
                name="subject"
                placeholder="Subject"
                value={form.subject}
                onChange={handleChange}
                className="border border-emerald-200 px-4 py-3 rounded-xl w-full focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
              <div id="subject-error"></div>
            </div>

            {/* Message */}
            <div>
              <textarea
                id="message"
                name="message"
                placeholder="Message"
                value={form.message}
                onChange={handleChange}
                rows={5}
                className="border border-emerald-200 px-4 py-3 rounded-xl w-full focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
              <div id="message-error"></div>
            </div>

            <RippleButton
              type="submit"
              disabled={contactLoading}
              className="mt-4 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-2xl py-3 font-semibold hover:scale-105 transition"
            >
              {contactLoading ? "Sending..." : "Send Message"}
            </RippleButton>

          </form>
        </div>
      </div>
    </div>
  );
};

export default Contact;
