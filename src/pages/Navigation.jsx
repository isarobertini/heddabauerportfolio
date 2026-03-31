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

    const artItem = navItems.find(
        (item) => !item.fields.slug || item.fields.slug === "art"
    );
    const bioItem = navItems.find(
        (item) => item.fields.slug === "bio"
    );
    const contactItem = navItems.find(
        (item) => item.fields.slug === "contact"
    );

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
                <div className="flex justify-between items-center w-full max-w-xs">

                    {/* ART */}
                    {artItem && (
                        <Link
                            to="/"
                            className={`text-3xl transition ${isActive("art")
                                ? "underline"
                                : "hover:underline"
                                }`}
                        >
                            {artItem.fields.label}
                        </Link>
                    )}

                    {/* BIO (center naturally) */}
                    {bioItem && (
                        <Link
                            to="/bio"
                            className={`text-3xl transition ${isActive("bio")
                                ? "underline"
                                : "hover:underline"
                                }`}
                        >
                            {bioItem.fields.label}
                        </Link>
                    )}

                    {/* CONTACT */}
                    {contactItem && (
                        <Link
                            to="/contact"
                            className={`text-3xl transition ${isActive("contact")
                                ? "underline"
                                : "hover:underline"
                                }`}
                        >
                            {contactItem.fields.label}
                        </Link>
                    )}

                </div>
            </nav>

            {/* HERO */}
            {!isArtworkPage &&
                currentNav &&
                currentNav.fields.heroimage?.fields?.file?.url && (
                    <div className="w-full flex px-4 flex-col items-center">
                        <div className="flex flex-col">
                            <img
                                src={
                                    "https:" +
                                    currentNav.fields.heroimage.fields.file.url
                                }
                                alt={currentNav.fields.label}
                                className="lg:h-screen object-cover my-2"
                            />

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