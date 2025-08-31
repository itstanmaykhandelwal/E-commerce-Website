import React, { useState, useContext, useEffect, useRef } from "react";
import Title from "../components/Title";
import { assets } from "../assets/assets";
import { ShopContext } from "../context/ShopContext";
import RippleButton from "../components/RippleButton";
import JustValidate from "just-validate";

const Contact = () => {
    const { submitContact, contactLoading } = useContext(ShopContext);
    const [form, setForm] = useState({
        name: "",
        email: "",
        subject: "",
        message: "",
    });

    const formRef = useRef(null);

    useEffect(() => {
        if (!formRef.current) return;

        const validate = new JustValidate(formRef.current, {
            errorFieldCssClass: "border-red-500",
            focusInvalidField: true,
        });

        validate
            .addField("#name", [
                { rule: "required", errorMessage: "Please enter your name" },
                { rule: "minLength", value: 3, errorMessage: "At least 3 characters" },
            ])
            .addField("#email", [
                { rule: "required", errorMessage: "Please enter your email" },
                { rule: "email", errorMessage: "Enter a valid email" },
            ])
            .addField("#subject", [
                { rule: "required", errorMessage: "Please enter a subject" },
                { rule: "minLength", value: 3, errorMessage: "At least 3 characters" },
            ])
            .addField("#message", [
                { rule: "required", errorMessage: "Please enter your message" },
                { rule: "minLength", value: 10, errorMessage: "At least 10 characters" },
            ])
            .onSuccess(() => {
                handleSubmit();
            });

    }, [formRef]);

    const handleChange = (e) =>
        setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = () => {
        submitContact(form);
        setForm({ name: "", email: "", subject: "", message: "" });
    };

    return (
        <div className="px-5 md:px-10">
            <div className="text-center text-2xl pt-10 border-t">
                <Title text1={"CONTACT"} text2={"US"} />
            </div>

            <div className="my-10 flex flex-col md:flex-row gap-10 mb-28">
                {/* Left: Store Info */}
                <div className="flex-1 flex flex-col justify-center gap-6">
                    <img
                        className="w-full md:max-w-[480px] rounded-lg"
                        src={assets.contact_img}
                        alt="contact_img"
                    />
                    <p className="font-semibold text-xl text-gray-600">Our Store</p>
                    <p className="text-gray-500">
                        54709 Willms Station <br /> Suite 350, Washington, USA
                    </p>
                    <p className="text-gray-500">
                        Tel: (415) 555-0132 <br /> Email: admin@forever.com
                    </p>
                </div>

                {/* Right: Contact Form */}
                <div className="flex flex-col bg-gray-50 p-6 rounded-lg shadow-md h-[560px] w-[700px]">
                    <p className="font-semibold text-xl mb-4">Send us a message</p>
                    <form ref={formRef} className="flex flex-col gap-4" noValidate>
                        <div>
                            <input
                                id="name"
                                type="text"
                                name="name"
                                placeholder="Your Name"
                                value={form.name}
                                onChange={handleChange}
                                className="border px-3 py-2 rounded w-full focus:outline-none"
                            />
                        </div>
                        <div>
                            <input
                                id="email"
                                type="email"
                                name="email"
                                placeholder="Your Email"
                                value={form.email}
                                onChange={handleChange}
                                className="border px-3 py-2 rounded w-full focus:outline-none"
                            />
                        </div>
                        <div>
                            <input
                                id="subject"
                                type="text"
                                name="subject"
                                placeholder="Subject"
                                value={form.subject}
                                onChange={handleChange}
                                className="border px-3 py-2 rounded w-full focus:outline-none"
                            />
                        </div>
                        <div>
                            <textarea
                                id="message"
                                name="message"
                                placeholder="Message"
                                value={form.message}
                                onChange={handleChange}
                                rows={5}
                                className="border px-3 py-2 rounded w-full focus:outline-none"
                            />
                        </div>

                        <RippleButton
                            type="submit"
                            disabled={contactLoading}
                            className="mt-2"
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
