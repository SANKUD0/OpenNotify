"use client";

import { StatCard } from "@/components/StatCard";
import { Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { api } from "@/lib/api";
import { useEffect, useState } from "react";

export default function Home() {
  const [count, setCount] = useState<number | null>(null);
  const [up, setUp] = useState<number | null>(null);
  const [down, setDown] = useState<number | null>(null);
  const [incidents, setIncidents] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [errorCount, setErrorCount] = useState<string | null>(null);
  const [errorUp, setErrorUp] = useState<string | null>(null);
  const [errorDown, setErrorDown] = useState<string | null>(null);
  const [errorIncidents, setErrorIncidents] = useState<string | null>(null);

  useEffect(() => {
    api.services.getCount()
      .then((data) => setCount(data.count))
      .catch((err) => setErrorCount(err.message))
      .finally(() => setLoading(false));

    api.services.getCountUp()
      .then((data) => setUp(data.UpServices))
      .catch((err) => setErrorUp(err.message))
      .finally(() => setLoading(false));

    api.services.getCountDown()
      .then((data) => setDown(data.DownServices))
      .catch((err) => setErrorDown(err.message))
      .finally(() => setLoading(false));

    api.incidents.getCount()
      .then((data) => setIncidents(data.count))
      .catch((err) => setErrorIncidents(err.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <div className="grid grid-cols-4 gap-5 mb-4  text-center pl-10 pr-10">
        <StatCard title="Registered Services" value={count} error={errorCount} />
        <StatCard title="Services UP" value={up} error={errorUp} />
        <StatCard title="Services DOWN" value={down} error={errorDown} />
        <StatCard title="Incidents OPEN" value={incidents} error={errorIncidents} />
      </div>
    </div>
  );
}
