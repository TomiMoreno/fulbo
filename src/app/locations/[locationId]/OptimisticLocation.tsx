/* eslint-disable @next/next/no-img-element */
"use client";

import { useOptimistic, useState } from "react";
import { TAddOptimistic } from "@/app/locations/useOptimisticLocations";
import { type Location } from "@/lib/db/schema/locations";
import { cn } from "@/lib/utils";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Button } from "@/components/ui/button";
import Modal from "@/components/shared/Modal";
import LocationForm from "@/components/locations/LocationForm";
import Image from "next/image";

export default function OptimisticLocation({
  location,
}: {
  location: Location;
}) {
  const [open, setOpen] = useState(false);
  const openModal = (_?: Location) => {
    setOpen(true);
  };
  const closeModal = () => setOpen(false);
  const [optimisticLocation, setOptimisticLocation] = useOptimistic(location);
  const updateLocation: TAddOptimistic = (input) =>
    setOptimisticLocation({ ...input.data });

  return (
    <div className="m-4">
      <Modal open={open} setOpen={setOpen}>
        <LocationForm
          location={location}
          closeModal={closeModal}
          openModal={openModal}
          addOptimistic={updateLocation}
        />
      </Modal>
      <div className="flex justify-between items-end mb-4">
        <div className="flex items-center gap-4">
          <div className="flex justify-between items-end rounded w-10 h-10 bg-primary">
            <img
              src={location.picture}
              alt={location.name}
              className="w-full"
              width={50}
              height={50}
            />
          </div>
          <h1 className="font-semibold text-2xl">{location.name}</h1>
        </div>
        <Button className="" onClick={() => setOpen(true)}>
          Edit
        </Button>
      </div>
      <pre
        className={cn(
          "bg-secondary p-4 rounded-lg break-all text-wrap",
          optimisticLocation.id === "optimistic" ? "animate-pulse" : ""
        )}
      >
        {JSON.stringify(optimisticLocation, null, 2)}
      </pre>
    </div>
  );
}
