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
                <div className="">

                    {navItems.map((item) => {
                        const slug = item.fields.slug;
                        const label = item.fields.label;

                        return (
                            <Link
                                key={item.sys.id}
                                to={getPath(slug)}
                                className={`text-3xl px-2 gap-4 lg:gap-6 transition ${isActive(slug)
                                    ? "underline"
                                    : "hover:underline"
                                    }`}
                            >
                                {label}
                            </Link>
                        );
                    })}

                </div>
            </nav>

            {/* HERO (only NOT artwork page) */}
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