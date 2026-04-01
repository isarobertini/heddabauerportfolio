import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { client } from "../lib/contentful";
import { Helmet } from "react-helmet-async";

export const ArtworkPage = () => {
    const { slug } = useParams();
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

    const getMediaType = (media) => {
        const contentType = media?.fields?.file?.contentType;

        if (!contentType) return "unknown";

        if (contentType.startsWith("image/")) return "image";
        if (contentType.startsWith("video/")) return "video";
        if (contentType.startsWith("audio/")) return "audio";
        if (contentType === "application/pdf") return "pdf";

        return "unknown";
    };

    if (!exhibition) {
        return (
            <>
                <Helmet>
                    <title>Loading exhibition | Hedda Bauer</title>
                </Helmet>
                <div className="text-center mt-10">Loading exhibition...</div>
            </>
        );
    }

    return (
        <>
            <Helmet>
                <title>{exhibition.fields.title} | Hedda Bauer</title>

                <meta
                    name="description"
                    content={
                        exhibition.fields.description || "Exhibition artwork"
                    }
                />

                {/* Open Graph */}
                <meta property="og:title" content={exhibition.fields.title} />
                <meta
                    property="og:description"
                    content={exhibition.fields.description || ""}
                />

                {exhibition.fields.artworks?.[0]?.fields?.media?.[0] && (
                    <meta
                        property="og:image"
                        content={getImageUrl(
                            exhibition.fields.artworks[0].fields.media[0]
                        )}
                    />
                )}

                {/* Canonical URL */}
                <link
                    rel="canonical"
                    href={`https://heddabauer.com/artwork/${slug}`}
                />
            </Helmet>

            <div className="flex justify-center font-light">

                {/* container aligned left */}
                <div className="max-w-3xl w-full">

                    {/* TITLE */}
                    <h1 className="text-2xl my-10">
                        {exhibition.fields.title}
                    </h1>

                    {/* ARTWORKS */}
                    {exhibition.fields.artworks?.map((art, i) => (
                        <div key={i}>

                            {/* LOOP MEDIA */}
                            {art.fields.media?.map((media, index) => {
                                const url = getImageUrl(media);
                                const type = getMediaType(media);

                                if (!url) return null;

                                return (
                                    <div key={index} className="mb-15">

                                        {/* MEDIA */}
                                        {type === "image" && (
                                            <img
                                                src={url}
                                                alt={`${art.fields.title} from exhibition ${exhibition.fields.title}`}
                                                className="lg:h-screen mx-auto"
                                            />
                                        )}

                                        {type === "video" && (
                                            <video
                                                src={url}
                                                controls
                                                className="lg:h-screen mx-auto"
                                            />
                                        )}

                                        {type === "audio" && (
                                            <audio
                                                src={url}
                                                controls
                                                className="mx-auto w-full"
                                            />
                                        )}

                                        {type === "pdf" && (
                                            <iframe
                                                src={url}
                                                title={art.fields.title}
                                                className="lg:h-screen mx-auto w-full"
                                            />
                                        )}

                                        {/* PHOTOGRAPHER (from artwork, not media) */}
                                        {art.fields.photographer && (
                                            <div className="text-sm text-gray-500 mt-1">
                                                {art.fields.photographer}
                                            </div>
                                        )}

                                        {/* TEXT */}
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

                    {/* EXHIBITION DESCRIPTION */}
                    {exhibition.fields.description && (
                        <div className="mt-20">
                            <p className="text-lg whitespace-pre-line">
                                {exhibition.fields.description}
                            </p>
                        </div>
                    )}

                </div>
            </div>
        </>
    );
};