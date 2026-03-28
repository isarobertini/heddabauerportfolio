import { useEffect, useState } from "react";
import { client } from "../lib/contentful";
import { Link, useLocation } from "react-router-dom";

export const Navigation = () => {
    const [navItems, setNavItems] = useState([]);
    const location = useLocation();

    useEffect(() => {
        async function fetchNav() {
            const res = await client.getEntries({
                content_type: "navigationItem",
                order: "fields.order",
            });

            setNavItems(res.items);
        }

        fetchNav();
    }, []);

    const getImageUrl = (media) => {
        if (media?.fields?.file?.url) {
            return "https:" + media.fields.file.url;
        }
        return null;
    };

    // 🔥 determine current page
    const currentNav = navItems.find((item) => {
        const slug = item.fields.slug;

        if (!slug || slug === "art") {
            return (
                location.pathname === "/" ||
                location.pathname.startsWith("/artwork")
            );
        }

        return location.pathname === `/${slug}`;
    });

    // 🔥 active nav item
    const isActive = (item) => {
        const slug = item.fields.slug;

        if (!slug || slug === "art") {
            return (
                location.pathname === "/" ||
                location.pathname.startsWith("/artwork")
            );
        }

        return location.pathname === `/${slug}`;
    };

    // 🔥 detect artwork page
    const isArtworkPage = location.pathname.startsWith("/artwork");

    return (
        <>
            {/* HEADER */}
            {currentNav?.fields?.header && (
                <h1 className="text-8xl text-[#4F0718] text-center mt-8 mb-4">
                    {currentNav.fields.header}
                </h1>
            )}

            {/* NAV */}
            <nav className="w-full flex justify-center gap-8 py-4">
                {navItems.map((item) => {
                    const isArt = !item.fields.slug || item.fields.slug === "art";

                    return (
                        <Link
                            key={item.sys.id}
                            to={isArt ? "/" : `/${item.fields.slug}`}
                            className={`text-3xl transition ${isActive(item)
                                ? "underline"
                                : "hover:underline"
                                }`}
                        >
                            {item.fields.label}
                        </Link>
                    );
                })}
            </nav>

            {/* 🚫 HIDE HERO ON ARTWORK PAGE */}
            {!isArtworkPage &&
                currentNav &&
                getImageUrl(currentNav.fields.heroimage) && (
                    <div className="w-full flex justify-center">
                        <img
                            src={getImageUrl(currentNav.fields.heroimage)}
                            alt={currentNav.fields.label}
                            className="h-screen object-cover"
                        />
                    </div>
                )}
        </>
    );
};