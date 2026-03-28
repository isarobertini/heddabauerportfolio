import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { client } from "../lib/contentful";

export const ArtworkPage = () => {
    const { slug }
        = useParams();
    const [exhibition, setExhibition] = useState(null);

    useEffect(() => {
        async function fetchExhibition() {
            try {
                const res = await client.getEntries({
                    content_type: "exhibition",
                    "fields.slug": slug,
                    include: 2,
                });

                console.log("EXHIBITION:", res);

                if (res.items.length > 0) {
                    setExhibition(res.items[0]);
                }
            } catch (err) {
                console.error("Error fetching exhibition:", err);
            }
        }

        fetchExhibition();
    }, [slug]);

    const getImageUrl = (media) => {
        const url = media?.fields?.file?.url;
        return url ? "https:" + url : null;
    };

    if (!exhibition) {
        return <div className="text-center mt-10">Loading exhibition...</div>;
    }

    return (
        <div className="flex justify-center px-4">
            {/* 🔥 container aligned left */}
            <div className="max-w-3xl w-full">

                {/* TITLE */}
                <h1 className="text-4xl my-10">
                    {exhibition.fields.title}
                </h1>

                {/* ARTWORKS */}
                {exhibition.fields.artworks?.map((art, i) => (
                    <div key={i} className="mb-16">

                        {/* 🔥 LOOP IMAGES + TEXT TOGETHER */}
                        {art.fields.media?.map((img, index) => {
                            const url = getImageUrl(img);

                            if (!url) return null;

                            return (
                                <div key={index} className="mb-10">
                                    {/* IMAGE */}
                                    <img
                                        src={url}
                                        alt={art.fields.title}
                                        className="h-screen"
                                    />

                                    {/* 🔥 TEXT ALIGNED WITH IMAGE */}
                                    <div className="mt-3">
                                        <h2 className="text-xl">
                                            {art.fields.title}
                                        </h2>

                                        {art.fields.description && (
                                            <p className="text-sm text-gray-600">
                                                {art.fields.description}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                ))}

                {/* 🔥 EXHIBITION DESCRIPTION ONLY ONCE */}
                {exhibition.fields.description && (
                    <div className="mt-20">
                        <p className="text-lg whitespace-pre-line">
                            {exhibition.fields.description}
                        </p>
                    </div>
                )}

            </div>
        </div>
    );
};