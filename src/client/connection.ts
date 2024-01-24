import { Connection } from "../shared/types";

const getConnectionProps = (): Connection => {
  const searchParams = new URLSearchParams(location.search);
  const username = searchParams.get("username") ?? "";
  const roomId = searchParams.get("room") ?? "";
  const connection: Connection = {
    user: {
      name: username,
    },
    roomId,
  };
  return connection;
};

export { getConnectionProps };
