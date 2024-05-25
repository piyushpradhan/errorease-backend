export function extractTokensFromBearer(bearerToken: string) {
  const tokens = bearerToken.split(";");
  const accessToken = tokens[0]?.split("access_token=")[1];
  const refreshToken = tokens[1]?.split("refresh_token=")[1];

  return { accessToken, refreshToken };
}
