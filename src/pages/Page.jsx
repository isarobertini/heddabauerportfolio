import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { client } from "../lib/contentful";
import { documentToReactComponents } from "@contentful/rich-text-react-renderer";
import { BLOCKS } from "@contentful/rich-text-types";
import { Helmet } from "react-helmet-async";

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
        if (mediaField?.fields?.file) {
            return "https:" + mediaField.fields.file.url;
        }
        return "/cover-placeholder.png";
    };

    // 🔥 FIX: paragraph renderar inte <p> längre
    const options = {
        renderNode: {
            [BLOCKS.UL_LIST]: (node, children) => (
                <ul className="list-disc ml-6 my-4 space-y-2">
                    {children}
                </ul>
            ),
            [BLOCKS.OL_LIST]: (node, children) => (
                <ol className="list-decimal ml-6 my-4 space-y-2">
                    {children}
                </ol>
            ),
            [BLOCKS.LIST_ITEM]: (node, children) => (
                <li className="pl-1">{children}</li>
            ),
            [BLOCKS.PARAGRAPH]: (node, children) => (
                <>{children}</>
            ),
        },
    };

    if (!page) {
        return (
            <>
                <Helmet>
                    <title>Bio | Hedda Bauer</title>
                </Helmet>
                <p>Loading…</p>
            </>
        );
    }

    return (
        <>
            <Helmet>
                <title>{page.fields.title} | Hedda Bauer</title>

                <meta
                    name="description"
                    content="Bio | Hedda Bauer"
                />

                {/* Open Graph */}
                <meta property="og:title" content={page.fields.title} />
                <meta
                    property="og:description"
                    content="Bio | Hedda Bauer"
                />

                {page.fields.heroimage && (
                    <meta
                        property="og:image"
                        content={getHeroUrl(page.fields.heroimage)}
                    />
                )}

                {/* Canonical URL */}
                <link
                    rel="canonical"
                    href={`https://heddabauer.com/${slug}`}
                />
            </Helmet>

            <div>
                {/* HERO */}
                {page.fields.heroimage && (
                    <div
                        className="w-full h-64 md:h-96 bg-cover bg-center flex items-center justify-center"
                        style={{
                            backgroundImage: `url(${getHeroUrl(page.fields.heroimage)})`,
                        }}
                    >
                        <h1 className="text-4xl md:text-6xl text-white font-bold bg-black/50 p-4 ">
                            {page.fields.title}
                        </h1>
                    </div>
                )}

                {/* CONTENT */}
                <div className="max-w-3xl mx-auto px-4 pt-7 pb-12 space-y-12">

                    {/* EDUCATION */}
                    <div>
                        {page.fields.educationTitle && (
                            <h2 className="font-light text-2xl mb-4">
                                {documentToReactComponents(page.fields.educationTitle, options)}
                            </h2>
                        )}

                        <div className="font-light">
                            {page.fields.education
                                ? documentToReactComponents(page.fields.education, options)
                                : <p>No education content</p>}
                        </div>
                    </div>

                    {/* EXHIBITIONS */}
                    <div>
                        {page.fields.exhibitionTitle && (
                            <h2 className="font-light text-2xl mb-4">
                                {documentToReactComponents(page.fields.exhibitionTitle, options)}
                            </h2>
                        )}

                        <div className="font-light">
                            {page.fields.exhibitions
                                ? documentToReactComponents(page.fields.exhibitions, options)
                                : <p>No exhibitions content</p>}
                        </div>
                    </div>

                </div>
            </div>
        </>
    );
};