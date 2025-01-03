import axios from "axios";
const config = useRuntimeConfig();
export const HOSTNAME = config.public.serverUrl;

export async function request(method, url, data, auth = false) {
  const token = useCookie("token").value;
  const user = useCookie("user").value;

  const headers = {};
  if (token) {
    headers["authorization"] = token;
  }
  if (user) {
    headers["branch-id"] = user.branch_id;
  }
  try {
    const response = await axios({
      method,
      url,
      data,
      headers,
    });
    return response;
  } catch (error) {
    console.log("api-error", error);
    // if (error.response.status === 401) {
    //   useCookie("user").value = null;
    //   useCookie("token").value = null;
    //   useCookie("isLogin").value = false;

    //   window.location.href = "/login";
    // }
    return error;
  }
}
