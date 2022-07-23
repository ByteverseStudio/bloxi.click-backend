export const jwtCommon = {
  secret: process.env.NODE_ENV.trim() == 'dev' ? 'abcd' : process.env.JWT_SECRET.trim(),
  expiresIn: "30m"
}