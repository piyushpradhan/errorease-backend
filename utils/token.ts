export function extractTokensFromBearer(bearerToken: string) {
  const tokens = bearerToken.split(";");
  const accessToken = tokens[0]?.split("Bearer accessToken=")[1];
  const refreshToken = tokens[1]?.split("refreshToken=")[1];

  return { accessToken, refreshToken };
}
