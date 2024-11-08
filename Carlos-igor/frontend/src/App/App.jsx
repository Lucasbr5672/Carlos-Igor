import React from "react";
import TodoForm from "../components/TodoForm";
import { Container } from "react-bootstrap";
import TodoList from "../components/tudoList";
import axios from "axios";

const App = () => {

  const [tarefas, setTarefas] = React.useState([])

  React.useEffect(() => {

      const handleGetList = async () => {
          try {
              const response = await axios.get("http://localhost:3333/api/tarefas")
               setTarefas(response.data.tarefas)
            
          } catch {
              console.log("Não foi possível obter dados")
          }
      }

      handleGetList()
  }, []);
    return (
        <>
        <Container>
          <TodoForm />
          <TodoList tarefas={tarefas} setTarefas={setTarefas}/>
        </Container>
        </>
    )
}

export default App;