export default function Section({ title, children }) {
    return (
        <section classname={"section"}>
            <h2>{title}</h2>
            <div className="section_content">{children}</div>
        </section>
    )
}