import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { client } from "../lib/contentful";
import { documentToReactComponents } from "@contentful/rich-text-react-renderer";

export const Page = () => {
    const { slug } = useParams();
    const [page, setPage] = useState(null);

    useEffect(() => {
        async function fetchPage() {
            try {
                const res = await client.getEntries({
                    content_type: "pages",
                    "fields.slug": slug,
                });
                if (res.items.length > 0) setPage(res.items[0]);
            } catch (err) {
                console.error("Error fetching page:", err);
            }
        }
        fetchPage();
    }, [slug]);

    const getHeroUrl = (mediaField) => {
        if (mediaField && mediaField.fields && mediaField.fields.file) {
            return mediaField.fields.file.url;
        }
        return "/cover-placeholder.png"; // fallback hero
    };

    if (!page) return <p>Loading…</p>;

    return (
        <div>
            {/* Hero Section */}
            {page.fields.heroimage && (
                <div
                    className="w-full h-64 md:h-96 bg-cover bg-center flex items-center justify-center"
                    style={{ backgroundImage: `url(${getHeroUrl(page.fields.heroimage)})` }}
                >
                    <h1 className="text-4xl md:text-6xl text-white font-bold bg-black bg-opacity-50 p-4 rounded">
                        {page.fields.title}
                    </h1>
                </div>
            )}

            {/* Page Content */}
            <div className="max-w-3xl mx-auto px-4 py-8 prose">
                {page.fields.content
                    ? documentToReactComponents(page.fields.content)
                    : <p>No content available</p>}
            </div>
        </div>
    );
};