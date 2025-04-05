import Link from "next/link";

export default function Hero() {
  // Sample story data (you can replace this with dynamic data later)
  const stories = [
    {
      title: "Fighting Diabetes with AI",
      message:
        "We’re currently training a Random Forest model to tackle diabetes-related challenges. Have valuable data? Join us! Contribute to PureChain and help shape the future of healthcare AI. Your data is secured with blockchain—no compromises.",
      ctaText: "Contribute Your Data",
      ctaLink: "/submit-data",
      highlightColor: "text-blue-500",
    },
    // Add more stories here in the future
    // {
    //   title: "Next Big Thing",
    //   message: "Stay tuned for our next project...",
    //   ctaText: "Learn More",
    //   ctaLink: "/submit-data",
    //   highlightColor: "text-purple-500",
    // },
  ];

  return (
    <main className="relative z-10 flex flex-col items-center justify-center px-6 pt-20 pb-32 mx-auto text-center max-w-7xl">
      {/* Heading */}
      <h1 className="max-w-4xl mx-auto text-5xl font-bold text-white md:text-6xl lg:text-7xl">
        Ensuring Quality Data
        <span className="block">
          for <span className="text-blue-500">Machine Learning</span>
        </span>
        <span className="block">
          with <span className="text-blue-500">Blockchain</span>
        </span>
      </h1>

      {/* Paragraph */}
      <p className="max-w-2xl mx-auto mt-6 text-xl text-gray-200">
        PureChain delivers a decentralized framework to validate, secure, and scale data for advanced ML models.
      </p>

      {/* Buttons */}
      <div className="flex flex-col mt-10 space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4">
        <Link
          href="/submit-data"
          className="inline-flex items-center justify-center px-8 py-3 text-lg font-medium text-white bg-blue-600 rounded-md hover:bg-blue-600/90 transition-colors"
        >
          Contribute to PureChain
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-5 h-5 ml-2"
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </Link>
      </div>

      {/* Stories Section */}
      <div className="mt-16 w-full max-w-3xl">
        <h2 className="text-3xl font-semibold text-white mb-6">What’s Happening Now</h2>
        <div className="space-y-8">
          {stories.map((story, index) => (
            <div
              key={index}
              className="bg-gradient-to-r from-blue-700/20 to-blue-500/20 p-6 rounded-lg shadow-lg border border-blue-500/30"
            >
              <h3 className={`text-2xl font-bold text-white ${story.highlightColor}`}>
                {story.title}
              </h3>
              <p className="mt-3 text-lg text-gray-200">{story.message}</p>
              <Link
                href={story.ctaLink}
                className="mt-4 inline-flex items-center justify-center px-6 py-2 text-base font-medium text-white bg-blue-600 rounded-md hover:bg-blue-600/90 transition-colors"
              >
                {story.ctaText}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-4 h-4 ml-2"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path
                    fillRule="evenodd"
                    d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </Link>
            </div>
          ))}
        </div>
      </div>

      {/* Partners Section */}
      <div className="mt-24 bg-blue-600/20 p-8 rounded-lg inline-flex items-center justify-center">
        <span className="text-2xl font-semibold text-white">
          Decentralized Data for Trustworthy AI
        </span>
        <svg
          className="ml-4 h-8 w-8 text-blue-400"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          aria-hidden="true"
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

export const dynamic = "force-static";