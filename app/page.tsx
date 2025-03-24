import Hero from "@/app/components/Hero";
import Features from "@/app/components/Features";
import CTA from "@/app/components/CTA";
import ContactUs from "@/app/components/Contact-us";

export default function Home() {
    return (
        <div className="relative min-h-screen">
            <div className="relative z-10">
                <Hero />
                <Features />
                <CTA />
                <ContactUs/>
            </div>
        </div>
    );
}