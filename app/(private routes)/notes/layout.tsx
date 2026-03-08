type SidebarNotesLayoutProps = {
    children: React.ReactNode,
}

export default function NotesLayout({ children }: SidebarNotesLayoutProps) {
    return (
        <section>
            <main>{children}</main>
        </section>
    );
}