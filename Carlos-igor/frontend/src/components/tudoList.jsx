import axios from "axios";
import React from "react";
import { Table, Button } from 'react-bootstrap';
import EditForm from "./EditForm";

const TodoList = ({tarefas, setTarefas}) => {

  const [show, setShow] = React.useState(false)
  const [onEdit, setOnEdit] = React.useState(null)

  const handleEdit = (tarefa) => {
    setOnEdit(tarefa)
    setShow(true)
  }

  const handleSubmitEdit = async(editedTarefa) => {
    try {
      await axios.put(
      `http://localhost:3333/tarefa/${editedTarefa.id}`,
      editedTarefa
      );

      setTarefas((prevTarefa) =>
      prevTarefa.map((tarefa) =>
      tarefa.id === editedTarefa.id ? editedTarefa : tarefa
      )
    );

      setShow(false)
    } catch (error) {
       console.log("Error ao atualizar a tarefa", error)
    }
    setTarefas()

  }

    const handleDelete = async (id) => {
      try {
        await axios.delete(`http://localhost:3333/api/tarefas/${id}`);
        setTarefas(tarefas.filter((tarefa) => tarefa.id !== id));
      } catch {
        console.log("Não foi possivel fazer a exclusão");
      }
    };

  return (
    <>
    <Table striped bordered hover>
      <thead>
        <tr>
          <th>#</th>
          <th>Tarefas</th>
          <th>Descrição</th>
          <th>Status</th>
          <th>Ação</th>
        </tr>
      </thead>
      {tarefas.map((tarefa, index) => (
         <tbody key={index}>
         <tr>
           <td>{tarefa.tarefa}</td>
           <td>{tarefa.descricao}</td>
           <td>{tarefa.status}</td>
           <td>
            <Button variant="danger" onClick={() => handleDelete(tarefa.id)}>Deletar</Button>
            <Button variant="warning" onClick={() => handleEdit(tarefa)}>Editar</Button>
           </td>
         </tr>
       </tbody>
      ))}
    </Table>
    <EditForm
    show={show}
    handleClose={() => setShow(false)}
    tarefa={onEdit}
    />
    </>
  );
};

export default TodoList;