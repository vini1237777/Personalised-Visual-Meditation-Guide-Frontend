export default function axiosHandler(error: any) {
  if (error.response) {
    if (error.response.status === 401) {
      window.location.href = "/auth/register";
    }
    if (error.response.data.status === 406) {
      window.location.href = "/auth/register";
    }
  }
  return;
}
