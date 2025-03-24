import { Button } from "@/components/ui/button";

export default function CTA() {
    return (
        <section className="py-20 text-white relative overflow-hidden">
            <div className="container mx-auto text-center relative z-10">
                <h2 className="text-4xl font-bold mb-6">Ready to <span className={"text-blue-500"}>Enhance</span> Your <span className={"text-blue-500"}>ML Models?</span></h2>
                <p className="text-2xl mb-8 max-w-2xl mx-auto">
                    Join the PureChain ecosystem to ensure high-quality, secure data for machine learning.
                </p>
                <Button
                    size="lg"
                    className="px-8 py-4 text-lg font-medium bg-black text-white hover:bg-gray-800 transition-colors transform hover:scale-105 rounded-md"
                >
                    Try PureChain Now
                </Button>
            </div>
        </section>
    );
}