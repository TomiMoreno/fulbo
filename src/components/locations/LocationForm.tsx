import { z } from "zod";

import { useState, useTransition } from "react";
import { useFormStatus } from "react-dom";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";
import { useValidatedForm } from "@/lib/hooks/useValidatedForm";

import { type Action, cn } from "@/lib/utils";
import { type TAddOptimistic } from "@/app/locations/useOptimisticLocations";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";



import { type Location, insertLocationParams } from "@/lib/db/schema/locations";
import {
  createLocationAction,
  deleteLocationAction,
  updateLocationAction,
} from "@/lib/actions/locations";


const LocationForm = ({
  
  location,
  openModal,
  closeModal,
  addOptimistic,
  postSuccess,
}: {
  location?: Location | null;
  
  openModal?: (location?: Location) => void;
  closeModal?: () => void;
  addOptimistic?: TAddOptimistic;
  postSuccess?: () => void;
}) => {
  const { errors, hasErrors, setErrors, handleChange } =
    useValidatedForm<Location>(insertLocationParams);
  const { toast } = useToast();
  const editing = !!location?.id;
  
  const [isDeleting, setIsDeleting] = useState(false);
  const [pending, startMutation] = useTransition();

  const router = useRouter();

  const onSuccess = (
    action: Action,
    data?: { error: string; values: Location },
  ) => {
    const failed = Boolean(data?.error);
    if (failed) {
      openModal && openModal(data?.values);
    } else {
      router.refresh();
      postSuccess && postSuccess();
    }

    toast({
      title: failed ? `Failed to ${action}` : "Success",
      description: failed ? data?.error ?? "Error" : `Location ${action}d!`,
      variant: failed ? "destructive" : "default",
    });
  };

  const handleSubmit = async (data: FormData) => {
    setErrors(null);

    const payload = Object.fromEntries(data.entries());
    const locationParsed = await insertLocationParams.safeParseAsync(payload);
    if (!locationParsed.success) {
      setErrors(locationParsed?.error.flatten().fieldErrors);
      return;
    }

    closeModal && closeModal();
    const values = locationParsed.data;
    const pendingLocation: Location = {
      updatedAt: location?.updatedAt ?? new Date(),
      createdAt: location?.createdAt ?? new Date(),
      id: location?.id ?? "",
      ...values,
    };
    try {
      startMutation(async () => {
        addOptimistic && addOptimistic({
          data: pendingLocation,
          action: editing ? "update" : "create",
        });

        const error = editing
          ? await updateLocationAction({ ...values, id: location.id })
          : await createLocationAction(values);

        const errorFormatted = {
          error: error ?? "Error",
          values: pendingLocation 
        };
        onSuccess(
          editing ? "update" : "create",
          error ? errorFormatted : undefined,
        );
      });
    } catch (e) {
      if (e instanceof z.ZodError) {
        setErrors(e.flatten().fieldErrors);
      }
    }
  };

  return (
    <form action={handleSubmit} onChange={handleChange} className={"space-y-8"}>
      {/* Schema fields start */}
              <div>
        <Label
          className={cn(
            "mb-2 inline-block",
            errors?.name ? "text-destructive" : "",
          )}
        >
          Name
        </Label>
        <Input
          type="text"
          name="name"
          className={cn(errors?.name ? "ring ring-destructive" : "")}
          defaultValue={location?.name ?? ""}
        />
        {errors?.name ? (
          <p className="text-xs text-destructive mt-2">{errors.name[0]}</p>
        ) : (
          <div className="h-6" />
        )}
      </div>
        <div>
        <Label
          className={cn(
            "mb-2 inline-block",
            errors?.address ? "text-destructive" : "",
          )}
        >
          Address
        </Label>
        <Input
          type="text"
          name="address"
          className={cn(errors?.address ? "ring ring-destructive" : "")}
          defaultValue={location?.address ?? ""}
        />
        {errors?.address ? (
          <p className="text-xs text-destructive mt-2">{errors.address[0]}</p>
        ) : (
          <div className="h-6" />
        )}
      </div>
        <div>
        <Label
          className={cn(
            "mb-2 inline-block",
            errors?.link ? "text-destructive" : "",
          )}
        >
          Link
        </Label>
        <Input
          type="text"
          name="link"
          className={cn(errors?.link ? "ring ring-destructive" : "")}
          defaultValue={location?.link ?? ""}
        />
        {errors?.link ? (
          <p className="text-xs text-destructive mt-2">{errors.link[0]}</p>
        ) : (
          <div className="h-6" />
        )}
      </div>
        <div>
        <Label
          className={cn(
            "mb-2 inline-block",
            errors?.picture ? "text-destructive" : "",
          )}
        >
          Picture
        </Label>
        <Input
          type="text"
          name="picture"
          className={cn(errors?.picture ? "ring ring-destructive" : "")}
          defaultValue={location?.picture ?? ""}
        />
        {errors?.picture ? (
          <p className="text-xs text-destructive mt-2">{errors.picture[0]}</p>
        ) : (
          <div className="h-6" />
        )}
      </div>
      {/* Schema fields end */}

      {/* Save Button */}
      <SaveButton errors={hasErrors} editing={editing} />

      {/* Delete Button */}
      {editing ? (
        <Button
          type="button"
          disabled={isDeleting || pending || hasErrors}
          variant={"destructive"}
          onClick={() => {
            setIsDeleting(true);
            closeModal && closeModal();
            startMutation(async () => {
              addOptimistic && addOptimistic({ action: "delete", data: location });
              const error = await deleteLocationAction(location.id);
              setIsDeleting(false);
              const errorFormatted = {
                error: error ?? "Error",
                values: location,
              };

              onSuccess("delete", error ? errorFormatted : undefined);
            });
            router.push("/locations");
          }}
        >
          Delet{isDeleting ? "ing..." : "e"}
        </Button>
      ) : null}
    </form>
  );
};

export default LocationForm;

const SaveButton = ({
  editing,
  errors,
}: {
  editing: Boolean;
  errors: boolean;
}) => {
  const { pending } = useFormStatus();
  const isCreating = pending && editing === false;
  const isUpdating = pending && editing === true;
  return (
    <Button
      type="submit"
      className="mr-2"
      disabled={isCreating || isUpdating || errors}
      aria-disabled={isCreating || isUpdating || errors}
    >
      {editing
        ? `Sav${isUpdating ? "ing..." : "e"}`
        : `Creat${isCreating ? "ing..." : "e"}`}
    </Button>
  );
};
