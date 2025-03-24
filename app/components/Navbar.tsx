import Link from "next/link";

export default function Navbar() {
    return (
        <div className={"bg-black border-blue-800 border-b w-full"}>
            <header className="relative z-10 px-6 py-4 mx-auto max-w-7xl   ">
                <div className="flex items-center justify-between">
                    <div className="flex items-center">
                        <Link href="/" className="text-white text-3xl font-extrabold tracking-tight">
                            PureChain
                        </Link>
                        <nav className="hidden ml-12 space-x-8 md:flex">
                            {["Link1", "Link2", "Link3"].map((item) => (
                                <Link
                                    key={item}
                                    href={`/${item.toLowerCase()}`}
                                    className="text-gray-300 hover:text-blue-300 transition-colors"
                                >
                                    {item}
                                </Link>
                            ))}
                        </nav>
                    </div>
                    <div className="flex items-center space-x-4">
                        <Link
                            href="/"
                            className="w-[100px] text-center px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600 transition-colors"
                        >
                            Log in
                        </Link>
                        <Link
                            href="/"
                            className="w-[100px] text-center px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600 transition-colors"
                        >
                            Sign up
                        </Link>
                    </div>
                </div>
            </header>
        </div>
    );
}