import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { client } from "../lib/contentful";

export const ArtworkPage = () => {
    const { slug } = useParams();
    const [artwork, setArtwork] = useState(null);

    useEffect(() => {
        async function fetchArtwork() {
            const res = await client.getEntries({
                content_type: "artwork",
                "fields.slug": slug,
            });
            console.log("Artwork response:", res);
            if (res.items.length > 0) setArtwork(res.items[0]);
        }
        fetchArtwork();
    }, [slug]);

    if (!artwork) return <div>Loading artwork...</div>;

    return (
        <div>
            <h1>{artwork.fields.title}</h1>
            {artwork.fields.media &&
                artwork.fields.media.map((img, i) => (
                    <img key={i} src={img.fields.file.url} alt={artwork.fields.title} width={400} />
                ))}
            <p>{artwork.fields.description}</p>
        </div>
    );
};