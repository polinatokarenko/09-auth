import React from "react";

type SidebarNotesLayoutProps = {
    children: React.ReactNode,
    sidebar: React.ReactNode,
}

export default function SidebarNotesLayout({ children, sidebar }: SidebarNotesLayoutProps) {
    return (
        <section>
            <aside>{sidebar}</aside>
            <main>{children}</main>
        </section>
    );
}