import { msToSeconds } from "@/lib/duration";
import { Card } from "../card";

interface ServicesCardProps {
    services: string;
    type: string;
    latency: number | null;
    intervalSeconds: number;
}

export default function ServicesCard({ services, type, latency, intervalSeconds }: ServicesCardProps) {

    return (
        <div>
            <Card className="w-60">
                <div className="pl-4">
                    <h3 className="text-lg font-semibold">{services}</h3>
                    <p className="text-sm text-muted-foreground">{type}</p>
                    <div className="w-full grid grid-cols-2 ">
                        <p className="text-sm text-muted-foreground">{latency != null ? `${latency} ms` : "N/A"}</p>
                        <p className="text-sm text-muted-foreground"> {intervalSeconds} s/ch</p>
                    </div>
                </div>
            </Card>
        </div>
    );
}