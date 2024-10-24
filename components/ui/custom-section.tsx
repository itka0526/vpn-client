import { PropsWithChildren } from "react";

export function CustomSection({ children }: PropsWithChildren) {
    return <section className="text-justify w-full md:px-24"> {children}</section>;
}
