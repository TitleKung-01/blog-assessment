export type UserRole = "USER" | "ADMIN";

export type SessionPayload = {
  sub: string;
  role: UserRole;
  exp: number;
  n: string;
};

export type SessionUser = {
  name: string;
  email: string;
  role: UserRole;
};

export type SessionResponse = {
  authenticated?: boolean;
  user?: SessionUser;
};

export type AuthMode = "sign-in" | "sign-up";

export type AuthFormProps = {
  mode: AuthMode;
  role: UserRole;
  title: string;
  description: string;
  alternateHref: string;
  alternateLabel: string;
};
