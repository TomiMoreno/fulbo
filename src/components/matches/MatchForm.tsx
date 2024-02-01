"use client";

import {
  Match,
  NewMatchParams,
  insertMatchParams,
} from "@/lib/db/schema/matches";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { trpc } from "@/lib/trpc/client";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { z } from "zod";

const MatchForm = ({
  match,
  closeModal,
}: {
  match?: Match;
  closeModal?: () => void;
}) => {
  const { toast } = useToast();
  const { data: players } = trpc.players.getPlayers.useQuery();
  const editing = !!match?.id;

  const router = useRouter();
  const utils = trpc.useContext();

  const form = useForm<z.infer<typeof insertMatchParams>>({
    // latest Zod release has introduced a TS error with zodResolver
    // open issue: https://github.com/colinhacks/zod/issues/2663
    // errors locally but not in production
    resolver: zodResolver(insertMatchParams),
    defaultValues: match ?? {
      playDate: "",
      playerId: "",
      homeScore: 0,
      awayScore: 0,
    },
  });

  const onSuccess = async (
    action: "create" | "update" | "delete",
    data?: { error?: string }
  ) => {
    if (data?.error) {
      toast({
        title: `${action
          .slice(0, 1)
          .toUpperCase()
          .concat(action.slice(1))} Failed`,
        description: data.error,
        variant: "destructive",
      });
      return;
    }

    await utils.matches.getMatches.invalidate();
    router.refresh();
    if (closeModal) closeModal();
    toast({
      title: "Success",
      description: `Match ${action}d!`,
      variant: "default",
    });
  };

  const { mutate: createMatch, isLoading: isCreating } =
    trpc.matches.createMatch.useMutation({
      onSuccess: (res) => onSuccess("create"),
    });

  const { mutate: updateMatch, isLoading: isUpdating } =
    trpc.matches.updateMatch.useMutation({
      onSuccess: (res) => onSuccess("update"),
    });

  const { mutate: deleteMatch, isLoading: isDeleting } =
    trpc.matches.deleteMatch.useMutation({
      onSuccess: (res) => onSuccess("delete"),
    });

  const handleSubmit = (values: NewMatchParams) => {
    if (editing) {
      updateMatch({ ...values, id: match.id });
    } else {
      createMatch(values);
    }
  };
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className={"space-y-8"}>
        <FormField
          control={form.control}
          name="playDate"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Play Date</FormLabel>
              <br />
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-[240px] pl-3 text-left font-normal",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value ? (
                        format(new Date(field.value), "PPP")
                      ) : (
                        <span>Pick a date</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={new Date(field.value)}
                    onSelect={field.onChange}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>

              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="playerId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Organizer Id</FormLabel>
              <FormControl>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={String(field.value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a player" />
                  </SelectTrigger>
                  <SelectContent>
                    {players?.players.map((player) => (
                      <SelectItem key={player.id} value={player.id.toString()}>
                        {player.name}{" "}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="homeScore"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Home Score</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="awayScore"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Away Score</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>

              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          type="submit"
          className="mr-1"
          disabled={isCreating || isUpdating}
        >
          {editing
            ? `Sav${isUpdating ? "ing..." : "e"}`
            : `Creat${isCreating ? "ing..." : "e"}`}
        </Button>
        {editing ? (
          <Button
            type="button"
            variant={"destructive"}
            onClick={() => deleteMatch({ id: match.id })}
          >
            Delet{isDeleting ? "ing..." : "e"}
          </Button>
        ) : null}
      </form>
    </Form>
  );
};

export default MatchForm;
