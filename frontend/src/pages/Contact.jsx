import React, { useState, useContext } from 'react'
import Title from '../components/Title'
import { assets } from '../assets/assets'
import NewsletterBox from '../components/NewsletterBox'
import { ShopContext } from '../context/ShopContext'

const Contact = () => {
    const { submitContact, contactLoading } = useContext(ShopContext)
    const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

    const handleSubmit = (e) => {
        e.preventDefault()
        submitContact(form)
        setForm({ name: '', email: '', subject: '', message: '' })
    }

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
                    <p className="font-semibold text-xl text-gray-600">
                        Our Store
                    </p>
                    <p className=" text-gray-500">
                        54709 Willms Station <br /> Suite 350, Washington, USA
                    </p>
                    <p className=" text-gray-500">
                        Tel: (415) 555-0132 <br /> Email: admin@forever.com
                    </p>
                </div>

                {/* Right: Contact Form */}
                <div className="flex flex-col bg-gray-50 p-6 rounded-lg shadow-md h-[500px] w-[700px]">
                    <p className="font-semibold text-xl mb-4">
                        Send us a message
                    </p>
                    <form
                        onSubmit={handleSubmit}
                        className="flex flex-col gap-3"
                    >
                        <input
                            type="text"
                            name="name"
                            placeholder="Your Name"
                            value={form.name}
                            onChange={handleChange}
                            className="border px-3 py-2 rounded focus:outline-none"
                            required
                        />
                        <input
                            type="email"
                            name="email"
                            placeholder="Your Email"
                            value={form.email}
                            onChange={handleChange}
                            className="border px-3 py-2 rounded focus:outline-none"
                            required
                        />
                        <input
                            type="text"
                            name="subject"
                            placeholder="Subject"
                            value={form.subject}
                            onChange={handleChange}
                            className="border px-3 py-2 rounded focus:outline-none"
                            required
                        />
                        <textarea
                            name="message"
                            placeholder="Message"
                            value={form.message}
                            onChange={handleChange}
                            rows={5}
                            className="border px-3 py-2 rounded focus:outline-none"
                            required
                        />
                        <button
                            type="submit"
                            disabled={contactLoading}
                            className="bg-black text-white px-4 py-2 rounded hover:bg-black-700 transition-all duration-300 mt-2"
                        >
                            {contactLoading ? "Sending..." : "Send Message"}
                        </button>
                    </form>
                </div>
            </div>

            {/* <NewsletterBox /> */}
        </div>
    );
}

export default Contact
