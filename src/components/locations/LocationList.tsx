"use client";

import { useState } from "react";
import Link from "next/link";

import { cn } from "@/lib/utils";
import { type Location, CompleteLocation } from "@/lib/db/schema/locations";
import Modal from "@/components/shared/Modal";

import { useOptimisticLocations } from "@/app/locations/useOptimisticLocations";
import { Button } from "@/components/ui/button";
import LocationForm from "./LocationForm";
import { PlusIcon } from "lucide-react";

type TOpenModal = (location?: Location) => void;

export default function LocationList({
  locations,
   
}: {
  locations: CompleteLocation[];
   
}) {
  const { optimisticLocations, addOptimisticLocation } = useOptimisticLocations(
    locations,
     
  );
  const [open, setOpen] = useState(false);
  const [activeLocation, setActiveLocation] = useState<Location | null>(null);
  const openModal = (location?: Location) => {
    setOpen(true);
    location ? setActiveLocation(location) : setActiveLocation(null);
  };
  const closeModal = () => setOpen(false);

  return (
    <div>
      <Modal
        open={open}
        setOpen={setOpen}
        title={activeLocation ? "Edit Location" : "Create Locations"}
      >
        <LocationForm
          location={activeLocation}
          addOptimistic={addOptimisticLocation}
          openModal={openModal}
          closeModal={closeModal}
          
        />
      </Modal>
      <div className="absolute right-0 top-0 ">
        <Button onClick={() => openModal()} variant={"outline"}>
          +
        </Button>
      </div>
      {optimisticLocations.length === 0 ? (
        <EmptyState openModal={openModal} />
      ) : (
        <ul>
          {optimisticLocations.map((location) => (
            <Location
              location={location}
              key={location.id}
              openModal={openModal}
            />
          ))}
        </ul>
      )}
    </div>
  );
}

const Location = ({
  location,
  openModal,
}: {
  location: CompleteLocation;
  openModal: TOpenModal;
}) => {
  const optimistic = location.id === "optimistic";
  const deleting = location.id === "delete";
  const mutating = optimistic || deleting;
  return (
    <li
      className={cn(
        "flex justify-between my-2",
        mutating ? "opacity-30 animate-pulse" : "",
        deleting ? "text-destructive" : "",
      )}
    >
      <div className="w-full">
        <div>{location.name}</div>
      </div>
      <Button variant={"link"} asChild>
        <Link href={"/locations/" + location.id }>
          Edit
        </Link>
      </Button>
    </li>
  );
};

const EmptyState = ({ openModal }: { openModal: TOpenModal }) => {
  return (
    <div className="text-center">
      <h3 className="mt-2 text-sm font-semibold text-secondary-foreground">
        No locations
      </h3>
      <p className="mt-1 text-sm text-muted-foreground">
        Get started by creating a new location.
      </p>
      <div className="mt-6">
        <Button onClick={() => openModal()}>
          <PlusIcon className="h-4" /> New Locations </Button>
      </div>
    </div>
  );
};
