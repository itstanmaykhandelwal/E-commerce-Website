import React from 'react'
import Title from '../components/Title'
import { assets } from '../assets/assets'
import NewsletterBox from '../components/NewsletterBox'

const About = () => {
    return (
        <div>

            <div className='text-2xl text-center pt-8 border-t'>
                <Title text1={'ABOUT'} text2={'US'} />
            </div>

            <div className='my-10 flex flex-col md:flex-row gap-16'>
                <img className='w-full md:max-w-[450px]' src={assets.about_img} alt="About Poshak Krishna Ji" />
                <div className='flex flex-col justify-center gap-6 md:w-2/4 text-gray-600'>
                    <p>
                        Welcome to <b>Poshak Krishna Ji</b>, your trusted destination for
                        <b> Krishna Ji Poshaks, Laddu Gopal Dresses, and Devotional Attire</b>.
                        Our journey began with a simple vision: to provide high-quality, traditional
                        and handcrafted clothing for Lord Krishna that reflects devotion, purity, and tradition.
                    </p>
                    <p>
                        We specialize in offering a wide collection of <b>Krishna Ji Vastra</b> – from
                        everyday worship attire to festival and wedding special poshaks. Each dress is made
                        with love, premium fabrics, and intricate designs, ensuring a divine look for your deity.
                    </p>
                    <b className='text-gray-800'>Our Mission</b>
                    <p>
                        Our mission at Poshak Krishna Ji is to deliver <b>authentic devotional clothing</b> with
                        unmatched quality and faith. We are dedicated to making it easy for devotees to find the
                        perfect attire for their Laddu Gopal and Krishna Ji idols – with convenience, trust, and care.
                    </p>
                </div>
            </div>

            <div className=' text-xl py-4'>
                <Title text1={'WHY'} text2={'CHOOSE US'} />
            </div>

            <div className='flex flex-col md:flex-row text-sm mb-20'>
                <div className='border px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5'>
                    <b>Quality Assurance:</b>
                    <p className=' text-gray-600'>
                        Every <b>Krishna Poshak</b> is carefully crafted and checked to ensure
                        it meets our highest standards of quality, devotion, and tradition.
                    </p>
                </div>
                <div className='border px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5'>
                    <b>Wide Collection:</b>
                    <p className=' text-gray-600'>
                        From <b>Laddu Gopal Dresses</b> to festive and seasonal Krishna Ji attires,
                        we offer a diverse range to suit every occasion.
                    </p>
                </div>
                <div className='border px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5'>
                    <b>Exceptional Support:</b>
                    <p className=' text-gray-600'>
                        Our team is here to help you choose the right size, fabric, and style
                        so that your devotion is always expressed with grace.
                    </p>
                </div>
            </div>

            <NewsletterBox />

        </div>
    )
}

export default About
