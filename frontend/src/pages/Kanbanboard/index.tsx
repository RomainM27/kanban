import { useQuery } from "@tanstack/react-query";
import Layout from "../Layout";
import KanbanBoardContainer from "./KanbanBoardContainer";
import { Board } from "../../types";
import { getBoard } from "../../api/board";
import { wait } from "@/lib/utils";

function KanbanBoard() {
  const kanbanBoardQuery = useQuery<Board>({
    queryKey: ["boards", 1],
    queryFn: async () => {
      await wait(1000);
      return getBoard(1);
    },
  });

  if (kanbanBoardQuery.isLoading) {
    return <div>Loading...</div>;
  }
  if (kanbanBoardQuery.isError) {
    return <div>Error</div>;
  }

  if (!kanbanBoardQuery.data) {
    return <div>Erro no Data found</div>;
  }

  return (
    <Layout>
      <KanbanBoardContainer boardData={kanbanBoardQuery.data} />
    </Layout>
  );
}

export default KanbanBoard;
