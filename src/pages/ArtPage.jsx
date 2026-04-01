import { useEffect, useState } from "react";
import { client } from "../lib/contentful";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";

export const ArtPage = () => {
    const [exhibitions, setExhibitions] = useState([]);

    useEffect(() => {
        async function fetchData() {
            try {
                const res = await client.getEntries({
                    content_type: "exhibition",
                    order: "fields.order",
                });

                console.log("EXHIBITIONS:", res.items);
                setExhibitions(res.items);
            } catch (err) {
                console.error("Error fetching exhibitions:", err);
            }
        }

        fetchData();
    }, []);

    const getImageUrl = (mediaField) => {
        console.log("MEDIA FIELD:", mediaField);

        // 🔥 case 1: array
        if (Array.isArray(mediaField) && mediaField[0]?.fields?.file?.url) {
            return "https:" + mediaField[0].fields.file.url;
        }

        // 🔥 case 2: single asset
        if (mediaField?.fields?.file?.url) {
            return "https:" + mediaField.fields.file.url;
        }

        return null;
    };

    return (
        <>
            <Helmet>
                <title>Art | Hedda Bauer</title>

                <meta
                    name="description"
                    content="Artworks | Hedda Bauer."
                />

                {/* Open Graph */}
                <meta property="og:title" content="Art | Hedda Bauer" />
                <meta
                    property="og:description"
                    content="Artworks by Hedda Bauer."
                />

                {/* Optional: first exhibition image as preview */}
                {exhibitions[0]?.fields?.coverimage && (
                    <meta
                        property="og:image"
                        content={getImageUrl(exhibitions[0].fields.coverimage)}
                    />
                )}

                {/* Canonical URL */}
                <link
                    rel="canonical"
                    href="https://heddabauer.com/"
                />
            </Helmet>

            <div>
                {exhibitions.map((exh) => {
                    const coverUrl = getImageUrl(exh.fields.coverimage);

                    console.log("COVER URL:", coverUrl);

                    return (
                        <div key={exh.sys.id} className="flex justify-center mt-15 lg:mt-30 mb-20">
                            <Link to={`/artwork/${exh.fields.slug}`}>

                                {coverUrl ? (
                                    <img
                                        className="lg:h-screen"
                                        src={coverUrl}
                                        alt={`${exh.fields.title} exhibition by Hedda Bauer`}
                                    />
                                ) : (
                                    <div className="h-screen w-[600px] bg-gray-200 flex items-center justify-center">
                                        No image
                                    </div>
                                )}

                                <h2 className="mt-4 font-light text-2xl">
                                    {exh.fields.title}
                                </h2>
                            </Link>
                        </div>
                    );
                })}
            </div>
        </>
    );
};