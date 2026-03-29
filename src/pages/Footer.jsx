import { useEffect, useState } from "react";
import { client } from "../lib/contentful";

export const Footer = () => {
    const [footer, setFooter] = useState(null);

    useEffect(() => {
        async function fetchFooter() {
            try {
                const res = await client.getEntries({
                    content_type: "footer",
                    limit: 1,
                });

                if (res.items.length > 0) {
                    setFooter(res.items[0]);
                }
            } catch (err) {
                console.error("Error fetching footer:", err);
            }
        }

        fetchFooter();
    }, []);

    if (!footer) return null;

    const { contact, rightsReserved } = footer.fields;

    return (
        <div className="mt-20 mb-3 text-sm font-light flex flex-col items-center gap-2">
            <div className="h-0.5 w-full lg:w-5/6 bg-[#8c0013]"></div>
            {/* CONTACT EMAIL */}
            {contact && (
                <a href={`mailto:${contact}`} className="hover:underline">
                    {contact}
                </a>
            )}

            {/* COPYRIGHT / RIGHTS */}
            {rightsReserved && (
                <div className="text-gray-500">
                    {rightsReserved}
                </div>
            )}
            <div className="h-0.5 w-full lg:w-5/6 bg-[#8c0013]"></div>
        </div>
    );
};