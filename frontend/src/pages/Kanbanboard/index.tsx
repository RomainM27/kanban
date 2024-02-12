import { useQuery } from "@tanstack/react-query";
import Layout from "../Layout";
import KanbanBoardContainer from "./KanbanBoardContainer";
import { Board } from "../../types";
import { getFirstBoard } from "../../api/board";

function KanbanBoard() {
  const kanbanBoardQuery = useQuery<Board>({
    queryKey: ["boards", "first"],
    queryFn: async () => {
      return getFirstBoard();
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
