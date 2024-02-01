import { z } from "zod";

import { useToast } from "@/components/ui/use-toast";
import { useValidatedForm } from "@/lib/hooks/useValidatedForm";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { useFormStatus } from "react-dom";

import { type TAddOptimistic } from "@/app/players/useOptimisticPlayers";
import { cn, type Action } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import { Checkbox } from "@/components/ui/checkbox";

import {
  createPlayerAction,
  deletePlayerAction,
  updatePlayerAction,
} from "@/lib/actions/players";
import { insertPlayerParams, type Player } from "@/lib/db/schema/players";

const PlayerForm = ({
  player,
  openModal,
  closeModal,
  addOptimistic,
  postSuccess,
}: {
  player?: Player | null;

  openModal?: (player?: Player) => void;
  closeModal?: () => void;
  addOptimistic?: TAddOptimistic;
  postSuccess?: () => void;
}) => {
  const { errors, hasErrors, setErrors, handleChange } =
    useValidatedForm<Player>(insertPlayerParams);
  const { toast } = useToast();
  const editing = !!player?.id;

  const [isDeleting, setIsDeleting] = useState(false);
  const [pending, startMutation] = useTransition();

  const router = useRouter();

  const onSuccess = (
    action: Action,
    data?: { error: string; values: Player }
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
      description: failed ? data?.error ?? "Error" : `Player ${action}d!`,
      variant: failed ? "destructive" : "default",
    });
  };

  const handleSubmit = async (data: FormData) => {
    setErrors(null);

    const payload = Object.fromEntries(data.entries());
    const playerParsed = await insertPlayerParams.safeParseAsync(payload);
    if (!playerParsed.success) {
      setErrors(playerParsed?.error.flatten().fieldErrors);
      return;
    }

    closeModal && closeModal();
    const values = playerParsed.data;
    const pendingPlayer: Player = {
      updatedAt: player?.updatedAt ?? new Date(),
      createdAt: player?.createdAt ?? new Date(),
      id: player?.id ?? "",
      userId: player?.userId ?? "",
      ...values,
    };
    try {
      startMutation(async () => {
        addOptimistic &&
          addOptimistic({
            data: pendingPlayer,
            action: editing ? "update" : "create",
          });

        const error = editing
          ? await updatePlayerAction({ ...values, id: player.id })
          : await createPlayerAction(values);

        const errorFormatted = {
          error: error ?? "Error",
          values: pendingPlayer,
        };
        onSuccess(
          editing ? "update" : "create",
          error ? errorFormatted : undefined
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
            errors?.name ? "text-destructive" : ""
          )}
        >
          Name
        </Label>
        <Input
          type="text"
          name="name"
          className={cn(errors?.name ? "ring ring-destructive" : "")}
          defaultValue={player?.name ?? ""}
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
            errors?.isMale ? "text-destructive" : ""
          )}
        >
          Is Male
        </Label>
        <br />
        <Checkbox
          defaultChecked={player?.isMale}
          name={"isMale"}
          className={cn(errors?.isMale ? "ring ring-destructive" : "")}
        />
        {errors?.isMale ? (
          <p className="text-xs text-destructive mt-2">{errors.isMale[0]}</p>
        ) : (
          <div className="h-6" />
        )}
      </div>
      <div>
        <Label
          className={cn(
            "mb-2 inline-block",
            errors?.age ? "text-destructive" : ""
          )}
        >
          Age
        </Label>
        <Input
          type="text"
          name="age"
          className={cn(errors?.age ? "ring ring-destructive" : "")}
          defaultValue={player?.age ?? ""}
        />
        {errors?.age ? (
          <p className="text-xs text-destructive mt-2">{errors.age[0]}</p>
        ) : (
          <div className="h-6" />
        )}
      </div>
      <div>
        <Label
          className={cn(
            "mb-2 inline-block",
            errors?.height ? "text-destructive" : ""
          )}
        >
          Height (cm)
        </Label>
        <Input
          type="text"
          name="height"
          className={cn(errors?.height ? "ring ring-destructive" : "")}
          defaultValue={player?.height ?? ""}
        />
        {errors?.height ? (
          <p className="text-xs text-destructive mt-2">{errors.height[0]}</p>
        ) : (
          <div className="h-6" />
        )}
      </div>
      <div>
        <Label
          className={cn(
            "mb-2 inline-block",
            errors?.profilePicture ? "text-destructive" : ""
          )}
        >
          Profile Picture
        </Label>
        <Input
          type="text"
          name="profilePicture"
          className={cn(errors?.profilePicture ? "ring ring-destructive" : "")}
          defaultValue={player?.profilePicture ?? ""}
        />
        {errors?.profilePicture ? (
          <p className="text-xs text-destructive mt-2">
            {errors.profilePicture[0]}
          </p>
        ) : (
          <div className="h-6" />
        )}
      </div>
      <div>
        <Label
          className={cn(
            "mb-2 inline-block",
            errors?.nickname ? "text-destructive" : ""
          )}
        >
          Nickname
        </Label>
        <Input
          type="text"
          name="nickname"
          className={cn(errors?.nickname ? "ring ring-destructive" : "")}
          defaultValue={player?.nickname ?? ""}
        />
        {errors?.nickname ? (
          <p className="text-xs text-destructive mt-2">{errors.nickname[0]}</p>
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
              addOptimistic &&
                addOptimistic({ action: "delete", data: player });
              const error = await deletePlayerAction(player.id);
              setIsDeleting(false);
              const errorFormatted = {
                error: error ?? "Error",
                values: player,
              };

              onSuccess("delete", error ? errorFormatted : undefined);
            });
            router.push("/players");
          }}
        >
          Delet{isDeleting ? "ing..." : "e"}
        </Button>
      ) : null}
    </form>
  );
};

export default PlayerForm;

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
