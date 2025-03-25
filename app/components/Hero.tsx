import Link from "next/link";

export default function Hero() {
    return (
        <main className="relative z-10 flex flex-col items-center justify-center px-6 pt-20 pb-32 mx-auto text-center max-w-7xl">
            <h1 className="max-w-4xl mx-auto text-5xl font-bold text-white md:text-6xl lg:text-7xl drop-shadow-lg mt-12">
                Ensuring Quality Data
                <br />
                for <span className={"text-blue-500"}>Machine Learning</span>
                <br />
                with <span className={"text-blue-500"}>Blockchain</span>
            </h1>
            <p className="max-w-2xl mx-auto mt-6 text-xl text-gray-200">
                PureChain delivers a decentralized framework to validate,
                <br />
                secure, and scale data for advanced ML models.
            </p>
            <div className="flex flex-col mt-10 space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4">
                <Link
                    href="/demo"
                    className="flex items-center justify-center px-8 py-3 text-lg font-medium text-white bg-blue-600 rounded-md hover:bg-blue-600/90 transition-colors"
                >
                    Explore the Prototype
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
                        <path
                            fillRule="evenodd"
                            d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z"
                            clipRule="evenodd"
                        />
                    </svg>
                </Link>
                <Link
                    href="/submit-data"
                    className="px-8 py-3 text-lg font-medium text-white bg-black rounded-md hover:bg-gray-800 transition-colors"
                >
                    Contribute to PureChain
                </Link>
            </div>

            {/* Partners Section */}
            <div className="w-fit mt-24 bg-blue-600/20 p-8 rounded-lg flex items-center justify-center">
                <span className="text-2xl font-semibold text-white">Decentralized Data for Trustworthy AI</span>
                <svg
                    className="ml-4 h-8 w-8 text-blue-400"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                </svg>
            </div>
        </main>
    );
}