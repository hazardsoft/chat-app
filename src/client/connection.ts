import { Connection } from "../shared/types";

const getConnectionProps = (): Connection => {
  const searchParams = new URLSearchParams(location.search);
  const username = searchParams.get("username") ?? "";
  const room = searchParams.get("room") ?? "";
  const connection: Connection = {
    user: {
      name: username,
    },
    room,
  };
  return connection;
};

export { getConnectionProps };
