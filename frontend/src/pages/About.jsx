import React from "react";

import Title from "../components/Title";

import { assets } from "../assets/assets";

import NewsletterBox from "../components/NewsletterBox";

const About = () => {
    return (
        <div className="bg-white">
            {/* ABOUT HEADER */}
            <div className="text-2xl text-center border-t border-gray-200 pt-[150px]">
                <Title text1={"ABOUT"} text2={"US"} />
            </div>

            {/* ABOUT CONTENT */}
            <div className="my-14 flex flex-col md:flex-row gap-16 items-center">
                {/* IMAGE */}
                <div className="relative">
                    <div className="absolute -top-6 -left-6 w-full h-full bg-gradient-to-br from-sky-50 to-slate-100 rounded-3xl"></div>

                    <img
                        className="relative w-full md:max-w-[450px] rounded-3xl shadow-lg border border-gray-200"
                        src={assets.about_img}
                        alt="About Poshak Krishna Ji"
                    />
                </div>

                {/* TEXT */}
                <div className="flex flex-col justify-center gap-6 md:w-2/4 text-slate-600 leading-relaxed">
                    <p>
                        Welcome to{" "}
                        <b className="text-[#1E3A5F]">Poshak Krishna Ji</b>,
                        your trusted destination for
                        <b className="text-slate-800">
                            {" "}
                            Krishna Ji Poshaks, Laddu Gopal Dresses, and
                            Devotional Attire
                        </b>
                        . Our journey began with a simple vision: to provide
                        high-quality, traditional and handcrafted clothing for
                        Lord Krishna that reflects devotion, purity, and
                        tradition.
                    </p>

                    <p>
                        We specialize in offering a wide collection of
                        <b className="text-slate-800"> Krishna Ji Vastra</b>—
                        from everyday worship attire to festival and wedding
                        special poshaks. Each dress is made with love, premium
                        fabrics, and intricate designs, ensuring a divine look
                        for your deity.
                    </p>

                    <div className="bg-gradient-to-r from-sky-50 to-slate-100 border border-gray-200 rounded-2xl p-6 shadow-sm">
                        <b className="text-[#1E3A5F] text-lg">Our Mission</b>

                        <p className="mt-3">
                            Our mission at Poshak Krishna Ji is to deliver
                            <b className="text-slate-800">
                                {" "}
                                authentic devotional clothing
                            </b>
                            with unmatched quality and faith. We are dedicated
                            to making it easy for devotees to find the perfect
                            attire for their Laddu Gopal and Krishna Ji idols —
                            with convenience, trust, and care.
                        </p>
                    </div>
                </div>
            </div>

            {/* WHY CHOOSE US */}
            <div className="text-xl py-6">
                <Title text1={"WHY"} text2={"CHOOSE US"} />
            </div>

            {/* CARDS */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20">
                {/* CARD 1 */}
                <div className="group border border-gray-200 bg-white rounded-3xl px-10 py-10 flex flex-col gap-5 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                    <div className="w-14 h-14 rounded-2xl bg-black flex items-center justify-center text-white text-xl shadow-md">
                        ✓
                    </div>

                    <b className="text-lg text-[#1E3A5F]">Quality Assurance</b>

                    <p className="text-slate-600 leading-relaxed">
                        Every <b className="text-slate-800">Krishna Poshak</b>
                        is carefully crafted and checked to ensure it meets our
                        highest standards of quality, devotion, and tradition.
                    </p>
                </div>

                {/* CARD 2 */}
                <div className="group border border-gray-200 bg-white rounded-3xl px-10 py-10 flex flex-col gap-5 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                    <div className="w-14 h-14 rounded-2xl bg-[#1E3A5F] flex items-center justify-center text-white text-xl shadow-md">
                        ✦
                    </div>

                    <b className="text-lg text-[#1E3A5F]">Wide Collection</b>

                    <p className="text-slate-600 leading-relaxed">
                        From{" "}
                        <b className="text-slate-800">Laddu Gopal Dresses</b>
                        to festive and seasonal Krishna Ji attires, we offer a
                        diverse range to suit every occasion.
                    </p>
                </div>

                {/* CARD 3 */}
                <div className="group border border-gray-200 bg-white rounded-3xl px-10 py-10 flex flex-col gap-5 shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                    <div className="w-14 h-14 rounded-2xl bg-[#0F766E] flex items-center justify-center text-white text-xl shadow-md">
                        ❤
                    </div>

                    <b className="text-lg text-[#1E3A5F]">
                        Exceptional Support
                    </b>

                    <p className="text-slate-600 leading-relaxed">
                        Our team is here to help you choose the right size,
                        fabric, and style so that your devotion is always
                        expressed with grace.
                    </p>
                </div>
            </div>

            {/* NEWSLETTER */}
            <NewsletterBox />
        </div>
    );
};

export default About;
