import { useEffect, useState } from "react";
import { client } from "../lib/contentful";
import { Helmet } from "react-helmet-async";

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

    if (!contactEntry) {
        return (
            <>
                <Helmet>
                    <title>Contact | Hedda Bauer</title>
                </Helmet>
                <div>Loading...</div>
            </>
        );
    }

    const { contact } = contactEntry.fields;

    return (
        <>
            <Helmet>
                <title>Contact | Hedda Bauer</title>

                <meta
                    name="description"
                    content="Contact Hedda Bauer."
                />

                {/* Open Graph */}
                <meta property="og:title" content="Contact | Hedda Bauer" />
                <meta
                    property="og:description"
                    content="Contact Hedda Bauer."
                />

                {/* Canonical URL */}
                <link
                    rel="canonical"
                    href="https://heddabauer.com/contact"
                />
            </Helmet>

            <div className="max-w-3xl mx-auto flex flex-col items-center text-center">

                <h1 className="font-light text-2xl pt-12">Contact</h1>

                {contact && (
                    <a
                        href={`mailto:${contact}`}
                        className="py-2 text-2xl"
                    >
                        {contact}
                    </a>
                )}
            </div>
        </>
    );
};