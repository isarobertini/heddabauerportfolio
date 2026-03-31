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

    const isActive = (slug) => {
        if (!slug || slug === "art") {
            return (
                location.pathname === "/" ||
                location.pathname.startsWith("/artwork")
            );
        }
        return location.pathname === `/${slug}`;
    };

    const isArtworkPage = location.pathname.startsWith("/artwork");

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

    const getPath = (slug) => {
        if (!slug || slug === "art") return "/";
        return `/${slug}`;
    };

    return (
        <>
            {/* HEADER */}
            {currentNav?.fields?.header && (
                <h1 className="text-[#8c0013] text-6xl lg:text-8xl text-center mt-8 mb-4">
                    {currentNav.fields.header}
                </h1>
            )}

            {/* NAV */}
            <nav className="w-full flex justify-center font-roboto font-light py-7">
                <div className="flex items-center gap-6">

                    {/* Art */}
                    {navItems.find(
                        (item) =>
                            !item.fields.slug || item.fields.slug === "art"
                    ) && (
                            <Link
                                to="/"
                                className={`text-3xl transition ${isActive("art")
                                        ? "underline"
                                        : "hover:underline"
                                    }`}
                            >
                                Art
                            </Link>
                        )}

                    {/* Bio */}
                    {navItems.find(
                        (item) => item.fields.slug === "bio"
                    ) && (
                            <Link
                                to="/bio"
                                className={`text-3xl transition ${isActive("bio")
                                        ? "underline"
                                        : "hover:underline"
                                    }`}
                            >
                                Bio
                            </Link>
                        )}

                    {/* Contact */}
                    {navItems.find(
                        (item) => item.fields.slug === "contact"
                    ) && (
                            <Link
                                to="/contact"
                                className={`text-3xl transition ${isActive("contact")
                                        ? "underline"
                                        : "hover:underline"
                                    }`}
                            >
                                Contact
                            </Link>
                        )}

                </div>
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

            {/* DIVIDER */}
            <div className="w-full flex justify-center px-4">
                <div className="h-0.5 w-full lg:w-5/6 bg-[#8c0013] mt-10 lg:mt-20"></div>
            </div>
        </>
    );
};