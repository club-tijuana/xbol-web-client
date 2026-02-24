import { requestAxios } from "@/helpers/axiosHelper";
import { AuthDto } from "@/models/auth.dto";

export async function login(username: string, password: string): Promise<AuthDto> {
    return requestAxios<{ username: string; password: string }, AuthDto>(
        "POST",
        "account/sign-in",
        { username, password }
    );
}