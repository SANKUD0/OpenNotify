"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import ServicesCard from "@/components/ui/services/ServicesCard";
import { api } from "@/lib/api";
import { useEffect, useState } from "react";

export default function ServicesPage() {
    const [services, setServices] = useState<any[]>([]);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        api.services.getAll()
            .then((data) => setServices(data))
            .catch((err) => setError(err.message));
    }, []);

    return (
        <div className="m-10">
            <div className="mb-6">
                <Card>
                    <CardHeader>
                        <div className="flex justify-between items-center">
                            <CardTitle>Services</CardTitle>
                            <Button>+ Add Service</Button>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                            {error ? <p className="text-sm text-destructive text-center">{error}</p> : (
                                <>
                                    {services.map((service) => (
                                        <div key={service.id}>
                                            <ServicesCard
                                                services={service.name}
                                                type={service.type}
                                                latency={service.latency}
                                                intervalSeconds={service.intervalSeconds} />
                                        </div>
                                    ))}
                                </>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}