import { BsShieldCheck, BsCodeSquare, BsDatabase, BsGear } from "react-icons/bs";

const features = [
    {
        icon: <BsShieldCheck className="h-8 w-8 text-blue-400" />,
        title: "Data Validation",
        description: "Ensure high-quality data with rule-based, statistical, and ML-driven checks.",
    },
    {
        icon: <BsCodeSquare className="h-8 w-8 text-blue-400" />,
        title: "Smart Contracts",
        description: "Automate data quality enforcement and incentivize reliable contributions.",
    },
    {
        icon: <BsDatabase className="h-8 w-8 text-blue-400" />,
        title: "Decentralized Storage",
        description: "Leverage IPFS for scalable, secure off-chain data management.",
    },
    {
        icon: <BsGear className="h-8 w-8 text-blue-400" />,
        title: "Scalability & Security",
        description: "Handle large datasets with optimized blockchain performance.",
    },
];

export default function Features() {
    return (
        <section id="features" className="py-20">
            <div className="container mx-auto">
                <h2 className="text-4xl font-bold text-center mb-12 text-white"><span className={"text-blue-500"}>Key Features</span> of PureChain</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {features.map((feature, index) => (
                        <div
                            key={index}
                            className="bg-gradient-to-br from-blue-700/20 to-blue-500/20 p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow"
                        >
                            <div className="mb-4">{feature.icon}</div>
                            <h3 className="text-2xl font-semibold mb-2 text-white">{feature.title}</h3>
                            <p className="text-gray-200">{feature.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}