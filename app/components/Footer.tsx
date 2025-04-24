import Link from "next/link";
import { Github, Linkedin, Twitter } from "lucide-react";

export default function Footer() {
    return (
        <footer className="bg-gradient-to-t from-black/50 to-transparent border-t border-blue-500/20">
            <div className="container mx-auto px-6 py-12 md:py-16">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                    {/* Brand Section */}
                    <div className="space-y-4">
                        <h2 className="text-2xl font-bold text-white">PureChain</h2>
                        <p className="text-sm text-gray-300">
                            Decentralized Data Solutions for Trustworthy AI
                        </p>
                        <div className="flex space-x-4">
                            <Link
                                href="https://github.com/purechain-project"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-gray-400 hover:text-blue-400 transition-colors"
                            >
                                <Github className="h-5 w-5" />
                                <span className="sr-only">GitHub</span>
                            </Link>
                            <Link
                                href="https://twitter.com/purechain_ai"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-gray-400 hover:text-blue-400 transition-colors"
                            >
                                <Twitter className="h-5 w-5" />
                                <span className="sr-only">Twitter</span>
                            </Link>
                            <Link
                                href="https://linkedin.com/company/purechain"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-gray-400 hover:text-blue-400 transition-colors"
                            >
                                <Linkedin className="h-5 w-5" />
                                <span className="sr-only">LinkedIn</span>
                            </Link>
                        </div>
                    </div>

                    {/* Navigation Links */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-white">Explore</h3>
                        <ul className="space-y-3 text-sm">
                            <li>
                                <Link
                                    href="/"
                                    className="text-gray-300 hover:text-blue-400 transition-colors"
                                >
                                    About PureChain
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/"
                                    className="text-gray-300 hover:text-blue-400 transition-colors"
                                >
                                    Prototype Demo
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/"
                                    className="text-gray-300 hover:text-blue-400 transition-colors"
                                >
                                    Contribute
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-white">Contact</h3>
                        <ul className="space-y-3 text-sm text-gray-300">
                            <li>
                                <a
                                    href="mailto:contact@purechain.org"
                                    className="hover:text-blue-400 transition-colors"
                                >
                                    contact@purechain.org
                                </a>
                            </li>
                            <li>
                                <Link
                                    href="/#contact"
                                    className="hover:text-blue-400 transition-colors"
                                >
                                    Get in Touch
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="mt-12 pt-6 border-t border-blue-500/20 flex flex-col md:flex-row justify-between items-center">
                    <p className="text-sm text-gray-400">
                        © 2025 PureChain. All rights reserved.
                    </p>
                    <div className="mt-4 md:mt-0">
                        <Link
                            href="/privacy"
                            className="text-sm text-gray-400 hover:text-blue-400 transition-colors mr-4"
                        >
                            Privacy Policy
                        </Link>
                        <Link
                            href="/terms"
                            className="text-sm text-gray-400 hover:text-blue-400 transition-colors"
                        >
                            Terms of Service
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}