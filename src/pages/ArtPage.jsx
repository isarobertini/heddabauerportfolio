import { useEffect, useState } from "react";
import { client } from "../lib/contentful";
import { Link } from "react-router-dom";

export const ArtPage = () => {
    const [hero, setHero] = useState(null);
    const [exhibitions, setExhibitions] = useState([]);

    useEffect(() => {
        async function fetchData() {
            // Fetch hero from navigationItem
            const heroRes = await client.getEntries({ content_type: "navigationItem", limit: 1 });
            console.log("Hero response from Contentful:", heroRes);
            setHero(heroRes.items[0]);

            // Fetch exhibitions
            const exhRes = await client.getEntries({ content_type: "exhibition", order: "fields.order" });
            console.log("Exhibitions response from Contentful:", exhRes);
            setExhibitions(exhRes.items);
        }
        fetchData();
    }, []);

    const getImageUrl = (mediaField) => {
        if (mediaField && mediaField.fields && mediaField.fields.file) {
            return mediaField.fields.file.url;
        }
        return "/cover-placeholder.png"; // fallback image
    };

    return (
        <div>
            {hero && (
                <div className="hero">
                    {hero.fields.heroimage ? (
                        // If hero has a linked page, wrap in Link
                        hero.fields.linkedpage ? (
                            <Link to={`/${hero.fields.linkedpage.fields.slug}`}>
                                <img
                                    src={getImageUrl(hero.fields.heroimage)}
                                    alt={hero.fields.label}
                                    width={1200}
                                    height={400}
                                />
                            </Link>
                        ) : (
                            <img
                                src={getImageUrl(hero.fields.heroimage)}
                                alt={hero.fields.label}
                                width={1200}
                                height={400}
                            />
                        )
                    ) : (
                        <h1>{hero.fields.label}</h1>
                    )}
                </div>
            )}

            <div className="exhibitions-grid">
                {exhibitions.map((exh) => {
                    const coverUrl = getImageUrl(exh.fields.coverimage);
                    console.log("Exhibition cover URL:", coverUrl);

                    return (
                        <div key={exh.sys.id} className="exhibition-card">
                            <Link to={`/artwork/${exh.fields.slug}`}>
                                <img src={coverUrl} alt={exh.fields.title} width={300} height={200} />
                                <h2>{exh.fields.title}</h2>
                            </Link>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};