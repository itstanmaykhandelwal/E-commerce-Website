import React, { useEffect, useRef, useState } from "react";

import Title from "../components/Title";

import { assets } from "../assets/assets";

import RippleButton from "../components/RippleButton";

import JustValidate from "just-validate";

import { toast } from "react-toastify";

// SERVICE
import { submitContactForm } from "../services/contactService";

const Contact = () => {
    const validateRef = useRef(null);

    const formRef = useRef(null);

    const [contactLoading, setContactLoading] = useState(false);

    const [form, setForm] = useState({
        name: "",
        email: "",
        subject: "",
        message: "",
    });

    // VALIDATION
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

            .addField(
                "#name",
                [
                    {
                        rule: "required",
                        errorMessage: "Please enter your name",
                    },
                    {
                        rule: "minLength",
                        value: 3,
                        errorMessage: "Minimum 3 characters",
                    },
                ],
                {
                    errorsContainer: "#name-error",
                },
            )

            .addField(
                "#email",
                [
                    {
                        rule: "required",
                        errorMessage: "Please enter your email",
                    },
                    {
                        rule: "email",
                        errorMessage: "Enter valid email",
                    },
                ],
                {
                    errorsContainer: "#email-error",
                },
            )

            .addField(
                "#subject",
                [
                    {
                        rule: "required",
                        errorMessage: "Please enter subject",
                    },
                ],
                {
                    errorsContainer: "#subject-error",
                },
            )

            .addField(
                "#message",
                [
                    {
                        rule: "required",
                        errorMessage: "Please enter message",
                    },
                    {
                        rule: "minLength",
                        value: 10,
                        errorMessage: "Minimum 10 characters",
                    },
                ],
                {
                    errorsContainer: "#message-error",
                },
            )

            .onSuccess(() => {
                handleSubmit();
            });

        validateRef.current = validate;

        return () => {
            validate.destroy();
        };
    }, []);

    // HANDLE INPUT
    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value,
        });
    };

    // SUBMIT FORM
    const handleSubmit = async () => {
        try {
            setContactLoading(true);

            const data = await submitContactForm(form);

            if (data.success) {
                toast.success("Message sent successfully");

                setForm({
                    name: "",
                    email: "",
                    subject: "",
                    message: "",
                });
            } else {
                toast.error(data.message || "Something went wrong");
            }
        } catch (error) {
            console.log(error);

            toast.error("Failed to send message");
        } finally {
            setContactLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-white px-5 pt-[100px] md:px-10">
            {/* TITLE */}
            <div className="text-center text-3xl pt-16 border-t border-gray-200">
                <Title text1={"CONTACT"} text2={"US"} />
            </div>

            <div className="my-16 flex flex-col lg:flex-row gap-12 max-w-7xl mx-auto">
                {/* LEFT */}
                <div className="flex-1 flex flex-col gap-8">
                    <div className="bg-white rounded-3xl border border-gray-200 shadow-lg overflow-hidden">
                        <img
                            src={assets.contact_img}
                            alt="contact"
                            className="w-full object-cover"
                        />
                    </div>

                    <div className="bg-gradient-to-br from-sky-50 to-slate-100 p-6 rounded-3xl border border-gray-200 shadow-sm">
                        <p className="font-semibold text-2xl text-[#1E3A5F] mb-4">
                            Our Store
                        </p>

                        <p className="text-slate-600 leading-relaxed">
                            54709 Willms Station
                            <br />
                            Suite 350, Washington, USA
                        </p>

                        <p className="text-slate-600 mt-4 leading-relaxed">
                            Tel: (415) 555-0132
                            <br />
                            Email: admin@forever.com
                        </p>
                    </div>
                </div>

                {/* FORM */}
                <div className="flex-1 bg-white p-8 rounded-3xl border border-gray-200 shadow-lg">
                    <p className="font-semibold text-3xl mb-6 text-[#1E3A5F]">
                        Send us a message
                    </p>

                    <form
                        ref={formRef}
                        className="flex flex-col gap-5"
                        noValidate
                    >
                        {/* NAME */}
                        <div>
                            <input
                                id="name"
                                type="text"
                                name="name"
                                placeholder="Your Name"
                                value={form.name}
                                onChange={handleChange}
                                className="border border-gray-300 px-4 py-3 rounded-xl w-full focus:outline-none focus:ring-2 focus:ring-black focus:border-black transition"
                            />

                            <div id="name-error"></div>
                        </div>

                        {/* EMAIL */}
                        <div>
                            <input
                                id="email"
                                type="email"
                                name="email"
                                placeholder="Your Email"
                                value={form.email}
                                onChange={handleChange}
                                className="border border-gray-300 px-4 py-3 rounded-xl w-full focus:outline-none focus:ring-2 focus:ring-black focus:border-black transition"
                            />

                            <div id="email-error"></div>
                        </div>

                        {/* SUBJECT */}
                        <div>
                            <input
                                id="subject"
                                type="text"
                                name="subject"
                                placeholder="Subject"
                                value={form.subject}
                                onChange={handleChange}
                                className="border border-gray-300 px-4 py-3 rounded-xl w-full focus:outline-none focus:ring-2 focus:ring-black focus:border-black transition"
                            />

                            <div id="subject-error"></div>
                        </div>

                        {/* MESSAGE */}
                        <div>
                            <textarea
                                id="message"
                                name="message"
                                placeholder="Message"
                                value={form.message}
                                onChange={handleChange}
                                rows={5}
                                className="border border-gray-300 px-4 py-3 rounded-xl w-full focus:outline-none focus:ring-2 focus:ring-black focus:border-black transition"
                            />

                            <div id="message-error"></div>
                        </div>

                        {/* BUTTON */}
                        <div className="mt-2">
                            <RippleButton
                                type="submit"
                                disabled={contactLoading}
                            >
                                {contactLoading ? "Sending..." : "Send Message"}
                            </RippleButton>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Contact;
