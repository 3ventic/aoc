import { Position2D } from "../common/position2d";
import { Team } from "./team";

export type Unit = {
	position: Position2D;
	health: number;
	team: Team;
};
