import * as locations from "./locations";
import * as matches from "./matches";
import * as teams from "./teams";
import * as players from "./players";
import * as teamsToPlayers from "./teamsToPlayers";
export const schemas = {
  ...locations,
  ...matches,
  ...teams,
  ...players,
  ...teamsToPlayers,
};
