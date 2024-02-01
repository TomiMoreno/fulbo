import { z } from "zod";

import { useState, useTransition } from "react";
import { useFormStatus } from "react-dom";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";
import { useValidatedForm } from "@/lib/hooks/useValidatedForm";

import { type Action, cn } from "@/lib/utils";
import { type TAddOptimistic } from "@/app/teams/useOptimisticTeams";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";


import { type Team, insertTeamParams } from "@/lib/db/schema/teams";
import {
  createTeamAction,
  deleteTeamAction,
  updateTeamAction,
} from "@/lib/actions/teams";


const TeamForm = ({
  
  team,
  openModal,
  closeModal,
  addOptimistic,
  postSuccess,
}: {
  team?: Team | null;
  
  openModal?: (team?: Team) => void;
  closeModal?: () => void;
  addOptimistic?: TAddOptimistic;
  postSuccess?: () => void;
}) => {
  const { errors, hasErrors, setErrors, handleChange } =
    useValidatedForm<Team>(insertTeamParams);
  const { toast } = useToast();
  const editing = !!team?.id;
  
  const [isDeleting, setIsDeleting] = useState(false);
  const [pending, startMutation] = useTransition();

  const router = useRouter();

  const onSuccess = (
    action: Action,
    data?: { error: string; values: Team },
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
      description: failed ? data?.error ?? "Error" : `Team ${action}d!`,
      variant: failed ? "destructive" : "default",
    });
  };

  const handleSubmit = async (data: FormData) => {
    setErrors(null);

    const payload = Object.fromEntries(data.entries());
    const teamParsed = await insertTeamParams.safeParseAsync(payload);
    if (!teamParsed.success) {
      setErrors(teamParsed?.error.flatten().fieldErrors);
      return;
    }

    closeModal && closeModal();
    const values = teamParsed.data;
    const pendingTeam: Team = {
      updatedAt: team?.updatedAt ?? new Date(),
      createdAt: team?.createdAt ?? new Date(),
      id: team?.id ?? "",
      ...values,
    };
    try {
      startMutation(async () => {
        addOptimistic && addOptimistic({
          data: pendingTeam,
          action: editing ? "update" : "create",
        });

        const error = editing
          ? await updateTeamAction({ ...values, id: team.id })
          : await createTeamAction(values);

        const errorFormatted = {
          error: error ?? "Error",
          values: pendingTeam 
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
          defaultValue={team?.name ?? ""}
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
            errors?.logo ? "text-destructive" : "",
          )}
        >
          Logo
        </Label>
        <Input
          type="text"
          name="logo"
          className={cn(errors?.logo ? "ring ring-destructive" : "")}
          defaultValue={team?.logo ?? ""}
        />
        {errors?.logo ? (
          <p className="text-xs text-destructive mt-2">{errors.logo[0]}</p>
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
              addOptimistic && addOptimistic({ action: "delete", data: team });
              const error = await deleteTeamAction(team.id);
              setIsDeleting(false);
              const errorFormatted = {
                error: error ?? "Error",
                values: team,
              };

              onSuccess("delete", error ? errorFormatted : undefined);
            });
            router.push("/teams");
          }}
        >
          Delet{isDeleting ? "ing..." : "e"}
        </Button>
      ) : null}
    </form>
  );
};

export default TeamForm;

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
