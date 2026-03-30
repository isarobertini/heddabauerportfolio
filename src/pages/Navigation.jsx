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
                <h1 className="text-[#8c0013] text-6xl lg:text-8xl text-center mt-8 mb-4">
                    {currentNav.fields.header}
                </h1>
            )}

            {/* NAV */}
            <nav className="font-roboto font-light px-4 w-full flex justify-center gap-8 py-7">
                {navItems.map((item) => {
                    const isArt =
                        !item.fields.slug || item.fields.slug === "art";

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

            {/* HERO (only NOT artwork page) */}
            {!isArtworkPage &&
                currentNav &&
                getImageUrl(currentNav.fields.heroimage) && (
                    <div className="w-full flex px-4 flex-col items-center">
                        <div className="flex flex-col">
                            <img
                                src={getImageUrl(
                                    currentNav.fields.heroimage
                                )}
                                alt={currentNav.fields.label}
                                className="lg:h-screen object-cover my-2"
                            />

                            {/* Photographer */}
                            {currentNav.fields.photographer && (
                                <div className="text-sm text-gray-500">
                                    {currentNav.fields.photographer}
                                </div>
                            )}
                        </div>
                    </div>
                )}

            {/* 🔴 ALWAYS SHOW DIVIDER */}
            <div className="w-full flex justify-center px-4">
                <div className="h-0.5 w-full lg:w-5/6 bg-[#8c0013] mt-10 lg:mt-20"></div>
            </div>
        </>
    );
};