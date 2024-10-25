import "./style.css";

export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex flex-col h-full w-full  text-gray-100 ">
            <div className="flex-grow py-6 sm:py-8">{children}</div>
        </div>
    );
}
