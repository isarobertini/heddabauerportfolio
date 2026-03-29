import { useEffect, useState } from "react";
import { client } from "../lib/contentful";

export const ContactPage = () => {
    const [contactEntry, setContactEntry] = useState(null);

    useEffect(() => {
        async function fetchContact() {
            try {
                const res = await client.getEntries({
                    content_type: "contact",
                    limit: 1,
                });

                console.log("CONTACT RES:", res);

                if (res.items.length > 0) {
                    setContactEntry(res.items[0]);
                }
            } catch (err) {
                console.error("Error fetching contact page:", err);
            }
        }

        fetchContact();
    }, []);

    if (!contactEntry) return <div>Loading...</div>;

    const { contact } = contactEntry.fields;

    return (
        <div className="max-w-3xl mx-auto px-4 flex flex-col items-center text-center">

            <h1 className="text-2xl">Contact</h1>

            {contact && (
                <a
                    href={`mailto:${contact}`}
                    className="underline"
                >
                    {contact}
                </a>
            )}
        </div>
    );
};