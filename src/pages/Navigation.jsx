import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { client } from "../lib/contentful";

export const Navigation = () => {
    const [navItems, setNavItems] = useState([]);

    useEffect(() => {
        async function fetchNav() {
            const res = await client.getEntries({
                content_type: "navigationItem",
                order: "fields.order",
            });
            console.log("Navigation items:", res.items);
            setNavItems(res.items);
        }
        fetchNav();
    }, []);

    return (
        <nav className="bg-gray-800 text-white p-4">
            <ul className="flex space-x-6">
                {navItems.map((item) => {
                    // Determine the route for this nav item
                    let to = "/";
                    if (item.fields.slug) {
                        to = `/${item.fields.slug}`;
                    }

                    return (
                        <li key={item.sys.id}>
                            <Link
                                to={to}
                                className="hover:text-yellow-300 transition-colors duration-200 font-semibold"
                            >
                                {item.fields.label}
                            </Link>
                        </li>
                    );
                })}
            </ul>
        </nav>
    );
};