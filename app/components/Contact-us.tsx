import { BsEnvelope, BsGithub, BsTwitter } from "react-icons/bs";

export default function ContactUs() {
    return (
        <section id="contact" className="py-20 relative">
            <div className="container mx-auto px-6">
                <h2 className="text-4xl font-bold text-center text-white mb-12">We’d <span className={"text-blue-500"}>Love to Hear</span> from You</h2>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
                    {/* Contact Form */}
                    <div className="bg-gradient-to-br from-blue-700/20 to-blue-500/20 p-8 rounded-lg shadow-lg">
                        <h3 className="text-2xl font-semibold text-white mb-6">Send Us a Message</h3>
                        <form className="space-y-6">
                            <div>
                                <label htmlFor="name" className="block text-gray-200 mb-2">Name</label>
                                <input
                                    type="text"
                                    id="name"
                                    className="w-full p-3 rounded-md bg-black/30 text-white border border-blue-500/20 focus:outline-none focus:border-blue-400 transition-colors"
                                    placeholder="Your Name"
                                />
                            </div>
                            <div>
                                <label htmlFor="email" className="block text-gray-200 mb-2">Email</label>
                                <input
                                    type="email"
                                    id="email"
                                    className="w-full p-3 rounded-md bg-black/30 text-white border border-blue-500/20 focus:outline-none focus:border-blue-400 transition-colors"
                                    placeholder="Your Email"
                                />
                            </div>
                            <div>
                                <label htmlFor="message" className="block text-gray-200 mb-2">Message</label>
                                <textarea
                                    id="message"
                                    className="w-full p-3 rounded-md bg-black/30 text-white border border-blue-500/20 focus:outline-none focus:border-blue-400 transition-colors"
                                    placeholder="How can we assist you?"
                                />
                            </div>
                            <button
                                type="submit"
                                className="w-full py-3 bg-blue-500 text-white font-medium rounded-md hover:bg-blue-600 transition-colors"
                            >
                                Submit
                            </button>
                        </form>
                    </div>

                    {/* Contact Info & Links */}
                    <div className="bg-gradient-to-br from-blue-700/20 to-blue-500/20 p-8 rounded-lg shadow-lg flex flex-col justify-between">
                        <div>
                            <h3 className="text-2xl font-semibold text-white mb-6">Connect with Us</h3>
                            <p className="text-gray-200 mb-8">
                                Whether you’re a researcher, developer, or enthusiast, we’d love to hear from you about advancing data quality for AI.
                            </p>
                            <div className="space-y-6">
                                <a
                                    href="mailto:contact@purechain.org"
                                    className="flex items-center text-white hover:text-blue-400 transition-colors"
                                >
                                    <BsEnvelope className="h-6 w-6 mr-3" />
                                    <span className="text-lg">contact@purechain.org</span>
                                </a>
                                <a
                                    href="https://github.com/purechain-project"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center text-white hover:text-blue-400 transition-colors"
                                >
                                    <BsGithub className="h-6 w-6 mr-3" />
                                    <span className="text-lg">GitHub Repository</span>
                                </a>
                                <a
                                    href="https://twitter.com/purechain_ai"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center text-white hover:text-blue-400 transition-colors"
                                >
                                    <BsTwitter className="h-6 w-6 mr-3" />
                                    <span className="text-lg">@PureChain_AI</span>
                                </a>
                            </div>
                        </div>
                        <div className="mt-8">
                            <p className="text-gray-300 text-sm">
                                Join our community to shape the future of decentralized data solutions.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}