export default function DownloadButton({ href, label }) {
    return (
        <a className="download_button" href={href} download>
            {label}
        </a>
    )
}
