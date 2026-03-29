import { useEffect, useState } from "react";
import { client } from "../lib/contentful";
import { Link } from "react-router-dom";

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
        <div>
            {exhibitions.map((exh) => {
                const coverUrl = getImageUrl(exh.fields.coverimage);

                console.log("COVER URL:", coverUrl);

                return (
                    <div key={exh.sys.id} className="flex justify-center mb-20 lg:mb-30">
                        <Link to={`/artwork/${exh.fields.slug}`}>

                            {coverUrl ? (
                                <img
                                    className="lg:h-screen"
                                    src={coverUrl}
                                    alt={exh.fields.title}
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
    );
};