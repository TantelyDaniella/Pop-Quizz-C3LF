export type Player = {
  playerId: number;
  username: string;
  email: string;
  avatarUrl: string;
  createdAt: string;
};

export type UpdatePlayerPayload = {
  username?: string;
  email?: string;
  avatarUrl?: string;
};


export type PlayersResponse = {
  data: Player[];
};