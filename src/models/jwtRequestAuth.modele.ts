export interface JwtRequest {
    grantType: "password" | "refreshToken"
    email: string;
    password: string;
    refreshToken: string;
}